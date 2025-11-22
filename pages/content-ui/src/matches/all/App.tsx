import { useEffect, useState } from 'react';

export default function App() {
  const [intervention, setIntervention] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const listener = (message: any) => {
      if (message.type === 'AI_INTERVENTION') {
        setIntervention(message.payload);
        setVisible(true);
        // Auto hide after 10s unless it's a block
        if (message.payload.action !== 'block distraction') {
          setTimeout(() => setVisible(false), 10000);
        }
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  if (!visible || !intervention) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-sm animate-in fade-in slide-in-from-top-4 duration-300 font-sans">
      <div className={`
        rounded-xl border border-white/20 p-4 shadow-2xl backdrop-blur-xl
        ${intervention.action === 'block distraction' ? 'bg-red-500/90 text-white' : 'bg-slate-900/90 text-slate-100'}
      `}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg">{intervention.classification.toUpperCase()}</h3>
            <p className="mt-1 text-sm opacity-90">{intervention.reasoning}</p>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="ml-4 rounded-full p-1 hover:bg-white/20"
          >
            ✕
          </button>
        </div>

        <div className="mt-4">
          <div className="text-xs font-mono opacity-70 uppercase tracking-wider">Recommended Action</div>
          <div className="mt-1 text-xl font-light">{intervention.action}</div>
        </div>

        {intervention.action === 'micro-break' && (
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-full animate-[shrink_60s_linear] bg-white" />
          </div>
        )}
      </div>
    </div>
  );
}
