import { useEffect, useState } from 'react';
import type { RoadmapItem, RoadmapItemInput, RoadmapOrg, RoadmapStatus } from '../types';
import ModalShell, { modalInputClass } from './ModalShell';

interface RoadmapItemModalProps {
  open: boolean;
  org: RoadmapOrg;
  initial: RoadmapItem | null;
  onClose: () => void;
  onSave: (input: RoadmapItemInput) => void;
}

const orgLabel: Record<RoadmapOrg, string> = {
  '7H': '7H MUSIC GROUP',
  EST: 'EAST SOUND TECHNOLOGIES'
};

const statuses: RoadmapStatus[] = ['Pending', 'In Progress', 'Done'];

const emptyForm: RoadmapItemInput = {
  title: '',
  description: '',
  status: 'Pending',
  due_date: null
};

export default function RoadmapItemModal({ open, org, initial, onClose, onSave }: RoadmapItemModalProps) {
  const [form, setForm] = useState<RoadmapItemInput>(emptyForm);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              title: initial.title,
              description: initial.description,
              status: initial.status,
              due_date: initial.due_date
            }
          : emptyForm
      );
    }
  }, [open, initial]);

  return (
    <ModalShell
      open={open}
      title={initial ? 'EDIT ROADMAP ITEM' : 'ADD ROADMAP ITEM'}
      icon="fa-solid fa-microchip"
      accent="text-m1-emerald"
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            title: form.title.trim(),
            description: form.description.trim(),
            status: form.status,
            due_date: form.due_date || null
          });
        }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2 text-[10px] font-mono">
          <span className="text-gray-400 uppercase">Column:</span>
          <span className="bg-m1-bg border border-m1-border px-2 py-0.5 rounded text-m1-emerald font-bold">
            {orgLabel[org]}
          </span>
        </div>

        <div>
          <label className="block text-xs text-gray-400 font-mono uppercase mb-1">Item Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Master Template Suite v2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={modalInputClass}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 font-mono uppercase mb-1">Description</label>
          <textarea
            required
            rows={3}
            placeholder="What does done look like?"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={`${modalInputClass} resize-none`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 font-mono uppercase mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as RoadmapStatus })}
              className={modalInputClass}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 font-mono uppercase mb-1">Target Date</label>
            <input
              type="date"
              value={form.due_date ?? ''}
              onChange={(e) => setForm({ ...form, due_date: e.target.value || null })}
              className={`${modalInputClass} [color-scheme:dark]`}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-m1-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-m1-bg border border-m1-border hover:bg-m1-hover text-gray-300 text-xs font-mono rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-m1-emerald hover:bg-emerald-400 text-black text-xs font-bold font-mono rounded-xl shadow-lg"
          >
            {initial ? 'SAVE ITEM' : 'ADD ITEM'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
