import 'webextension-polyfill';
import { FlowEngine } from './flowEngine';
import { AiAgent } from './aiAgent';

console.log('Flow State Background Service Started');

let currentGoal: string | null = null;
let blockedSites: string[] = [];
let lastNotificationTime = 0;
let consecutiveDistractions = 0;
let consecutiveFlowMinutes = 0;

// Load goal from storage on startup
chrome.storage.local.get(['currentGoal', 'blockedSites'], (data) => {
  if (data.currentGoal) {
    currentGoal = data.currentGoal;
    console.log('🎯 Loaded goal from storage:', currentGoal);
  }
  if (data.blockedSites) {
    blockedSites = data.blockedSites;
    console.log('🚫 Loaded', blockedSites.length, 'blocked sites');
  }
});

interface Metrics {
  typingCadence: number;
  errors: number;
  mouseSmoothness: number;
  switchCount: number;
  [key: string]: unknown;
}

// Show browser notification
const showNotification = (title: string, message: string, iconType: 'success' | 'warning' | 'info' = 'info'): void => {
  const now = Date.now();
  // Throttle notifications to max 1 per minute
  if (now - lastNotificationTime < 60000) return;
  
  const iconUrl = iconType === 'success' ? 'icon-128.png' : 
                  iconType === 'warning' ? 'icon-128.png' : 'icon-128.png';
  
  chrome.notifications.create({
    type: 'basic',
    iconUrl,
    title,
    message,
    priority: 2
  });
  
  lastNotificationTime = now;
  console.log('🔔 Notification:', title, '-', message);
};

// Listen for metrics from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'FLOW_METRICS') {
    handleMetrics(message.payload);
    return false;
  } else if (message.type === 'SET_GOAL') {
    handleSetGoal(message.payload.goal);
    return false;
  } else if (message.type === 'CLEAR_GOAL') {
    handleClearGoal();
    return false;
  } else if (message.type === 'CHECK_URL') {
    // Check if URL should be blocked
    checkUrlRelevance(message.payload.url, sender, sendResponse);
    return true; // Keep channel open for async response
  }
  return false;
});

const handleMetrics = async (metrics: Metrics): Promise<void> => {
  // 1. Update Flow State
  const flowState = await FlowEngine.updateState(metrics);
  console.log('Updated Flow State:', flowState);

  // 2. Monitor flow state and send alerts
  const status = flowState.status;
  const score = flowState.score;
  const streak = Math.floor(flowState.streak / 60); // minutes
  
  // Track distraction patterns
  if (status === 'distracted' || score < 30) {
    consecutiveDistractions++;
    consecutiveFlowMinutes = 0;
    
    if (consecutiveDistractions >= 3) {
      showNotification(
        '⚠️ Focus Alert',
        `You've been distracted for ${consecutiveDistractions} intervals. Take a deep breath and refocus on your goal!`,
        'warning'
      );
      consecutiveDistractions = 0;
    }
  } 
  // Track flow state achievements
  else if (status === 'flow' || score >= 80) {
    consecutiveDistractions = 0;
    consecutiveFlowMinutes++;
    
    // Celebrate milestones
    if (streak > 0 && streak % 15 === 0) { // Every 15 minutes in flow
      showNotification(
        '🎉 Amazing Focus!',
        `You've been in flow state for ${streak} minutes! Keep up the excellent work!`,
        'success'
      );
    }
  }
  // Active work state
  else if (status === 'active') {
    consecutiveDistractions = 0;
    consecutiveFlowMinutes++;
  }
  
  // Reminder to take breaks
  if (flowState.totalActiveSecs > 3600 && flowState.totalActiveSecs % 3600 < 10) { // Every hour
    showNotification(
      '⏰ Time for a Break',
      'You\'ve been working for an hour. Consider taking a 5-minute break to recharge!',
      'info'
    );
  }

  // 3. Check if we need AI intervention
  const now = Date.now();
  const lastIntervention = flowState.lastIntervention || 0;

  if (now - lastIntervention > 60000) { // 1 minute cooldown
    console.log('Requesting AI Analysis...');
    const aiResponse = await AiAgent.analyzeFlowState(metrics);
    console.log('AI Response:', aiResponse);

    flowState.lastIntervention = now;

    // Send action to UI (Popup or Overlay)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'AI_INTERVENTION',
          payload: aiResponse
        });
      }
    });
  }
};

const handleSetGoal = async (goal: string): Promise<void> => {
  currentGoal = goal;
  blockedSites = []; // Reset blocked sites
  
  // Save to storage
  await chrome.storage.local.set({ 
    currentGoal: goal,
    blockedSites: [],
    goalSetAt: Date.now()
  });
  
  console.log('🎯 Goal set:', goal);
  console.log('✅ AI-based URL filtering activated');
  
  showNotification(
    '🎯 Goal Set!',
    `Your goal: "${goal.substring(0, 50)}${goal.length > 50 ? '...' : ''}". AI is now protecting your focus!`,
    'success'
  );
};

const handleClearGoal = async (): Promise<void> => {
  currentGoal = null;
  blockedSites = [];
  
  await chrome.storage.local.remove(['currentGoal', 'blockedSites', 'goalSetAt']);
  
  console.log('❌ Goal cleared, URL filtering deactivated');
  
  showNotification(
    'Goal Cleared',
    'Website blocking has been disabled. Set a new goal to re-enable focus protection.',
    'info'
  );
};

const checkUrlRelevance = async (url: string, sender: chrome.runtime.MessageSender, sendResponse: (response: { shouldBlock: boolean; reason?: string }) => void): Promise<void> => {
  if (!currentGoal) {
    sendResponse({ shouldBlock: false });
    return;
  }

  const hostname = new URL(url).hostname;
  
  // Check if already in blocked list
  if (blockedSites.includes(hostname)) {
    sendResponse({ shouldBlock: true, reason: 'Previously identified as distraction' });
    return;
  }

  // Use AI to determine if URL is relevant to goal
  console.log('🤖 Checking URL relevance:', hostname, 'for goal:', currentGoal);
  
  const isRelevant = await AiAgent.checkUrlRelevance(url, currentGoal);
  
  if (!isRelevant) {
    blockedSites.push(hostname);
    await chrome.storage.local.set({ blockedSites });
    console.log('🚫 Blocked:', hostname);
    sendResponse({ shouldBlock: true, reason: `Not relevant to your goal: "${currentGoal}"` });
  } else {
    console.log('✅ Allowed:', hostname);
    sendResponse({ shouldBlock: false });
  }
};

// Monitor navigation and check URLs
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return; // Only main frame
  if (!currentGoal) return;

  const url = details.url;
  
  // Skip chrome:// and extension:// URLs
  if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) return;

  try {
    const hostname = new URL(url).hostname;
    
    // Check if already blocked
    if (blockedSites.includes(hostname)) {
      chrome.tabs.update(details.tabId, {
        url: chrome.runtime.getURL('blocked.html') + '?site=' + encodeURIComponent(hostname) + '&goal=' + encodeURIComponent(currentGoal)
      });
      showNotification(
        '🚫 Site Blocked',
        `${hostname} is not relevant to your goal. Stay focused!`,
        'warning'
      );
      return;
    }

    // Check with AI
    console.log('🔍 Checking URL with AI/heuristic:', hostname);
    const isRelevant = await AiAgent.checkUrlRelevance(url, currentGoal);
    
    if (!isRelevant) {
      blockedSites.push(hostname);
      await chrome.storage.local.set({ blockedSites });
      console.log('🚫 Navigation blocked:', hostname);
      
      // Show notification
      showNotification(
        '🚫 Distraction Blocked',
        `${hostname} was blocked. Keep working on: "${currentGoal.substring(0, 40)}..."`,
        'warning'
      );
      
      // Redirect to block page
      chrome.tabs.update(details.tabId, {
        url: chrome.runtime.getURL('blocked.html') + '?site=' + encodeURIComponent(hostname) + '&goal=' + encodeURIComponent(currentGoal)
      });
    } else {
      console.log('✅ URL allowed:', hostname);
    }
  } catch (error) {
    console.error('Error checking URL:', error);
  }
});
