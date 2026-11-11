import { useEffect, useState } from 'react';
import type { RoutineTask, RoutineTaskInput } from '../types';
import ModalShell, { modalInputClass } from './ModalShell';

interface RoutineTaskModalProps {
  open: boolean;
  initial: RoutineTask | null;
  onClose: () => void;
  onSave: (input: RoutineTaskInput) => void;
}

const emptyForm: RoutineTaskInput = {
  title: '',
  duration: '15 MINS',
  tool: '',
  description: ''
};

const baseDurations = ['5 MINS', '10 MINS', '15 MINS', '20 MINS', '30 MINS'];

export default function RoutineTaskModal({ open, initial, onClose, onSave }: RoutineTaskModalProps) {
  const [form, setForm] = useState<RoutineTaskInput>(emptyForm);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              title: initial.title,
              duration: initial.duration,
              tool: initial.tool,
              description: initial.description
            }
          : emptyForm
      );
    }
  }, [open, initial]);

  const durations =
    form.duration && !baseDurations.includes(form.duration)
      ? [form.duration, ...baseDurations]
      : baseDurations;

  return (
    <ModalShell
      open={open}
      title={initial ? 'EDIT PRACTICE DRILL' : 'ADD PRACTICE DRILL'}
      icon="fa-solid fa-bolt-lightning"
      accent="text-m1-gold"
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            title: form.title.trim(),
            duration: form.duration,
            tool: form.tool.trim(),
            description: form.description.trim()
          });
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-xs text-gray-400 font-mono uppercase mb-1">Drill Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Stereo Image Ear Training"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={modalInputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 font-mono uppercase mb-1">Time Block</label>
            <select
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className={modalInputClass}
            >
              {durations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 font-mono uppercase mb-1">Tool / Station</label>
            <input
              type="text"
              required
              placeholder="e.g. Logic Pro / Reaper"
              value={form.tool}
              onChange={(e) => setForm({ ...form, tool: e.target.value })}
              className={modalInputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 font-mono uppercase mb-1">Drill Brief</label>
          <textarea
            required
            rows={3}
            placeholder="Describe the exercise and its success criteria…"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={`${modalInputClass} resize-none`}
          />
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
            className="px-5 py-2 bg-m1-gold hover:bg-yellow-400 text-black text-xs font-bold font-mono rounded-xl shadow-lg glow-gold"
          >
            {initial ? 'SAVE DRILL' : 'ADD DRILL'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
