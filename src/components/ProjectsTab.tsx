import { useState } from 'react';
import type { Project } from '../types';
import type { NewProjectInput } from '../lib/useHub';
import NewProjectModal from './NewProjectModal';

interface ProjectsTabProps {
  projects: Project[];
  onAdd: (input: NewProjectInput) => void;
  onDelete: (id: string) => void;
}

export default function ProjectsTab({ projects, onAdd, onDelete }: ProjectsTabProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const mixCount = projects.filter((p) => p.type.includes('Mixing')).length;
  const masterCount = projects.filter((p) => p.type.includes('Mastering')).length;
  const sdCount = projects.filter((p) => p.type.includes('Sound Design')).length;

  const stats: Array<{ label: string; count: number; icon: string; tone: string; chip: string }> = [
    {
      label: 'Logic Pro Mixing',
      count: mixCount,
      icon: 'fa-solid fa-sliders',
      tone: 'text-m1-gold',
      chip: 'bg-m1-gold/10 text-m1-gold'
    },
    {
      label: 'Logic Pro Mastering',
      count: masterCount,
      icon: 'fa-solid fa-wave-square',
      tone: 'text-m1-purple',
      chip: 'bg-m1-purple/10 text-m1-purple'
    },
    {
      label: 'Reaper Sound Design',
      count: sdCount,
      icon: 'fa-solid fa-wand-magic-sparkles',
      tone: 'text-m1-cyan',
      chip: 'bg-m1-cyan/10 text-m1-cyan'
    }
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Studio Session Pipeline</h2>
          <p className="text-sm text-gray-400">
            Track active Logic Pro mixing/mastering sessions and Reaper sound design assets.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-m1-purple hover:bg-purple-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all glow-purple"
        >
          <i className="fa-solid fa-plus"></i>
          <span>New Studio Session</span>
        </button>
      </div>

      {/* Session Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-m1-card border border-m1-border p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400 uppercase">{stat.label}</span>
              <div className={`text-2xl font-bold ${stat.tone} mt-1`}>{stat.count}</div>
            </div>
            <div className={`w-10 h-10 rounded-lg ${stat.chip} flex items-center justify-center text-lg`}>
              <i className={stat.icon}></i>
            </div>
          </div>
        ))}
      </div>

      {/* Active Project List Table */}
      <div className="bg-m1-card border border-m1-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-m1-border flex items-center justify-between font-mono">
          <h3 className="font-bold text-white text-sm">ACTIVE CATALOG &amp; CLIENT DELIVERABLES</h3>
          <span className="text-xs text-m1-cyan">{projects.length} Active</span>
        </div>
        <div className="divide-y divide-m1-border custom-scrollbar overflow-x-auto">
          {projects.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm font-mono">
              No active studio sessions found. Click &quot;New Studio Session&quot; to initiate.
            </div>
          ) : (
            projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 hover:bg-m1-hover/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <h4 className="font-bold text-white text-base">{proj.title}</h4>
                    <span className="text-xs px-2 py-0.5 rounded bg-m1-purple/20 text-m1-purple font-mono border border-m1-purple/30 font-semibold">
                      {proj.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-400 font-mono flex-wrap">
                    <span>
                      <i className="fa-solid fa-user text-gray-500 mr-1"></i>
                      {proj.client}
                    </span>
                    <span>
                      <i className="fa-solid fa-file-contract text-m1-gold mr-1"></i>
                      {proj.revisions}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 justify-between md:justify-end">
                  <span className="text-xs px-3 py-1 rounded bg-m1-bg border border-m1-border text-m1-cyan font-mono font-bold">
                    {proj.status}
                  </span>
                  <button
                    onClick={() => onDelete(proj.id)}
                    className="text-gray-500 hover:text-m1-rose p-2 transition"
                    title="Delete session"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <NewProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(input) => {
          onAdd(input);
          setModalOpen(false);
        }}
      />
    </section>
  );
}
