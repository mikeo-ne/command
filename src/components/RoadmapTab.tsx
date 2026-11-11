import { useState } from 'react';
import type { RoadmapItem, RoadmapItemInput, RoadmapOrg, RoadmapStatus } from '../types';
import RoadmapItemModal from './RoadmapItemModal';

interface RoadmapTabProps {
  roadmap: RoadmapItem[];
  onCycle: (id: string) => void;
  onAdd: (org: RoadmapOrg, input: RoadmapItemInput) => void;
  onUpdate: (id: string, input: RoadmapItemInput) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
}

const statusColor: Record<RoadmapStatus, string> = {
  Done: 'bg-m1-emerald/20 text-m1-emerald border-m1-emerald/40',
  'In Progress': 'bg-m1-gold/20 text-m1-gold border-m1-gold/40',
  Pending: 'bg-m1-bg text-gray-400 border-m1-border'
};

const orgMeta: Record<
  RoadmapOrg,
  {
    name: string;
    subtitle: string;
    badge: string;
    mark: string;
    tone: string;
    accentBorder: string;
    bar: string;
  }
> = {
  '7H': {
    name: '7H Music Group',
    subtitle: 'Label Operations & Master Catalog',
    badge: 'LABEL',
    mark: '7H',
    tone: 'bg-m1-gold/20 text-m1-gold',
    accentBorder: 'hover:border-m1-gold/40',
    bar: 'bg-m1-gold'
  },
  EST: {
    name: 'East Sound Technologies',
    subtitle: 'Audio Software & VST R&D',
    badge: 'AUDIO TECH',
    mark: 'EST',
    tone: 'bg-m1-cyan/20 text-m1-cyan',
    accentBorder: 'hover:border-m1-cyan/40',
    bar: 'bg-m1-cyan'
  }
};

const actionBtn =
  'text-gray-500 hover:text-white p-1.5 transition text-xs disabled:opacity-30 disabled:cursor-not-allowed';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

interface RoadmapCardProps {
  item: RoadmapItem;
  index: number;
  count: number;
  onCycle: (id: string) => void;
  onEdit: (item: RoadmapItem) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
}

function RoadmapCard({ item, index, count, onCycle, onEdit, onDelete, onMove }: RoadmapCardProps) {
  const overdue = Boolean(item.due_date) && item.status !== 'Done' && (item.due_date as string) < todayISO();

  return (
    <div
      onClick={() => onCycle(item.id)}
      title="Click to cycle status: Pending → In Progress → Done"
      className="p-3 bg-m1-bg border border-m1-border rounded-lg space-y-2 cursor-pointer hover:border-gray-500 transition"
    >
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-bold text-white text-sm">{item.title}</h4>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${statusColor[item.status]} font-bold whitespace-nowrap`}
        >
          {item.status}
        </span>
      </div>
      <p className="text-xs text-gray-400">{item.description}</p>
      <div className="flex items-center justify-between pt-1">
        {item.due_date ? (
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              overdue
                ? 'border-m1-rose/40 text-m1-rose bg-m1-rose/10 font-bold'
                : 'border-m1-border text-gray-400 bg-m1-card'
            }`}
          >
            <i className="fa-regular fa-calendar mr-1"></i>DUE {item.due_date}
            {overdue ? ' · OVERDUE' : ''}
          </span>
        ) : (
          <span className="text-[10px] font-mono text-gray-600">NO TARGET DATE</span>
        )}
        <div className="flex items-center space-x-0.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onMove(item.id, -1)}
            disabled={index === 0}
            className={actionBtn}
            title="Move up"
          >
            <i className="fa-solid fa-arrow-up"></i>
          </button>
          <button
            onClick={() => onMove(item.id, 1)}
            disabled={index === count - 1}
            className={actionBtn}
            title="Move down"
          >
            <i className="fa-solid fa-arrow-down"></i>
          </button>
          <button onClick={() => onEdit(item)} className={actionBtn} title="Edit item">
            <i className="fa-solid fa-pen"></i>
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="text-gray-500 hover:text-m1-rose p-1.5 transition text-xs"
            title="Delete item"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RoadmapTab({ roadmap, onCycle, onAdd, onUpdate, onDelete, onMove }: RoadmapTabProps) {
  const [modal, setModal] = useState<{ open: boolean; org: RoadmapOrg; item: RoadmapItem | null }>({
    open: false,
    org: '7H',
    item: null
  });

  const columns: Array<{ org: RoadmapOrg; items: RoadmapItem[] }> = (
    ['7H', 'EST'] as RoadmapOrg[]
  ).map((org) => ({
    org,
    items: roadmap
      .filter((r) => r.org === org)
      .sort((a, b) => a.position - b.position)
  }));

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
          const done = items.filter((i) => i.status === 'Done').length;
          const pct = items.length > 0 ? Math.round((done / items.length) * 100) : 0;

          return (
            <div
              key={org}
              className={`bg-m1-card border border-m1-border rounded-xl p-5 space-y-4 ${meta.accentBorder} transition flex flex-col`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-m1-border">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-9 h-9 rounded-lg ${meta.tone} flex items-center justify-center font-mono font-extrabold`}
                  >
                    {meta.mark}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{meta.name}</h3>
                    <p className="text-xs text-gray-400">{meta.subtitle}</p>
                  </div>
                </div>
                <span className={`text-xs ${meta.tone} px-2 py-1 rounded font-mono font-bold`}>{meta.badge}</span>
              </div>

              {/* Column progress */}
              <div>
                <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1.5">
                  <span>
                    {done}/{items.length} DONE
                  </span>
                  <span>{pct}%</span>
                </div>
                <div className="h-1.5 bg-m1-bg rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${meta.bar}`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                {items.length === 0 && (
                  <p className="text-xs text-gray-500 font-mono text-center py-4">
                    No roadmap items yet.
                  </p>
                )}
                {items.map((item, idx) => (
                  <RoadmapCard
                    key={item.id}
                    item={item}
                    index={idx}
                    count={items.length}
                    onCycle={onCycle}
                    onEdit={(editing) => setModal({ open: true, org, item: editing })}
                    onDelete={onDelete}
                    onMove={onMove}
                  />
                ))}
              </div>

              <button
                onClick={() => setModal({ open: true, org, item: null })}
                className="w-full inline-flex items-center justify-center space-x-2 bg-m1-bg border border-dashed border-m1-border hover:border-m1-emerald/60 hover:text-m1-emerald text-gray-400 text-xs px-4 py-2.5 rounded-xl transition font-mono"
              >
                <i className="fa-solid fa-plus"></i>
                <span>ADD ITEM</span>
              </button>
            </div>
          );
        })}
      </div>

      <RoadmapItemModal
        open={modal.open}
        org={modal.org}
        initial={modal.item}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        onSave={(input) => {
          if (modal.item) onUpdate(modal.item.id, input);
          else onAdd(modal.org, input);
          setModal((m) => ({ ...m, open: false }));
        }}
      />
    </section>
  );
}
