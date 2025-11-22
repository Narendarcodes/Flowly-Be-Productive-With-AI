import '@src/Options.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { cn, ErrorDisplay, LoadingSpinner } from '@extension/ui';
import { Settings, Bell, Zap, Brain } from 'lucide-react';

const Options = () => {
  const { isLight } = useStorage(exampleThemeStorage);

  return (
    <div className={cn('min-h-screen p-8', isLight ? 'bg-slate-50 text-gray-900' : 'bg-gray-800 text-gray-100')}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className={cn('p-3 rounded-xl', isLight ? 'bg-blue-100 text-blue-600' : 'bg-blue-900 text-blue-400')}>
              <Settings size={32} />
            </div>
            <h1 className="text-4xl font-bold">Flow-State AI Settings</h1>
          </div>
          <p className={cn('text-lg', isLight ? 'text-slate-600' : 'text-slate-400')}>
            Customize your flow state detection and productivity preferences
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Appearance */}
          <div className={cn('p-6 rounded-2xl', isLight ? 'bg-white shadow-sm' : 'bg-slate-700')}>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Zap size={24} />
              Appearance
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className={cn('text-sm', isLight ? 'text-slate-600' : 'text-slate-400')}>
                  Choose between light and dark mode
                </p>
              </div>
              <button
                onClick={exampleThemeStorage.toggle}
                className={cn('px-6 py-3 rounded-lg font-medium transition-colors',
                  isLight
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600')}
              >
                {isLight ? 'Switch to Dark' : 'Switch to Light'}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className={cn('p-6 rounded-2xl', isLight ? 'bg-white shadow-sm' : 'bg-slate-700')}>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Bell size={24} />
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Flow State Alerts</p>
                  <p className={cn('text-sm', isLight ? 'text-slate-600' : 'text-slate-400')}>
                    Get notified when entering or exiting flow state
                  </p>
                </div>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Break Reminders</p>
                  <p className={cn('text-sm', isLight ? 'text-slate-600' : 'text-slate-400')}>
                    Receive reminders to take breaks
                  </p>
                </div>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
            </div>
          </div>

          {/* AI Settings */}
          <div className={cn('p-6 rounded-2xl', isLight ? 'bg-white shadow-sm' : 'bg-slate-700')}>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Brain size={24} />
              AI Analysis
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-2">Analysis Frequency</label>
                <select className={cn('w-full p-3 rounded-lg border',
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-600 border-slate-500')}>
                  <option>Every 30 seconds</option>
                  <option selected>Every 60 seconds</option>
                  <option>Every 2 minutes</option>
                  <option>Every 5 minutes</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Intervention Sensitivity</p>
                  <p className={cn('text-sm', isLight ? 'text-slate-600' : 'text-slate-400')}>
                    How quickly the AI suggests interventions
                  </p>
                </div>
                <select className={cn('p-2 rounded-lg border',
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-600 border-slate-500')}>
                  <option>Low</option>
                  <option selected>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
          </div>

          {/* About */}
          <div className={cn('p-6 rounded-2xl text-center', isLight ? 'bg-blue-50' : 'bg-slate-700')}>
            <h3 className="text-xl font-semibold mb-2">Flow-State AI Assistant</h3>
            <p className={cn('text-sm mb-4', isLight ? 'text-slate-600' : 'text-slate-400')}>
              Version 1.0.0 • Powered by Gemini AI
            </p>
            <p className={cn('text-sm', isLight ? 'text-slate-600' : 'text-slate-400')}>
              Achieve peak productivity with AI-powered flow state detection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <LoadingSpinner />), ErrorDisplay);
