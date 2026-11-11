import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  HubData,
  RoadmapItem,
  RoadmapItemInput,
  RoadmapOrg,
  RoadmapStatus,
  RoutineTask,
  RoutineTaskInput,
  SyncStatus
} from '../types';
import { seedData } from './seed';
import * as db from './db';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function nextRoadmapStatus(status: RoadmapStatus): RoadmapStatus {
  if (status === 'Pending') return 'In Progress';
  if (status === 'In Progress') return 'Done';
  return 'Pending';
}

export interface NewProjectInput {
  title: string;
  client: string;
  type: string;
  revisions: string;
  status: string;
}

interface Positioned {
  position: number;
}

/** Move an item one slot up (-1) or down (+1), re-indexing positions 0..n-1. */
function moveInList<T extends Positioned & { id: string }>(items: T[], id: string, dir: -1 | 1): T[] {
  const sorted = [...items].sort((a, b) => a.position - b.position);
  const idx = sorted.findIndex((i) => i.id === id);
  const swap = idx + dir;
  if (idx < 0 || swap < 0 || swap >= sorted.length) return sorted;
  [sorted[idx], sorted[swap]] = [sorted[swap], sorted[idx]];
  return sorted.map((item, position) => ({ ...item, position }));
}

function nextPosition<T extends Positioned>(items: T[]): number {
  return items.reduce((max, item) => Math.max(max, item.position), -1) + 1;
}

export function useHub() {
  const [data, setData] = useState<HubData>(() => clone(seedData));
  const [status, setStatus] = useState<SyncStatus>('loading');
  const dataRef = useRef(data);
  dataRef.current = data;

  const refresh = useCallback(async () => {
    try {
      const { data: fresh, cloud } = await db.loadAll();
      dataRef.current = fresh;
      setData(fresh);
      setStatus(cloud ? 'live' : 'local');
    } catch {
      // Transient cloud failure: keep current view. Never loaded: fall back local.
      setStatus((prev) => {
        if (prev === 'loading') {
          const local = db.loadLocalData();
          dataRef.current = local;
          setData(local);
          return 'local';
        }
        return prev;
      });
    }
  }, []);

  useEffect(() => {
    void refresh();
    // Debounce refetches so multi-row writes don't trigger a refetch storm.
    let timer: number | undefined;
    const unsub = db.subscribeToChanges(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => void refresh(), 350);
    });
    return () => {
      window.clearTimeout(timer);
      unsub();
    };
  }, [refresh]);

  const runMutation = useCallback(
    (mutate: (prev: HubData) => HubData, persist: (next: HubData) => Promise<void>) => {
      const next = mutate(dataRef.current);
      dataRef.current = next;
      setData(next);
      persist(next).catch(() => {
        void refresh();
      });
    },
    [refresh]
  );

  // --- Routine drills ---
  const toggleRoutineTask = useCallback(
    (id: string) => {
      runMutation(
        (prev) => ({
          ...prev,
          routine: prev.routine.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        }),
        (next) => db.persistRoutine(next)
      );
    },
    [runMutation]
  );

  const addRoutineTask = useCallback(
    (input: RoutineTaskInput) => {
      runMutation(
        (prev) => {
          const task: RoutineTask = {
            id: `task-${Date.now()}`,
            completed: false,
            position: nextPosition(prev.routine),
            ...input
          };
          return { ...prev, routine: [...prev.routine, task] };
        },
        (next) => db.persistRoutine(next)
      );
    },
    [runMutation]
  );

  const updateRoutineTask = useCallback(
    (id: string, input: RoutineTaskInput) => {
      runMutation(
        (prev) => ({
          ...prev,
          routine: prev.routine.map((t) => (t.id === id ? { ...t, ...input } : t))
        }),
        (next) => db.persistRoutine(next)
      );
    },
    [runMutation]
  );

  const deleteRoutineTask = useCallback(
    (id: string) => {
      runMutation(
        (prev) => ({ ...prev, routine: prev.routine.filter((t) => t.id !== id) }),
        (next) => db.deleteRoutineItem(next, id)
      );
    },
    [runMutation]
  );

  const moveRoutineTask = useCallback(
    (id: string, dir: -1 | 1) => {
      runMutation(
        (prev) => ({ ...prev, routine: moveInList(prev.routine, id, dir) }),
        (next) => db.persistRoutine(next)
      );
    },
    [runMutation]
  );

  const resetRoutine = useCallback(() => {
    runMutation(
      (prev) => ({ ...prev, routine: prev.routine.map((t) => ({ ...t, completed: false })) }),
      (next) => db.persistRoutine(next)
    );
  }, [runMutation]);

  // --- QC checklist ---
  const toggleQcItem = useCallback(
    (id: string) => {
      runMutation(
        (prev) => ({
          ...prev,
          qc: prev.qc.map((i) => (i.id === id ? { ...i, done: !i.done } : i))
        }),
        (next) => db.persistQcItems(next)
      );
    },
    [runMutation]
  );

  const resetQcChecklist = useCallback(() => {
    runMutation(
      (prev) => ({ ...prev, qc: prev.qc.map((i) => ({ ...i, done: false })) }),
      (next) => db.persistQcItems(next)
    );
  }, [runMutation]);

  // --- Projects ---
  const addProject = useCallback(
    (input: NewProjectInput) => {
      const project = {
        id: `proj-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...input
      };
      runMutation(
        (prev) => ({ ...prev, projects: [project, ...prev.projects] }),
        (next) => db.persistNewProject(next, project.id)
      );
    },
    [runMutation]
  );

  const deleteProject = useCallback(
    (id: string) => {
      runMutation(
        (prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }),
        (next) => db.persistProjectDeletion(next, id)
      );
    },
    [runMutation]
  );

  // --- Roadmap tracker ---
  const cycleRoadmapItem = useCallback(
    (id: string) => {
      runMutation(
        (prev) => ({
          ...prev,
          roadmap: prev.roadmap.map((r) =>
            r.id === id ? { ...r, status: nextRoadmapStatus(r.status) } : r
          )
        }),
        (next) => db.persistRoadmap(next)
      );
    },
    [runMutation]
  );

  const addRoadmapItem = useCallback(
    (org: RoadmapOrg, input: RoadmapItemInput) => {
      runMutation(
        (prev) => {
          const item: RoadmapItem = {
            id: `road-${Date.now()}`,
            org,
            position: nextPosition(prev.roadmap.filter((r) => r.org === org)),
            ...input
          };
          return { ...prev, roadmap: [...prev.roadmap, item] };
        },
        (next) => db.persistRoadmap(next)
      );
    },
    [runMutation]
  );

  const updateRoadmapItem = useCallback(
    (id: string, input: RoadmapItemInput) => {
      runMutation(
        (prev) => ({
          ...prev,
          roadmap: prev.roadmap.map((r) => (r.id === id ? { ...r, ...input } : r))
        }),
        (next) => db.persistRoadmap(next)
      );
    },
    [runMutation]
  );

  const deleteRoadmapItem = useCallback(
    (id: string) => {
      runMutation(
        (prev) => ({ ...prev, roadmap: prev.roadmap.filter((r) => r.id !== id) }),
        (next) => db.deleteRoadmapItem(next, id)
      );
    },
    [runMutation]
  );

  const moveRoadmapItem = useCallback(
    (id: string, dir: -1 | 1) => {
      runMutation(
        (prev) => {
          const item = prev.roadmap.find((r) => r.id === id);
          if (!item) return prev;
          const moved = moveInList(
            prev.roadmap.filter((r) => r.org === item.org),
            id,
            dir
          );
          const byId = new Map(moved.map((r) => [r.id, r]));
          return { ...prev, roadmap: prev.roadmap.map((r) => byId.get(r.id) ?? r) };
        },
        (next) => db.persistRoadmap(next)
      );
    },
    [runMutation]
  );

  return {
    data,
    status,
    toggleRoutineTask,
    addRoutineTask,
    updateRoutineTask,
    deleteRoutineTask,
    moveRoutineTask,
    resetRoutine,
    toggleQcItem,
    resetQcChecklist,
    addProject,
    deleteProject,
    cycleRoadmapItem,
    addRoadmapItem,
    updateRoadmapItem,
    deleteRoadmapItem,
    moveRoadmapItem
  };
}
