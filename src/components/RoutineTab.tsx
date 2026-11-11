import type { RoutineTask } from '../types';

interface RoutineTabProps {
  tasks: RoutineTask[];
  onToggle: (id: string) => void;
}

export default function RoutineTab({ tasks, onToggle }: RoutineTabProps) {
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
          <div className="bg-m1-bg border border-m1-border rounded-xl p-4 flex items-center space-x-5 min-w-[200px] justify-between">
            <div>
              <div className="text-xs text-gray-400 font-mono uppercase">Completion</div>
              <div className="text-3xl font-extrabold text-m1-gold font-mono mt-0.5">{percent}%</div>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-m1-gold/30 bg-m1-gold/10 flex items-center justify-center text-m1-gold font-bold font-mono text-base">
              {completedCount}/{tasks.length}
            </div>
          </div>
        </div>
      </div>

      {/* Practice Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task, idx) => (
          <div
            key={task.id}
            className={`bg-m1-card border ${
              task.completed ? 'border-m1-gold/60 bg-m1-gold/5' : 'border-m1-border'
            } rounded-xl p-4 transition-all duration-200 flex flex-col justify-between space-y-3`}
          >
            <div className="flex items-start justify-between space-x-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
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
              <span className="text-gray-500">
                Task {idx + 1} / {tasks.length}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
