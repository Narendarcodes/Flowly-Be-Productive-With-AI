import '@src/NewTab.css';
import '@src/NewTab.scss';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { cn, ErrorDisplay, LoadingSpinner } from '@extension/ui';
import { useEffect, useState } from 'react';
import { Brain, Zap, TrendingUp, Clock, Target, AlertCircle } from 'lucide-react';

const NewTab = () => {
  const { isLight } = useStorage(exampleThemeStorage);
  const [time, setTime] = useState(new Date());
  const [flowState, setFlowState] = useState<any>(null);
  const [greeting, setGreeting] = useState('');
  const [goal, setGoal] = useState('');
  const [currentGoal, setCurrentGoal] = useState('');
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Load flow state and goal from storage
    chrome.storage.local.get(['flowState', 'currentGoal'], (data) => {
      if (data.flowState) setFlowState(data.flowState);
      if (data.currentGoal) {
        setCurrentGoal(data.currentGoal);
      } else {
        setShowGoalInput(true);
      }
    });
  }, []);

  const handleSetGoal = async () => {
    if (!goal.trim()) {
      alert('Please enter a goal!');
      return;
    }

    setIsLoading(true);
    
    // Save goal to storage
    await chrome.storage.local.set({ 
      currentGoal: goal,
      goalSetAt: Date.now()
    });
    
    // Send goal to background for AI processing
    chrome.runtime.sendMessage({
      type: 'SET_GOAL',
      payload: { goal }
    });

    setCurrentGoal(goal);
    setShowGoalInput(false);
    setGoal('');
    setIsLoading(false);
  };

  const handleClearGoal = async () => {
    await chrome.storage.local.remove(['currentGoal', 'goalSetAt']);
    chrome.runtime.sendMessage({ type: 'CLEAR_GOAL' });
    setCurrentGoal('');
    setShowGoalInput(true);
  };

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

      {/* Goal Setting Card */}
      <div className={cn('w-full max-w-2xl p-8 rounded-3xl shadow-2xl mb-8 backdrop-blur-xl border',
        isLight ? 'bg-white/80 border-white/20' : 'bg-slate-800/80 border-white/10')}>
        
        {showGoalInput || !currentGoal ? (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-500">
                <Target size={32} />
              </div>
              <div>
                <h2 className={cn('text-2xl font-semibold', isLight ? 'text-slate-900' : 'text-white')}>
                  What's your goal?
                </h2>
                <p className={cn('text-sm', isLight ? 'text-slate-600' : 'text-slate-400')}>
                  AI will help you stay focused by blocking distractions
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className={cn('p-4 rounded-xl border-2 border-dashed',
                isLight ? 'border-slate-300 bg-slate-50' : 'border-slate-600 bg-slate-700/30')}>
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle className={cn('mt-1', isLight ? 'text-blue-600' : 'text-blue-400')} size={20} />
                  <p className={cn('text-sm', isLight ? 'text-slate-700' : 'text-slate-300')}>
                    <strong>Example goals:</strong> "Write a research paper on AI", "Debug login feature", "Learn React hooks"
                  </p>
                </div>
              </div>

              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Complete project documentation for client presentation..."
                className={cn('w-full p-4 rounded-xl resize-none h-32 font-medium transition-all',
                  isLight 
                    ? 'bg-slate-100 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500' 
                    : 'bg-slate-700 text-white placeholder-slate-500 focus:bg-slate-600 focus:ring-2 focus:ring-blue-400'
                )}
                autoFocus
              />

              <button
                onClick={handleSetGoal}
                disabled={isLoading || !goal.trim()}
                className={cn('w-full py-4 rounded-xl font-semibold transition-all',
                  isLoading || !goal.trim()
                    ? 'bg-slate-400 text-slate-200 cursor-not-allowed'
                    : isLight
                    ? 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-[1.02]'
                    : 'bg-purple-500 text-white hover:bg-purple-600 hover:scale-[1.02]'
                )}
              >
                {isLoading ? 'Setting up AI protection...' : '🎯 Start Focused Session'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-500/20 text-green-500">
                  <Target size={32} />
                </div>
                <div>
                  <h2 className={cn('text-xl font-semibold', isLight ? 'text-slate-900' : 'text-white')}>
                    Current Goal
                  </h2>
                  <p className={cn('text-sm', isLight ? 'text-slate-600' : 'text-slate-400')}>
                    AI is protecting your focus
                  </p>
                </div>
              </div>
              <button
                onClick={handleClearGoal}
                className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isLight
                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                )}
              >
                Change Goal
              </button>
            </div>
            <div className={cn('p-6 rounded-xl',
              isLight ? 'bg-slate-50' : 'bg-slate-700/50')}>
              <p className={cn('text-lg leading-relaxed', isLight ? 'text-slate-800' : 'text-slate-200')}>
                "{currentGoal}"
              </p>
            </div>
          </div>
        )}
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
                {Math.round(flowState.focusQuality || 0)}%
              </div>
              <div className={cn('text-xs', isLight ? 'text-slate-600' : 'text-slate-400')}>
                Quality
              </div>
            </div>
            <div className={cn('p-4 rounded-xl text-center',
              isLight ? 'bg-slate-50' : 'bg-slate-700/50')}>
              <Zap className={cn('mx-auto mb-2', isLight ? 'text-slate-600' : 'text-slate-400')} size={20} />
              <div className={cn('text-xl font-semibold', isLight ? 'text-slate-900' : 'text-white')}>
                {flowState.totalActiveSecs ? Math.floor(flowState.totalActiveSecs / 60) : 0}
              </div>
              <div className={cn('text-xs', isLight ? 'text-slate-600' : 'text-slate-400')}>
                Active Min
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
