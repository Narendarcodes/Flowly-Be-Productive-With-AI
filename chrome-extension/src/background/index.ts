import 'webextension-polyfill';
import { AiAgent } from './aiAgent';
import { FlowEngine } from './flowEngine';

console.log('Flow State Background Service Started');

let currentGoal: string | null = null;
let blockedSites: string[] = [];
let lastNotificationTime = 0;
let consecutiveDistractions = 0;

// Load goal from storage on startup
chrome.storage.local.get(['currentGoal', 'blockedSites'], async data => {
  if (data.currentGoal) {
    currentGoal = data.currentGoal;
    console.log('🎯 Loaded goal from storage:', currentGoal);
    console.log('✅ URL BLOCKING IS NOW ACTIVE');
  } else {
    console.log('⚠️ NO GOAL SET - URL blocking is disabled. Open new tab to set a goal.');
  }
  if (data.blockedSites) {
    blockedSites = data.blockedSites;
    console.log('🚫 Loaded', blockedSites.length, 'blocked sites:', blockedSites);
  }

  // Debug: Show current state
  console.log('═══════════════════════════════════════');
  console.log('🔧 FLOW STATE AI - DEBUG MODE');
  console.log('═══════════════════════════════════════');
  console.log('Goal:', currentGoal || 'NOT SET');
  console.log('Blocked sites:', blockedSites.length);
  console.log('Listeners registered:', {
    'webNavigation.onCommitted': 'YES',
    'tabs.onUpdated': 'YES',
    'runtime.onMessage': 'YES',
  });
  console.log('═══════════════════════════════════════');

  // CHECK ALL EXISTING TABS ON STARTUP
  if (currentGoal) {
    console.log('🔍 Scanning all open tabs for blocked sites...');
    const tabs = await chrome.tabs.query({});
    console.log(`📋 Found ${tabs.length} open tabs`);

    for (const tab of tabs) {
      if (tab.url && tab.id) {
        console.log(`\n🔎 Checking tab ${tab.id}: ${tab.url}`);
        const result = await shouldBlockUrl(tab.url);
        if (result.block) {
          console.log(`🚫 BLOCKING EXISTING TAB: ${result.hostname}`);
          blockUrl(tab.id, result.hostname);
        } else {
          console.log(`✅ Tab allowed: ${result.hostname}`);
        }
      }
    }
    console.log('✅ Tab scan complete\n');
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

  const iconUrl = iconType === 'success' ? 'icon-128.png' : iconType === 'warning' ? 'icon-128.png' : 'icon-128.png';

  chrome.notifications.create({
    type: 'basic',
    iconUrl,
    title,
    message,
    priority: 2,
  });

  lastNotificationTime = now;
  console.log('🔔 Notification:', title, '-', message);
};

// Listen for metrics from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Message received:', message.type);

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
  } else if (message.type === 'CHECK_URL_STATUS') {
    // For debug overlay
    (async () => {
      const result = await shouldBlockUrl(message.payload.url);
      sendResponse({ shouldBlock: result.block, hostname: result.hostname });
    })();
    return true;
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

    if (consecutiveDistractions >= 3) {
      showNotification(
        '⚠️ Focus Alert',
        `You've been distracted for ${consecutiveDistractions} intervals. Take a deep breath and refocus on your goal!`,
        'warning',
      );
      consecutiveDistractions = 0;
    }
  }
  // Track flow state achievements
  else if (status === 'flow' || score >= 80) {
    consecutiveDistractions = 0;

    // Celebrate milestones
    if (streak > 0 && streak % 15 === 0) {
      // Every 15 minutes in flow
      showNotification(
        '🎉 Amazing Focus!',
        `You've been in flow state for ${streak} minutes! Keep up the excellent work!`,
        'success',
      );
    }
  }
  // Active work state
  else if (status === 'active') {
    consecutiveDistractions = 0;
  }

  // Reminder to take breaks
  if (flowState.totalActiveSecs > 3600 && flowState.totalActiveSecs % 3600 < 10) {
    // Every hour
    showNotification(
      '⏰ Time for a Break',
      "You've been working for an hour. Consider taking a 5-minute break to recharge!",
      'info',
    );
  }

  // 3. Check if we need AI intervention
  const now = Date.now();
  const lastIntervention = flowState.lastIntervention || 0;

  if (now - lastIntervention > 60000) {
    // 1 minute cooldown
    console.log('Requesting AI Analysis...');
    const aiResponse = await AiAgent.analyzeFlowState(metrics);
    console.log('AI Response:', aiResponse);

    flowState.lastIntervention = now;

    // Send action to UI (Popup or Overlay)
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'AI_INTERVENTION',
          payload: aiResponse,
        });
      }
    });
  }
};

const handleSetGoal = async (goal: string): Promise<void> => {
  console.log('═══════════════════════════════════════');
  console.log('🎯 SET_GOAL MESSAGE RECEIVED');
  console.log('New Goal:', goal);

  currentGoal = goal;
  blockedSites = []; // Reset blocked sites

  // Save to storage
  await chrome.storage.local.set({
    currentGoal: goal,
    blockedSites: [],
    goalSetAt: Date.now(),
  });

  console.log('✅ Goal saved to storage');
  console.log('🔓 URL BLOCKING IS NOW ACTIVE');
  console.log('All future navigations will be checked');
  console.log('═══════════════════════════════════════');

  showNotification(
    '🎯 Goal Set!',
    `Your goal: "${goal.substring(0, 50)}${goal.length > 50 ? '...' : ''}". AI is now protecting your focus!`,
    'success',
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
    'info',
  );
};

const checkUrlRelevance = async (
  url: string,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: { shouldBlock: boolean; reason?: string }) => void,
): Promise<void> => {
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

// Check if URL should be blocked
const shouldBlockUrl = async (url: string): Promise<{ block: boolean; hostname: string }> => {
  console.log('───────────────────────────────────────');
  console.log('🔍 shouldBlockUrl() called');
  console.log('URL:', url);
  console.log('Current Goal:', currentGoal || 'NOT SET');

  if (!currentGoal) {
    console.log('⚠️ NO GOAL - Skipping check');
    console.log('───────────────────────────────────────');
    return { block: false, hostname: '' };
  }

  if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
    console.log('⚪ Chrome internal URL - Skipping');
    console.log('───────────────────────────────────────');
    return { block: false, hostname: '' };
  }

  try {
    const hostname = new URL(url).hostname;
    console.log('🌐 Hostname extracted:', hostname);

    // Check if already in blocked list
    if (blockedSites.includes(hostname)) {
      console.log('🚫 ALREADY IN BLOCKED LIST');
      console.log('───────────────────────────────────────');
      return { block: true, hostname };
    }

    // Check with AI/heuristic
    console.log('🤖 Checking with AI/heuristic...');
    const isRelevant = await AiAgent.checkUrlRelevance(url, currentGoal);
    console.log('AI Result:', isRelevant ? 'RELEVANT ✅' : 'DISTRACTION 🚫');

    if (!isRelevant) {
      blockedSites.push(hostname);
      await chrome.storage.local.set({ blockedSites });
      console.log('🚫 BLOCKING THIS SITE');
      console.log('Updated blocked list:', blockedSites);
      console.log('───────────────────────────────────────');
      return { block: true, hostname };
    }

    console.log('✅ ALLOWING THIS SITE');
    console.log('───────────────────────────────────────');
    return { block: false, hostname };
  } catch (error) {
    console.error('❌ Error checking URL:', error);
    console.log('───────────────────────────────────────');
    return { block: false, hostname: '' };
  }
};

// Block URL by redirecting to blocked page
const blockUrl = (tabId: number, hostname: string): void => {
  console.log('🔴 blockUrl() - Redirecting tab', tabId);
  console.log('Blocked hostname:', hostname);

  if (!currentGoal) {
    console.log('⚠️ No goal set, cannot block');
    return;
  }

  const blockedUrl =
    chrome.runtime.getURL('blocked.html') +
    '?site=' +
    encodeURIComponent(hostname) +
    '&goal=' +
    encodeURIComponent(currentGoal);

  console.log('Redirect URL:', blockedUrl);

  chrome.tabs.update(tabId, { url: blockedUrl }, () => {
    if (chrome.runtime.lastError) {
      console.error('❌ Failed to redirect tab:', chrome.runtime.lastError);
    } else {
      console.log('✅ Tab redirected successfully');
    }
  });

  showNotification(
    '🚫 Distraction Blocked',
    `${hostname} was blocked. Keep working on: "${currentGoal.substring(0, 40)}..."`,
    'warning',
  );
};

// Monitor navigation with onCommitted (more reliable than onBeforeNavigate)
chrome.webNavigation.onCommitted.addListener(async details => {
  console.log('🌍 webNavigation.onCommitted fired');
  console.log('Tab ID:', details.tabId);
  console.log('URL:', details.url);
  console.log('Frame ID:', details.frameId);
  console.log('Transition Type:', details.transitionType);

  if (details.frameId !== 0) {
    console.log('⚪ Skipping - Not main frame');
    return;
  }

  if (!currentGoal) {
    console.log('⚠️ Skipping - No goal set');
    return;
  }

  console.log('✓ Processing navigation...');
  const result = await shouldBlockUrl(details.url);
  if (result.block) {
    console.log('🛑 WILL BLOCK THIS NAVIGATION');
    blockUrl(details.tabId, result.hostname);
  } else {
    console.log('✓ Navigation allowed');
  }
});

// Also check when tabs are updated (catches some edge cases)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  console.log('📑 tabs.onUpdated fired');
  console.log('Tab ID:', tabId);
  console.log('Change Info:', changeInfo);

  if (!currentGoal) {
    console.log('⚠️ Skipping - No goal set');
    return;
  }

  if (changeInfo.status === 'loading' && changeInfo.url) {
    console.log('✓ Tab is loading, checking URL...');
    console.log('Tab URL:', changeInfo.url);
    const result = await shouldBlockUrl(changeInfo.url);
    if (result.block) {
      console.log('🛑 WILL BLOCK THIS TAB UPDATE');
      blockUrl(tabId, result.hostname);
    } else {
      console.log('✓ Tab update allowed');
    }
  }
});
