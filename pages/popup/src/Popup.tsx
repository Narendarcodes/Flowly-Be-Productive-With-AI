import { useEffect, useState } from 'react';
import '@src/Popup.css';

export default function Popup() {
  const [flowState, setFlowState] = useState<any>(null);

  useEffect(() => {
    // Initial fetch
    chrome.storage.local.get('flowState', (data) => {
      if (data.flowState) setFlowState(data.flowState);
    });

    // Poll for updates
    const interval = setInterval(() => {
      chrome.storage.local.get('flowState', (data) => {
        if (data.flowState) setFlowState(data.flowState);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!flowState) return <div className="p-4 bg-slate-900 text-white h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="w-80 bg-slate-900 text-white min-h-[400px] p-6 font-sans">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Flow State AI
        </h1>
        <div className={`h-3 w-3 rounded-full ${flowState.status === 'flow' ? 'bg-green-400 shadow-[0_0_10px_#4ade80]' : 'bg-slate-600'}`} />
      </header>

      <div className="text-center mb-8">
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              className="text-slate-800"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="58"
              cx="64"
              cy="64"
            />
            <circle
              className="text-blue-500 transition-all duration-1000 ease-out"
              strokeWidth="8"
              strokeDasharray={365}
              strokeDashoffset={365 - (365 * flowState.score) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="58"
              cx="64"
              cy="64"
            />
          </svg>
          <div className="absolute text-4xl font-light">{Math.round(flowState.score)}</div>
        </div>
        <div className="mt-2 text-slate-400 uppercase tracking-widest text-xs">{flowState.status}</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800/50 p-3 rounded-lg text-center">
          <div className="text-2xl font-light">{Math.floor(flowState.streak / 60)}m</div>
          <div className="text-[10px] text-slate-500 uppercase">Current Streak</div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg text-center">
          <div className="text-2xl font-light">{Math.round(flowState.focusQuality || 0)}%</div>
          <div className="text-[10px] text-slate-500 uppercase">Focus Quality</div>
        </div>
      </div>

      <button
        onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL('analytics/index.html') })}
        className="w-full py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
      >
        View Analytics Dashboard
      </button>
    </div>
  );
}
