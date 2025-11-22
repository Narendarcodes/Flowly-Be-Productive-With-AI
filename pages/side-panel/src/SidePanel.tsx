import '@src/SidePanel.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { cn, ErrorDisplay, LoadingSpinner } from '@extension/ui';
import { useEffect, useState } from 'react';
import { Activity, TrendingUp, Clock, Zap } from 'lucide-react';

const SidePanel = () => {
  const { isLight } = useStorage(exampleThemeStorage);
  const [flowState, setFlowState] = useState<any>(null);

  useEffect(() => {
    // Load flow state from storage
    const loadFlowState = () => {
      chrome.storage.local.get('flowState', (data) => {
        if (data.flowState) setFlowState(data.flowState);
      });
    };

    loadFlowState();
    const interval = setInterval(loadFlowState, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn('min-h-screen p-4', isLight ? 'bg-slate-50' : 'bg-gray-900')}>
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className={cn('text-2xl font-bold mb-2', isLight ? 'text-slate-900' : 'text-white')}>
            Flow State
          </h1>
          <p className={cn('text-sm', isLight ? 'text-slate-600' : 'text-slate-400')}>
            Real-time monitoring
          </p>
        </div>

        {/* Flow Score */}
        {flowState && (
          <>
            <div className={cn('p-6 rounded-2xl text-center',
              isLight ? 'bg-white shadow-sm' : 'bg-slate-800')}>
              <div className="relative inline-flex items-center justify-center mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    className={isLight ? 'text-slate-200' : 'text-slate-700'}
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-blue-500 transition-all duration-1000"
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
                <div className={cn('absolute text-4xl font-light',
                  isLight ? 'text-slate-900' : 'text-white')}>
                  {Math.round(flowState.score)}
                </div>
              </div>
              <div className={cn('text-xs uppercase tracking-widest',
                isLight ? 'text-slate-500' : 'text-slate-400')}>
                {flowState.status}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className={cn('p-4 rounded-xl text-center',
                isLight ? 'bg-white shadow-sm' : 'bg-slate-800')}>
                <Clock className={cn('mx-auto mb-2',
                  isLight ? 'text-slate-600' : 'text-slate-400')} size={20} />
                <div className={cn('text-2xl font-semibold',
                  isLight ? 'text-slate-900' : 'text-white')}>
                  {Math.floor(flowState.streak / 60)}m
                </div>
                <div className={cn('text-xs',
                  isLight ? 'text-slate-600' : 'text-slate-400')}>
                  Streak
                </div>
              </div>
              <div className={cn('p-4 rounded-xl text-center',
                isLight ? 'bg-white shadow-sm' : 'bg-slate-800')}>
                <TrendingUp className={cn('mx-auto mb-2',
                  isLight ? 'text-slate-600' : 'text-slate-400')} size={20} />
                <div className={cn('text-2xl font-semibold',
                  isLight ? 'text-slate-900' : 'text-white')}>
                  {Math.round(flowState.focusQuality || 0)}%
                </div>
                <div className={cn('text-xs',
                  isLight ? 'text-slate-600' : 'text-slate-400')}>
                  Quality
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className={cn('p-4 rounded-xl',
              flowState.status === 'flow'
                ? 'bg-green-500/20 border border-green-500/30'
                : 'bg-blue-500/20 border border-blue-500/30')}>
              <div className="flex items-center gap-3">
                <Activity className={
                  flowState.status === 'flow' ? 'text-green-500' : 'text-blue-500'
                } size={24} />
                <div>
                  <p className={cn('font-medium',
                    isLight ? 'text-slate-900' : 'text-white')}>
                    {flowState.status === 'flow' ? 'In the Zone!' : 'Keep Going'}
                  </p>
                  <p className={cn('text-xs',
                    isLight ? 'text-slate-600' : 'text-slate-400')}>
                    {flowState.status === 'flow'
                      ? 'You\'re in peak flow state'
                      : 'Building momentum...'}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <button
          onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL('analytics/index.html') })}
          className={cn('w-full py-3 rounded-xl font-medium transition-colors',
            isLight
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-500 text-white hover:bg-blue-600')}
        >
          View Analytics
        </button>

        <button
          onClick={exampleThemeStorage.toggle}
          className={cn('w-full py-3 rounded-xl font-medium transition-colors',
            isLight
              ? 'bg-slate-200 text-slate-900 hover:bg-slate-300'
              : 'bg-slate-700 text-white hover:bg-slate-600')}
        >
          Toggle Theme
        </button>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <LoadingSpinner />), ErrorDisplay);
