export type SyncStatus = 'loading' | 'live' | 'local';

export interface RoutineTask {
  id: string;
  title: string;
  duration: string;
  tool: string;
  description: string;
  completed: boolean;
  position: number;
}

export interface RoutineTaskInput {
  title: string;
  duration: string;
  tool: string;
  description: string;
}

export interface QcItem {
  id: string;
  title: string;
  detail: string;
  category: string;
  done: boolean;
  position: number;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  type: string;
  revisions: string;
  status: string;
  created_at?: string;
}

export type RoadmapStatus = 'Pending' | 'In Progress' | 'Done';
export type RoadmapOrg = '7H' | 'EST';

export interface RoadmapItem {
  id: string;
  org: RoadmapOrg;
  title: string;
  description: string;
  status: RoadmapStatus;
  position: number;
  due_date: string | null;
}

export interface RoadmapItemInput {
  title: string;
  description: string;
  status: RoadmapStatus;
  due_date: string | null;
}

export interface HubData {
  routine: RoutineTask[];
  qc: QcItem[];
  projects: Project[];
  roadmap: RoadmapItem[];
}

export type TabName = 'routine' | 'projects' | 'qc' | 'roadmap';
