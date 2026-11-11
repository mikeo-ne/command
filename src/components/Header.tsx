import { useEffect, useState } from 'react';
import type { SyncStatus } from '../types';

interface HeaderProps {
  status: SyncStatus;
}

function formatEAT(date: Date): string {
  return `${date.toLocaleTimeString('en-GB', {
    timeZone: 'Africa/Nairobi',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })} EAT`;
}

const syncLabel: Record<SyncStatus, string> = {
  loading: 'SYNCING…',
  live: 'CLOUD SYNC LIVE',
  local: 'LOCAL MODE'
};

function SyncBadge({ status, compact = false }: { status: SyncStatus; compact?: boolean }) {
  const live = status === 'live';
  const loading = status === 'loading';
  return (
    <div
      className={`flex items-center space-x-2 border rounded-lg font-mono ${
        compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'
      } ${
        live
          ? 'border-m1-emerald/40 text-m1-emerald bg-m1-emerald/10'
          : loading
            ? 'border-m1-border text-gray-400 bg-m1-bg'
            : 'border-m1-gold/40 text-m1-gold bg-m1-gold/10'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          live ? 'bg-m1-emerald animate-pulse' : loading ? 'bg-gray-500 animate-pulse' : 'bg-m1-gold'
        }`}
      ></span>
      <span className="font-bold">{syncLabel[status]}</span>
    </div>
  );
}

export default function Header({ status }: HeaderProps) {
  const [time, setTime] = useState(() => formatEAT(new Date()));

  useEffect(() => {
    const timer = window.setInterval(() => setTime(formatEAT(new Date())), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-m1-border bg-m1-card/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-m1-cyan via-m1-purple to-m1-gold p-[2px] glow-cyan">
          <div className="w-full h-full bg-m1-bg rounded-[10px] flex items-center justify-center">
            <span className="font-mono font-extrabold text-m1-cyan text-lg tracking-tighter">M1</span>
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-extrabold text-lg tracking-wider text-white font-mono">M1-COMMAND</h1>
            <span className="bg-m1-cyan/10 border border-m1-cyan/40 text-m1-cyan text-[10px] px-2 py-0.5 rounded font-mono font-bold tracking-widest">
              AUDIO HUB
            </span>
          </div>
          <p className="text-xs text-gray-400">Mike 1ne Audio Engineering &amp; Sound Tech Ecosystem</p>
        </div>
      </div>

      {/* Master VU Meter & Status Lights (desktop) */}
      <div className="hidden lg:flex items-center space-x-6 font-mono text-xs">
        <div className="flex items-center space-x-3 bg-m1-bg border border-m1-border px-3 py-1.5 rounded-lg">
          <span className="text-gray-400 text-[10px]">PEAK METRICS:</span>
          <div className="flex space-x-1 items-end h-4 w-28 bg-black/50 p-1 rounded">
            <div className="w-1.5 h-2 rounded-sm led-active-cyan"></div>
            <div className="w-1.5 h-2.5 rounded-sm led-active-cyan"></div>
            <div className="w-1.5 h-3 rounded-sm led-active-cyan"></div>
            <div className="w-1.5 h-3.5 rounded-sm led-active-cyan"></div>
            <div className="w-1.5 h-3 rounded-sm led-active-gold"></div>
            <div className="w-1.5 h-4 rounded-sm led-active-gold"></div>
            <div className="w-1.5 h-3 rounded-sm led-active-red"></div>
          </div>
          <span className="text-m1-gold font-bold">-1.0 dB</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-m1-gold animate-pulse"></span>
            <span className="text-gray-400">LOGIC PRO:</span>
            <span className="text-m1-gold">MIX/MASTER</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-m1-cyan animate-pulse"></span>
            <span className="text-gray-400">REAPER:</span>
            <span className="text-m1-cyan">SOUND DESIGN</span>
          </div>
        </div>

        <SyncBadge status={status} />

        <div className="text-gray-400 font-bold bg-m1-bg px-3 py-1.5 rounded-lg border border-m1-border">{time}</div>
      </div>

      {/* Compact status (mobile / tablet) */}
      <div className="flex lg:hidden items-center space-x-2">
        <SyncBadge status={status} compact />
        <div className="text-gray-400 font-bold bg-m1-bg px-2 py-1 rounded-lg border border-m1-border text-[11px] font-mono">
          {time}
        </div>
      </div>
    </header>
  );
}
