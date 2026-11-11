import type { HubData } from '../types';

/**
 * Default M1-COMMAND content, mirrored from the original audio hub prototype.
 * Used as the seed for a fresh database and as the offline fallback.
 */
export const seedData: HubData = {
  routine: [
    {
      id: 'task-1',
      title: 'Frequency Identification Drills',
      duration: '15 MINS',
      tool: 'Logic Pro / Ear Trainer',
      description:
        'Locate muddy 300Hz low-mids, harsh 3kHz resonances, and airy 10kHz boosts before adjusting EQ.',
      completed: false,
      position: 0
    },
    {
      id: 'task-2',
      title: 'Logic Pro Timed Fader Balance Drill',
      duration: '15 MINS',
      tool: 'Logic Pro',
      description:
        'Build a static fader mix from a raw multitrack session using zero plugins. Focus purely on volume and panning.',
      completed: false,
      position: 1
    },
    {
      id: 'task-3',
      title: 'Reaper Sound Design Asset Generation',
      duration: '15 MINS',
      tool: 'Reaper',
      description:
        'Process a single raw audio recording using Reaper item take FX and routing matrix to design a futuristic UI sound.',
      completed: false,
      position: 2
    },
    {
      id: 'task-4',
      title: 'Real-World System Translation Check',
      duration: '15 MINS',
      tool: 'Earbuds / Car Stereo',
      description:
        'Export a short mix snippet and cross-check low-end clarity and vocal placement across consumer playback systems.',
      completed: false,
      position: 3
    }
  ],
  qc: [
    {
      id: 'qc-1',
      title: 'Gain Staging Verified',
      detail: 'Tracks peaking around -18 to -12 dBFS pre-fader.',
      category: 'PREP',
      done: false,
      position: 0
    },
    {
      id: 'qc-2',
      title: 'Pitch & Timing Clean-up',
      detail: 'Flex Pitch tails and transient alignment checked for artifacts.',
      category: 'PREP',
      done: false,
      position: 1
    },
    {
      id: 'qc-3',
      title: 'Static Balance & Panning',
      detail: 'Primary volume relationship solid with main vocals and kick centered.',
      category: 'BALANCE',
      done: false,
      position: 2
    },
    {
      id: 'qc-4',
      title: 'Low-End Phase Alignment',
      detail: 'Sub bass, kick drum, and DI bass correlation locked in mono.',
      category: 'PHASE',
      done: false,
      position: 3
    },
    {
      id: 'qc-5',
      title: 'Dynamic Resonance Tamed',
      detail: 'Dynamic EQ applied to treat harsh 3kHz vocal peaks.',
      category: 'DYNAMICS',
      done: false,
      position: 4
    },
    {
      id: 'qc-6',
      title: 'Bus Compression & Saturation',
      detail: 'Submix glued with gentle 1-2dB compression and subtle tape harmonics.',
      category: 'TONE',
      done: false,
      position: 5
    },
    {
      id: 'qc-7',
      title: 'Mono Compatibility Sum Test',
      detail: "Mix checked in mono to ensure key instruments don't cancel out.",
      category: 'TECHNICAL',
      done: false,
      position: 6
    },
    {
      id: 'qc-8',
      title: 'True Peak Ceiling Set',
      detail: 'Output limiter set to -1.0 dBFS maximum ceiling.',
      category: 'MASTERING',
      done: false,
      position: 7
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Acoustic Soul Session',
      client: '7H Music Group',
      type: 'Mixing (Logic Pro)',
      revisions: '2 Rounds Included',
      status: 'In Mix (Logic Pro)'
    },
    {
      id: 'proj-2',
      title: 'Cyberpunk Sound Effects Kit',
      client: 'East Sound Technologies',
      type: 'Sound Design (Reaper)',
      revisions: 'Internal R&D Asset',
      status: 'Reaper SD Processing'
    }
  ],
  roadmap: [
    {
      id: 'r7h-1',
      org: '7H',
      title: 'Standardize Client Terms & Revision Limits',
      description: 'Cap revisions to 2 rounds per mix to protect studio engineering hours.',
      status: 'Done',
      position: 0
    },
    {
      id: 'r7h-2',
      org: '7H',
      title: 'Create Logic Pro Mix & Master Template Suite',
      description: 'Pre-routed summing stacks and aux returns saved to template directory.',
      status: 'In Progress',
      position: 1
    },
    {
      id: 'r7h-3',
      org: '7H',
      title: 'Launch 7H Engineering Service Portal',
      description: 'Dedicated client intake for commercial mixing, mastering, and stem delivery.',
      status: 'Pending',
      position: 2
    },
    {
      id: 'est-1',
      org: 'EST',
      title: 'Reaper Custom Action Scripting Setup',
      description: 'Build modular hotkey workflows for fast sound design asset exports.',
      status: 'Done',
      position: 0
    },
    {
      id: 'est-2',
      org: 'EST',
      title: 'DSP & Audio Plugin Architecture R&D',
      description: 'Explore JUCE and HISE audio plugin frameworks for custom VST development.',
      status: 'In Progress',
      position: 1
    },
    {
      id: 'est-3',
      org: 'EST',
      title: 'Proprietary Sample & Preset Sound Bank',
      description: 'Create original sci-fi & hybrid instrument sound libraries engineered in Reaper.',
      status: 'Pending',
      position: 2
    }
  ]
};
