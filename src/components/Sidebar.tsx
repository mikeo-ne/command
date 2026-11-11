import type { TabName } from '../types';

interface SidebarProps {
  active: TabName;
  onTab: (tab: TabName) => void;
  badges: Record<TabName, string>;
}

const tabs: Array<{ id: TabName; label: string; icon: string; accent: string }> = [
  { id: 'routine', label: 'Daily Practice', icon: 'fa-solid fa-bolt-lightning', accent: 'text-m1-gold' },
  { id: 'projects', label: 'Studio Pipeline', icon: 'fa-solid fa-sliders', accent: 'text-m1-purple' },
  { id: 'qc', label: 'Pre-Flight QC Audit', icon: 'fa-solid fa-shield-halved', accent: 'text-m1-cyan' },
  { id: 'roadmap', label: 'Label & Tech R&D', icon: 'fa-solid fa-microchip', accent: 'text-m1-emerald' }
];

const badgeStyle: Record<TabName, string> = {
  routine: 'bg-m1-gold/20 text-m1-gold',
  projects: 'bg-m1-purple/20 text-m1-purple',
  qc: 'bg-m1-cyan/20 text-m1-cyan',
  roadmap: 'bg-m1-emerald/20 text-m1-emerald'
};

const activeBorder: Record<TabName, string> = {
  routine: 'border-m1-gold',
  projects: 'border-m1-purple',
  qc: 'border-m1-cyan',
  roadmap: 'border-m1-emerald'
};

export default function Sidebar({ active, onTab, badges }: SidebarProps) {
  return (
    <aside className="w-full md:w-64 flex-shrink-0 space-y-4">
      <div className="bg-m1-card border border-m1-border rounded-xl p-2 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTab(tab.id)}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-l-4 ${
              active === tab.id
                ? `bg-m1-hover text-white ${activeBorder[tab.id]}`
                : 'text-gray-400 hover:text-white hover:bg-m1-hover border-transparent'
            }`}
          >
            <div className="flex items-center space-x-3">
              <i className={`${tab.icon} ${tab.accent} w-5`}></i>
              <span>{tab.label}</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${badgeStyle[tab.id]}`}>
              {badges[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Ecosystem Operations Summary Card */}
      <div className="bg-m1-card border border-m1-border rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-gray-400 border-b border-m1-border pb-2">
          <span className="text-m1-cyan font-bold">
            <i className="fa-solid fa-network-wired mr-1"></i> ECOSYSTEM DEPLOYMENT
          </span>
        </div>
        <div className="space-y-2 text-xs">
          <div className="p-3 bg-m1-bg rounded-lg border border-m1-border hover:border-m1-gold/50 transition">
            <div className="font-bold text-m1-gold flex items-center justify-between font-mono">
              <span>7H MUSIC GROUP</span>
              <span className="text-[9px] bg-m1-gold/20 text-m1-gold px-1.5 py-0.5 rounded">LABEL</span>
            </div>
            <p className="text-gray-400 text-[11px] mt-1">
              Master catalog, artist engineering &amp; commercial release pipeline.
            </p>
          </div>

          <div className="p-3 bg-m1-bg rounded-lg border border-m1-border hover:border-m1-cyan/50 transition">
            <div className="font-bold text-m1-cyan flex items-center justify-between font-mono">
              <span>EAST SOUND TECH</span>
              <span className="text-[9px] bg-m1-cyan/20 text-m1-cyan px-1.5 py-0.5 rounded">AUDIO R&amp;D</span>
            </div>
            <p className="text-gray-400 text-[11px] mt-1">
              VST plugin development, Reaper scripting &amp; custom DSP toolchains.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
