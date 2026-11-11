import { useCallback, useEffect, useRef, useState } from 'react';
import type { HubData, RoadmapItem, RoadmapStatus, SyncStatus } from '../types';
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
    const unsub = db.subscribeToChanges(() => {
      void refresh();
    });
    return unsub;
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

  const toggleRoutineTask = useCallback(
    (id: string) => {
      runMutation(
        (prev) => ({
          ...prev,
          routine: prev.routine.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        }),
        (next) => db.persistRoutineTask(next, id)
      );
    },
    [runMutation]
  );

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

  const cycleRoadmapItem = useCallback(
    (id: string) => {
      runMutation(
        (prev) => ({
          ...prev,
          roadmap: prev.roadmap.map((r) =>
            r.id === id ? { ...r, status: nextRoadmapStatus(r.status) } : r
          )
        }),
        (next) => db.persistRoadmapItem(next, id)
      );
    },
    [runMutation]
  );

  return {
    data,
    status,
    toggleRoutineTask,
    toggleQcItem,
    resetQcChecklist,
    addProject,
    deleteProject,
    cycleRoadmapItem
  };
}

export function roadmapByOrg(roadmap: RoadmapItem[], org: RoadmapItem['org']): RoadmapItem[] {
  return roadmap.filter((r) => r.org === org);
}
