import type { ReactNode } from 'react';

interface ModalShellProps {
  open: boolean;
  title: string;
  icon: string;
  accent?: string;
  onClose: () => void;
  children: ReactNode;
}

export default function ModalShell({ open, title, icon, accent = 'text-m1-cyan', onClose, children }: ModalShellProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-m1-card border border-m1-border rounded-2xl w-full max-w-lg p-6 space-y-5 glow-cyan max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between border-b border-m1-border pb-3">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2 font-mono">
            <i className={`${icon} ${accent}`}></i>
            <span>{title}</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const modalInputClass =
  'w-full bg-m1-bg border border-m1-border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-m1-cyan font-sans';
