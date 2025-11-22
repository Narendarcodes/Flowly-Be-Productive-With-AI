import 'webextension-polyfill';
import { FlowEngine } from './flowEngine';
import { AiAgent } from './aiAgent';

console.log('Flow State Background Service Started');

// Listen for metrics from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'FLOW_METRICS') {
    handleMetrics(message.payload);
  }
});

async function handleMetrics(metrics: any) {
  // 1. Update Flow State
  const flowState = await FlowEngine.updateState(metrics);
  console.log('Updated Flow State:', flowState);

  // 2. Check if we need AI intervention
  // We don't want to spam Gemini, so maybe only check every minute or on state change?
  // For demo, let's check if state is 'distracted' or 'passive' and we haven't checked in a while.

  const now = Date.now();
  const lastIntervention = flowState.lastIntervention || 0;

  if (now - lastIntervention > 60000) { // 1 minute cooldown
    console.log('Requesting AI Analysis...');
    const aiResponse = await AiAgent.analyzeFlowState(metrics);
    console.log('AI Response:', aiResponse);

    // Update state with intervention time
    // (In a real app, we'd update the store)
    flowState.lastIntervention = now;

    // Send action to UI (Popup or Overlay)
    // We can broadcast to all tabs or specific tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'AI_INTERVENTION',
          payload: aiResponse
        });
      }
    });
  }
}
