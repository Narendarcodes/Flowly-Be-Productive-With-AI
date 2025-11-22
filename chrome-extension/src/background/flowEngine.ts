const INITIAL_STATE: FlowState = {
  score: 50,
  status: 'passive',
  streak: 0,
  sessionStart: Date.now(),
  lastIntervention: 0,
  focusQuality: 0,
  totalActiveSecs: 0,
  metricsHistory: [],
};

// Simple in-memory store for now, sync with storage later
let currentState = { ...INITIAL_STATE };

interface Metrics {
  typingCadence: number;
  errors: number;
  mouseSmoothness: number;
  switchCount: number;
}

export interface FlowState {
  score: number;
  status: 'passive' | 'active' | 'flow' | 'distracted' | 'break';
  streak: number;
  sessionStart: number;
  lastIntervention: number;
  focusQuality: number; // 0-100, average quality over session
  totalActiveSecs: number; // Total active time
  metricsHistory: Array<{ score: number; timestamp: number; [key: string]: unknown }>; // Last few metrics for trend analysis
}

export const FlowEngine = {
  calculateScore: (metrics: Metrics) => {
    const { typingCadence, errors, mouseSmoothness, switchCount } = metrics;
    
    console.log('📊 Calculating score from metrics:', { typingCadence, errors, mouseSmoothness, switchCount });
    
    // Improved algorithm with better weighting
    let score = 50; // Base score
    
    // Typing cadence: 0-60 WPM is optimal (60-300 chars/min)
    // Normalize to 0-100 scale, where 60+ CPM = max points
    const typingScore = Math.min(100, (typingCadence / 60) * 100);
    score += (typingScore - 50) * 0.4; // Weight: 40% of change
    
    // Errors: Each error reduces score (max -20)
    const errorPenalty = Math.min(20, errors * 3);
    score -= errorPenalty;
    
    // Mouse smoothness: Higher is better (0-100)
    score += (mouseSmoothness - 50) * 0.3; // Weight: 30% of change
    
    // Tab switches: Each switch is a distraction
    const switchPenalty = Math.min(30, switchCount * 10);
    score -= switchPenalty;
    
    // Ensure score stays in bounds
    const finalScore = Math.max(0, Math.min(100, score));
    console.log('✅ Final score:', finalScore, '(typing:', typingScore.toFixed(1), 'errors:', -errorPenalty, 'mouse:', mouseSmoothness, 'switches:', -switchPenalty, ')');
    
    return finalScore;
  },

  calculateFocusQuality: (state: FlowState) => {
    // Focus quality is based on consistency and time in flow
    // Average of recent scores weighted by time in flow state
    if (state.metricsHistory.length === 0) return 0;
    
    const recentScores = state.metricsHistory.map(m => m.score || 50);
    const avgScore = recentScores.reduce((a: number, b: number) => a + b, 0) / recentScores.length;
    
    // Bonus for streak (up to 20% boost)
    const streakBonus = Math.min(20, (state.streak / 300) * 20); // 5min streak = max bonus
    
    return Math.min(100, avgScore + streakBonus);
  },

  updateState: async (metrics: Metrics) => {
    const newScore = FlowEngine.calculateScore(metrics);
    currentState.score = newScore;
    
    // Add to history (keep last 10 measurements)
    currentState.metricsHistory.push({ score: newScore, timestamp: Date.now(), ...metrics });
    if (currentState.metricsHistory.length > 10) {
      currentState.metricsHistory.shift();
    }
    
    // Determine status with hysteresis to avoid flapping
    const previousStatus = currentState.status;
    if (newScore > 80) currentState.status = 'flow';
    else if (newScore > 60) currentState.status = 'active';
    else if (newScore < 30) currentState.status = 'distracted';
    else if (newScore < 50) currentState.status = 'passive';
    
    // Log status changes
    if (previousStatus !== currentState.status) {
      console.log('🔄 Status changed:', previousStatus, '→', currentState.status);
    }

    // Update streak and total active time
    currentState.totalActiveSecs += 10; // Each update = 10 seconds
    
    if (currentState.status === 'flow' || currentState.status === 'active') {
      currentState.streak += 10; // Add 10 seconds
    } else {
      if (currentState.streak > 0) {
        console.log('❌ Streak broken at', currentState.streak, 'seconds');
      }
      currentState.streak = 0;
    }

    // Calculate focus quality
    currentState.focusQuality = FlowEngine.calculateFocusQuality(currentState);
    
    console.log('💾 Saving state:', {
      score: currentState.score,
      status: currentState.status,
      streak: currentState.streak,
      focusQuality: currentState.focusQuality.toFixed(1) + '%'
    });

    // Save to storage
    await chrome.storage.local.set({ flowState: currentState });
    
    return currentState;
  },

  getState: () => currentState,
};
