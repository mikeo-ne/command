import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RoutineTab from './components/RoutineTab';
import ProjectsTab from './components/ProjectsTab';
import QcTab from './components/QcTab';
import RoadmapTab from './components/RoadmapTab';
import { useHub } from './lib/useHub';
import type { TabName } from './types';

const VALID_TABS: TabName[] = ['routine', 'projects', 'qc', 'roadmap'];

function tabFromHash(): TabName {
  const hash = window.location.hash.replace('#', '') as TabName;
  return VALID_TABS.includes(hash) ? hash : 'routine';
}

export default function App() {
  const hub = useHub();
  const [tab, setTab] = useState<TabName>(tabFromHash);

  const selectTab = useCallback((t: TabName) => {
    setTab(t);
    window.location.hash = t;
  }, []);

  useEffect(() => {
    const onHashChange = () => setTab(tabFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const badges = useMemo(() => {
    const doneRoutine = hub.data.routine.filter((t) => t.completed).length;
    const doneQc = hub.data.qc.filter((i) => i.done).length;
    const doneRoadmap = hub.data.roadmap.filter((r) => r.status === 'Done').length;
    return {
      routine: `${doneRoutine}/${hub.data.routine.length}`,
      projects: String(hub.data.projects.length),
      qc: `${doneQc}/${hub.data.qc.length}`,
      roadmap: `${doneRoadmap}/${hub.data.roadmap.length}`
    };
  }, [hub.data]);

  return (
    <div className="min-h-screen flex flex-col bg-m1-bg text-gray-200 antialiased selection:bg-m1-cyan selection:text-black bg-grid">
      <Header status={hub.status} />

      <div className="flex-1 flex flex-col md:flex-row max-w-[1700px] w-full mx-auto p-4 lg:p-6 gap-6">
        <Sidebar active={tab} onTab={selectTab} badges={badges} />

        <main className="flex-1 min-w-0">
          {tab === 'routine' && <RoutineTab tasks={hub.data.routine} onToggle={hub.toggleRoutineTask} />}
          {tab === 'projects' && (
            <ProjectsTab projects={hub.data.projects} onAdd={hub.addProject} onDelete={hub.deleteProject} />
          )}
          {tab === 'qc' && <QcTab items={hub.data.qc} onToggle={hub.toggleQcItem} onReset={hub.resetQcChecklist} />}
          {tab === 'roadmap' && <RoadmapTab roadmap={hub.data.roadmap} onCycle={hub.cycleRoadmapItem} />}
        </main>
      </div>
    </div>
  );
}
