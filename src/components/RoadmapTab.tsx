import type { RoadmapItem, RoadmapOrg, RoadmapStatus } from '../types';

interface RoadmapTabProps {
  roadmap: RoadmapItem[];
  onCycle: (id: string) => void;
}

const statusColor: Record<RoadmapStatus, string> = {
  Done: 'bg-m1-emerald/20 text-m1-emerald border-m1-emerald/40',
  'In Progress': 'bg-m1-gold/20 text-m1-gold border-m1-gold/40',
  Pending: 'bg-m1-bg text-gray-400 border-m1-border'
};

const orgMeta: Record<
  RoadmapOrg,
  { name: string; subtitle: string; badge: string; mark: string; tone: string; accentBorder: string }
> = {
  '7H': {
    name: '7H Music Group',
    subtitle: 'Label Operations & Master Catalog',
    badge: 'LABEL',
    mark: '7H',
    tone: 'bg-m1-gold/20 text-m1-gold',
    accentBorder: 'hover:border-m1-gold/40'
  },
  EST: {
    name: 'East Sound Technologies',
    subtitle: 'Audio Software & VST R&D',
    badge: 'AUDIO TECH',
    mark: 'EST',
    tone: 'bg-m1-cyan/20 text-m1-cyan',
    accentBorder: 'hover:border-m1-cyan/40'
  }
};

function RoadmapCard({ item, onCycle }: { item: RoadmapItem; onCycle: (id: string) => void }) {
  return (
    <div
      onClick={() => onCycle(item.id)}
      title="Click to cycle status: Pending → In Progress → Done"
      className="p-3 bg-m1-bg border border-m1-border rounded-lg space-y-2 cursor-pointer hover:border-gray-500 transition"
    >
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-bold text-white text-sm">{item.title}</h4>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${statusColor[item.status]} font-bold whitespace-nowrap`}>
          {item.status}
        </span>
      </div>
      <p className="text-xs text-gray-400">{item.description}</p>
    </div>
  );
}

export default function RoadmapTab({ roadmap, onCycle }: RoadmapTabProps) {
  const columns: Array<{ org: RoadmapOrg; items: RoadmapItem[] }> = [
    { org: '7H', items: roadmap.filter((r) => r.org === '7H') },
    { org: 'EST', items: roadmap.filter((r) => r.org === 'EST') }
  ];

  return (
    <section className="space-y-6">
      <div className="bg-gradient-to-r from-m1-emerald/15 via-m1-card to-m1-card border border-m1-emerald/40 rounded-2xl p-6">
        <div className="inline-flex items-center space-x-2 bg-m1-emerald/20 text-m1-emerald border border-m1-emerald/40 text-xs px-3 py-1 rounded-full font-mono mb-3 font-bold">
          <i className="fa-solid fa-microchip"></i>
          <span>STRATEGIC ECOSYSTEM EXPANSION</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white">7H Music Group &amp; East Sound Technologies</h2>
        <p className="text-sm text-gray-400 mt-1">
          Scale your commercial record label infrastructure while developing custom VST audio software in Reaper.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {columns.map(({ org, items }) => {
          const meta = orgMeta[org];
          return (
            <div key={org} className={`bg-m1-card border border-m1-border rounded-xl p-5 space-y-4 ${meta.accentBorder} transition`}>
              <div className="flex items-center justify-between pb-3 border-b border-m1-border">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-lg ${meta.tone} flex items-center justify-center font-mono font-extrabold`}>
                    {meta.mark}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{meta.name}</h3>
                    <p className="text-xs text-gray-400">{meta.subtitle}</p>
                  </div>
                </div>
                <span className={`text-xs ${meta.tone} px-2 py-1 rounded font-mono font-bold`}>{meta.badge}</span>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <RoadmapCard key={item.id} item={item} onCycle={onCycle} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
