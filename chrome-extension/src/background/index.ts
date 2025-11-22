import 'webextension-polyfill';
import { FlowEngine } from './flowEngine';
import { AiAgent } from './aiAgent';

console.log('Flow State Background Service Started');

let currentGoal: string | null = null;
let blockedSites: string[] = [];

interface Metrics {
  typingCadence: number;
  errors: number;
  mouseSmoothness: number;
  switchCount: number;
  [key: string]: unknown;
}

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

  // 2. Check if we need AI intervention
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
  console.log('🎯 Goal set:', goal);
  
  // Use AI to generate list of potentially distracting categories
  blockedSites = []; // Reset blocked sites
  
  console.log('✅ AI-based URL filtering activated');
};

const handleClearGoal = (): void => {
  currentGoal = null;
  blockedSites = [];
  console.log('❌ Goal cleared, URL filtering deactivated');
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
      return;
    }

    // Check with AI
    const isRelevant = await AiAgent.checkUrlRelevance(url, currentGoal);
    
    if (!isRelevant) {
      blockedSites.push(hostname);
      console.log('🚫 Navigation blocked:', hostname);
      
      // Redirect to block page
      chrome.tabs.update(details.tabId, {
        url: chrome.runtime.getURL('blocked.html') + '?site=' + encodeURIComponent(hostname) + '&goal=' + encodeURIComponent(currentGoal)
      });
    }
  } catch (error) {
    console.error('Error checking URL:', error);
  }
});
