import { Storage } from '@extension/storage';

export interface FlowState {
  score: number;
  status: 'passive' | 'active' | 'flow' | 'distracted' | 'break';
  streak: number;
  sessionStart: number;
  lastIntervention: number;
}

const INITIAL_STATE: FlowState = {
  score: 50,
  status: 'passive',
  streak: 0,
  sessionStart: Date.now(),
  lastIntervention: 0,
};

// Simple in-memory store for now, sync with storage later
let currentState = { ...INITIAL_STATE };

export const FlowEngine = {
  calculateScore: (metrics: any) => {
    const { typingCadence, errors, mouseSmoothness, switchCount } = metrics;
    
    // Simple algorithm
    let score = 50;
    score += typingCadence * 0.5; // 0-100
    score -= errors * 2;
    score += mouseSmoothness * 0.2;
    score -= switchCount * 5;
    
    return Math.max(0, Math.min(100, score));
  },

  updateState: async (metrics: any) => {
    const newScore = FlowEngine.calculateScore(metrics);
    currentState.score = newScore;
    
    // Determine status
    if (newScore > 80) currentState.status = 'flow';
    else if (newScore > 50) currentState.status = 'active';
    else if (newScore < 30) currentState.status = 'distracted';
    else currentState.status = 'passive';

    // Update streak
    if (currentState.status === 'flow') {
      currentState.streak += 10; // Add 10 seconds
    } else {
      currentState.streak = 0;
    }

    // Save to storage (mock)
    await chrome.storage.local.set({ flowState: currentState });
    
    return currentState;
  },

  getState: () => currentState,
};
