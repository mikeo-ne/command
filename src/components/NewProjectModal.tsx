import { useState } from 'react';
import type { NewProjectInput } from '../lib/useHub';

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (input: NewProjectInput) => void;
}

const emptyForm: NewProjectInput = {
  title: '',
  client: '',
  type: 'Mixing (Logic Pro)',
  revisions: '2 Rounds Included',
  status: 'Gain Staging & Prep'
};

const inputClass =
  'w-full bg-m1-bg border border-m1-border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-m1-cyan font-sans';

export default function NewProjectModal({ open, onClose, onSave }: NewProjectModalProps) {
  const [form, setForm] = useState<NewProjectInput>(emptyForm);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, title: form.title.trim(), client: form.client.trim() });
    setForm(emptyForm);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-m1-card border border-m1-border rounded-2xl w-full max-w-lg p-6 space-y-5 glow-cyan max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between border-b border-m1-border pb-3">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2 font-mono">
            <i className="fa-solid fa-compact-disc text-m1-cyan"></i>
            <span>ADD STUDIO SESSION</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 font-mono uppercase mb-1">Track / Asset Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Sub-Zero Bassline"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 font-mono uppercase mb-1">Artist / Entity</label>
            <input
              type="text"
              required
              placeholder="e.g. 7H Music Group / External Artist"
              value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 font-mono uppercase mb-1">Engineering Discipline</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={inputClass}
              >
                <option value="Mixing (Logic Pro)">Mixing (Logic Pro)</option>
                <option value="Mastering (Logic Pro)">Mastering (Logic Pro)</option>
                <option value="Sound Design (Reaper)">Sound Design (Reaper)</option>
                <option value="Full Package (Mix/Master/SD)">Full Package</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 font-mono uppercase mb-1">Revision Terms</label>
              <select
                value={form.revisions}
                onChange={(e) => setForm({ ...form, revisions: e.target.value })}
                className={inputClass}
              >
                <option value="2 Rounds Included">2 Rounds (Standard)</option>
                <option value="3 Rounds Included">3 Rounds (Extended)</option>
                <option value="Strict 1 Revision">1 Revision Only</option>
                <option value="Internal R&D Asset">Internal R&amp;D Asset</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 font-mono uppercase mb-1">Session Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className={inputClass}
            >
              <option value="Gain Staging & Prep">Gain Staging &amp; Prep</option>
              <option value="In Mix (Logic Pro)">In Mix (Logic Pro)</option>
              <option value="Mastering Pass (Logic Pro)">Mastering Pass (Logic Pro)</option>
              <option value="Reaper SD Processing">Reaper SD Processing</option>
              <option value="Client Review">Client Review</option>
              <option value="Approved & Delivered">Approved &amp; Delivered</option>
            </select>
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
              className="px-5 py-2 bg-m1-cyan hover:bg-cyan-400 text-black text-xs font-bold font-mono rounded-xl shadow-lg glow-cyan"
            >
              SAVE SESSION
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
