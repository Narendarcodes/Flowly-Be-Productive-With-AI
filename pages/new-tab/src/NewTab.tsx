import '@src/NewTab.css';
import '@src/NewTab.scss';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { cn, ErrorDisplay, LoadingSpinner } from '@extension/ui';
import { useEffect, useState } from 'react';
import { Brain, Zap, TrendingUp, Clock } from 'lucide-react';

const NewTab = () => {
  const { isLight } = useStorage(exampleThemeStorage);
  const [time, setTime] = useState(new Date());
  const [flowState, setFlowState] = useState<any>(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Load flow state from storage
    chrome.storage.local.get('flowState', (data) => {
      if (data.flowState) setFlowState(data.flowState);
    });
  }, []);

  const openAnalytics = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('analytics/index.html') });
  };

  return (
    <div className={cn('min-h-screen flex flex-col items-center justify-center p-8',
      isLight ? 'bg-gradient-to-br from-slate-50 to-blue-50' : 'bg-gradient-to-br from-slate-900 to-slate-800')}>

      {/* Time Display */}
      <div className="text-center mb-12">
        <h1 className={cn('text-8xl font-light mb-4', isLight ? 'text-slate-900' : 'text-white')}>
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </h1>
        <p className={cn('text-2xl font-light', isLight ? 'text-slate-600' : 'text-slate-400')}>
          {greeting}
        </p>
      </div>

      {/* Flow State Card */}
      {flowState && (
        <div className={cn('w-full max-w-2xl p-8 rounded-3xl shadow-2xl mb-8 backdrop-blur-xl border',
          isLight ? 'bg-white/80 border-white/20' : 'bg-slate-800/80 border-white/10')}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={cn('p-3 rounded-xl',
                flowState.status === 'flow' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500')}>
                <Brain size={32} />
              </div>
              <div>
                <h2 className={cn('text-2xl font-semibold', isLight ? 'text-slate-900' : 'text-white')}>
                  Flow State
                </h2>
                <p className={cn('text-sm uppercase tracking-wider',
                  isLight ? 'text-slate-600' : 'text-slate-400')}>
                  {flowState.status}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={cn('text-5xl font-light', isLight ? 'text-slate-900' : 'text-white')}>
                {Math.round(flowState.score)}
              </div>
              <div className={cn('text-xs uppercase tracking-wider',
                isLight ? 'text-slate-500' : 'text-slate-500')}>
                Score
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className={cn('p-4 rounded-xl text-center',
              isLight ? 'bg-slate-50' : 'bg-slate-700/50')}>
              <Clock className={cn('mx-auto mb-2', isLight ? 'text-slate-600' : 'text-slate-400')} size={20} />
              <div className={cn('text-xl font-semibold', isLight ? 'text-slate-900' : 'text-white')}>
                {Math.floor(flowState.streak / 60)}m
              </div>
              <div className={cn('text-xs', isLight ? 'text-slate-600' : 'text-slate-400')}>
                Streak
              </div>
            </div>
            <div className={cn('p-4 rounded-xl text-center',
              isLight ? 'bg-slate-50' : 'bg-slate-700/50')}>
              <TrendingUp className={cn('mx-auto mb-2', isLight ? 'text-slate-600' : 'text-slate-400')} size={20} />
              <div className={cn('text-xl font-semibold', isLight ? 'text-slate-900' : 'text-white')}>
                85%
              </div>
              <div className={cn('text-xs', isLight ? 'text-slate-600' : 'text-slate-400')}>
                Quality
              </div>
            </div>
            <div className={cn('p-4 rounded-xl text-center',
              isLight ? 'bg-slate-50' : 'bg-slate-700/50')}>
              <Zap className={cn('mx-auto mb-2', isLight ? 'text-slate-600' : 'text-slate-400')} size={20} />
              <div className={cn('text-xl font-semibold', isLight ? 'text-slate-900' : 'text-white')}>
                12
              </div>
              <div className={cn('text-xs', isLight ? 'text-slate-600' : 'text-slate-400')}>
                Sessions
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button
          onClick={openAnalytics}
          className={cn('px-8 py-4 rounded-xl font-medium transition-all hover:scale-105',
            isLight
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-500 text-white hover:bg-blue-600')}
        >
          View Analytics
        </button>
        <button
          onClick={() => exampleThemeStorage.toggle()}
          className={cn('px-8 py-4 rounded-xl font-medium transition-all hover:scale-105',
            isLight
              ? 'bg-slate-200 text-slate-900 hover:bg-slate-300'
              : 'bg-slate-700 text-white hover:bg-slate-600')}
        >
          Toggle Theme
        </button>
      </div>

      {/* Footer */}
      <div className={cn('mt-12 text-sm', isLight ? 'text-slate-500' : 'text-slate-600')}>
        Flow-State AI Assistant • Powered by Gemini AI
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <LoadingSpinner />), ErrorDisplay);
