import type { QcItem } from '../types';

interface QcTabProps {
  items: QcItem[];
  onToggle: (id: string) => void;
  onReset: () => void;
}

export default function QcTab({ items, onToggle, onReset }: QcTabProps) {
  return (
    <section className="space-y-6">
      <div className="bg-gradient-to-r from-m1-cyan/15 via-m1-card to-m1-card border border-m1-cyan/40 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-m1-cyan/20 text-m1-cyan border border-m1-cyan/40 text-xs px-3 py-1 rounded-full font-mono mb-3 font-bold">
            <i className="fa-solid fa-shield-halved"></i>
            <span>TECHNICAL AUDIT PROTOCOL</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Logic Pro Mix &amp; Master QC Checklist</h2>
          <p className="text-sm text-gray-400 mt-1">
            Perform this strict pre-flight audit to verify headroom, phase correlation, and true peak targets before
            bounce.
          </p>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-m1-bg border border-m1-border hover:bg-m1-hover text-xs font-mono text-gray-300 rounded-xl transition"
        >
          <i className="fa-solid fa-rotate-right mr-2"></i>Reset Session Check
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`bg-m1-card border ${
              item.done ? 'border-m1-cyan/60 bg-m1-cyan/5' : 'border-m1-border'
            } p-4 rounded-xl flex items-start justify-between space-x-3 transition-all`}
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[9px] font-mono uppercase bg-m1-bg border border-m1-border px-2 py-0.5 rounded text-m1-cyan font-bold">
                  {item.category}
                </span>
              </div>
              <h4 className="font-bold text-white text-sm mt-1">{item.title}</h4>
              <p className="text-xs text-gray-400">{item.detail}</p>
            </div>
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => onToggle(item.id)}
              className="w-5 h-5 accent-m1-cyan rounded cursor-pointer mt-1"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
