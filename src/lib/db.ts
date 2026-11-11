import { supabase, isCloudSyncConfigured } from './supabase';
import type { HubData } from '../types';
import { seedData } from './seed';

const LOCAL_KEY = 'm1hub_v1';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function loadLocal(): HubData {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<HubData>;
      return {
        routine: parsed.routine ?? clone(seedData.routine),
        qc: parsed.qc ?? clone(seedData.qc),
        projects: parsed.projects ?? clone(seedData.projects),
        roadmap: parsed.roadmap ?? clone(seedData.roadmap)
      };
    }
  } catch {
    /* corrupted local state — fall through to seed */
  }
  return clone(seedData);
}

function saveLocal(data: HubData): void {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable — keep running in memory */
  }
}

/** Load the full hub state from Supabase when configured, otherwise localStorage. */
export async function loadAll(): Promise<{ data: HubData; cloud: boolean }> {
  if (!isCloudSyncConfigured || !supabase) {
    return { data: loadLocal(), cloud: false };
  }
  const [routine, qc, projects, roadmap] = await Promise.all([
    supabase.from('m1_routine_tasks').select('*').order('position'),
    supabase.from('m1_qc_items').select('*').order('position'),
    supabase.from('m1_projects').select('*').order('created_at', { ascending: false }),
    supabase.from('m1_roadmap_items').select('*').order('position')
  ]);
  const failed = [routine, qc, projects, roadmap].find((r) => r.error);
  if (failed?.error) throw failed.error;
  return {
    data: {
      routine: routine.data ?? [],
      qc: qc.data ?? [],
      projects: projects.data ?? [],
      roadmap: roadmap.data ?? []
    },
    cloud: true
  };
}

export function loadLocalData(): HubData {
  return loadLocal();
}

export async function persistRoutineTask(next: HubData, id: string): Promise<void> {
  if (!supabase) return saveLocal(next);
  const task = next.routine.find((t) => t.id === id);
  if (!task) return;
  const { error } = await supabase.from('m1_routine_tasks').upsert(task);
  if (error) throw error;
}

export async function persistQcItems(next: HubData): Promise<void> {
  if (!supabase) return saveLocal(next);
  const { error } = await supabase.from('m1_qc_items').upsert(next.qc);
  if (error) throw error;
}

export async function persistRoadmapItem(next: HubData, id: string): Promise<void> {
  if (!supabase) return saveLocal(next);
  const item = next.roadmap.find((r) => r.id === id);
  if (!item) return;
  const { error } = await supabase.from('m1_roadmap_items').upsert(item);
  if (error) throw error;
}

export async function persistNewProject(next: HubData, id: string): Promise<void> {
  if (!supabase) return saveLocal(next);
  const project = next.projects.find((p) => p.id === id);
  if (!project) return;
  const { error } = await supabase.from('m1_projects').insert(project);
  if (error) throw error;
}

export async function persistProjectDeletion(next: HubData, id: string): Promise<void> {
  if (!supabase) return saveLocal(next);
  const { error } = await supabase.from('m1_projects').delete().eq('id', id);
  if (error) throw error;
}

/** Live sync: refetch whenever any M1-COMMAND table changes (any client). */
export function subscribeToChanges(onChange: () => void): () => void {
  const client = supabase;
  if (!client) return () => undefined;
  const handler = () => onChange();
  const channel = client
    .channel('m1-hub-sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'm1_routine_tasks' }, handler)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'm1_qc_items' }, handler)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'm1_projects' }, handler)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'm1_roadmap_items' }, handler)
    .subscribe();
  return () => {
    void client.removeChannel(channel);
  };
}
