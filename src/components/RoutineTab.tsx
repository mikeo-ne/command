import { useState } from 'react';
import type { RoutineTask, RoutineTaskInput } from '../types';
import RoutineTaskModal from './RoutineTaskModal';

interface RoutineTabProps {
  tasks: RoutineTask[];
  onToggle: (id: string) => void;
  onAdd: (input: RoutineTaskInput) => void;
  onUpdate: (id: string, input: RoutineTaskInput) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onReset: () => void;
}

const actionBtn =
  'text-gray-500 hover:text-white p-1.5 transition text-xs disabled:opacity-30 disabled:cursor-not-allowed';

export default function RoutineTab({ tasks, onToggle, onAdd, onUpdate, onDelete, onMove, onReset }: RoutineTabProps) {
  const [modal, setModal] = useState<{ open: boolean; item: RoutineTask | null }>({ open: false, item: null });

  const sorted = [...tasks].sort((a, b) => a.position - b.position);
  const completedCount = tasks.filter((t) => t.completed).length;
  const percent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-m1-gold/15 via-m1-card to-m1-card border border-m1-gold/40 rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-m1-gold/20 text-m1-gold border border-m1-gold/40 text-xs px-3 py-1 rounded-full font-mono mb-3 font-bold">
              <i className="fa-solid fa-stopwatch"></i>
              <span>DAILY CRITICAL DISCIPLINE</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">Daily Audio Practice Routine</h2>
            <p className="text-sm text-gray-400 mt-1 max-w-xl">
              Execute these four 15-minute drills to tune your analytical ear, master Logic Pro static mixes, and
              expand Reaper sound design speed.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="bg-m1-bg border border-m1-border rounded-xl p-4 flex items-center space-x-5 min-w-[200px] justify-between">
              <div>
                <div className="text-xs text-gray-400 font-mono uppercase">Completion</div>
                <div className="text-3xl font-extrabold text-m1-gold font-mono mt-0.5">{percent}%</div>
              </div>
              <div className="w-14 h-14 rounded-full border-4 border-m1-gold/30 bg-m1-gold/10 flex items-center justify-center text-m1-gold font-bold font-mono text-base">
                {completedCount}/{tasks.length}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setModal({ open: true, item: null })}
                className="flex-1 inline-flex items-center justify-center space-x-2 bg-m1-gold hover:bg-yellow-400 text-black font-semibold text-xs px-4 py-2.5 rounded-xl transition-all glow-gold font-mono"
              >
                <i className="fa-solid fa-plus"></i>
                <span>ADD DRILL</span>
              </button>
              <button
                onClick={onReset}
                title="Uncheck all drills for a fresh day"
                className="inline-flex items-center justify-center space-x-2 bg-m1-bg border border-m1-border hover:bg-m1-hover text-gray-300 text-xs px-4 py-2.5 rounded-xl transition font-mono"
              >
                <i className="fa-solid fa-rotate-left"></i>
                <span>RESET ALL</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Tasks Grid */}
      {sorted.length === 0 ? (
        <div className="bg-m1-card border border-m1-border rounded-xl p-10 text-center space-y-3">
          <i className="fa-solid fa-bolt-lightning text-m1-gold text-2xl"></i>
          <p className="text-gray-400 text-sm font-mono">No drills on the schedule. Build your practice routine.</p>
          <button
            onClick={() => setModal({ open: true, item: null })}
            className="inline-flex items-center space-x-2 bg-m1-gold hover:bg-yellow-400 text-black font-semibold text-xs px-4 py-2.5 rounded-xl transition-all glow-gold font-mono"
          >
            <i className="fa-solid fa-plus"></i>
            <span>ADD FIRST DRILL</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map((task, idx) => (
            <div
              key={task.id}
              className={`bg-m1-card border ${
                task.completed ? 'border-m1-gold/60 bg-m1-gold/5' : 'border-m1-border'
              } rounded-xl p-4 transition-all duration-200 flex flex-col justify-between space-y-3`}
            >
              <div className="flex items-start justify-between space-x-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-m1-bg border border-m1-border text-m1-gold font-bold">
                      {task.duration}
                    </span>
                    <span className="text-xs font-mono text-gray-400">{task.tool}</span>
                  </div>
                  <h3 className="font-bold text-white text-base mt-1">{task.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{task.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggle(task.id)}
                  className="w-5 h-5 accent-m1-gold rounded cursor-pointer mt-1"
                />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-m1-border/50 text-[11px] font-mono">
                <span className={task.completed ? 'text-m1-gold font-bold' : 'text-gray-500'}>
                  {task.completed ? (
                    <>
                      <i className="fa-solid fa-check mr-1"></i> DRILL COMPLETED
                    </>
                  ) : (
                    'PENDING DRILL'
                  )}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-500 mr-1.5">
                    Task {idx + 1} / {sorted.length}
                  </span>
                  <button
                    onClick={() => onMove(task.id, -1)}
                    disabled={idx === 0}
                    className={actionBtn}
                    title="Move up"
                  >
                    <i className="fa-solid fa-arrow-up"></i>
                  </button>
                  <button
                    onClick={() => onMove(task.id, 1)}
                    disabled={idx === sorted.length - 1}
                    className={actionBtn}
                    title="Move down"
                  >
                    <i className="fa-solid fa-arrow-down"></i>
                  </button>
                  <button
                    onClick={() => setModal({ open: true, item: task })}
                    className={actionBtn}
                    title="Edit drill"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="text-gray-500 hover:text-m1-rose p-1.5 transition text-xs"
                    title="Delete drill"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <RoutineTaskModal
        open={modal.open}
        initial={modal.item}
        onClose={() => setModal({ open: false, item: null })}
        onSave={(input) => {
          if (modal.item) onUpdate(modal.item.id, input);
          else onAdd(input);
          setModal({ open: false, item: null });
        }}
      />
    </section>
  );
}
