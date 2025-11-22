// Debug overlay to show extension status on every page
export const DebugOverlay = {
  init: () => {
    console.log('═══════════════════════════════════════════');
    console.log('🔧 DEBUG OVERLAY STARTING...');
    console.log('═══════════════════════════════════════════');
    console.log('🌍 Current URL:', window.location.href);
    console.log('🏠 Hostname:', window.location.hostname);

    // Wait for DOM to be ready
    const injectPanel = () => {
      console.log('💉 Injecting debug panel into DOM...');

      // Remove existing panel if any
      const existing = document.getElementById('flow-state-debug-panel');
      if (existing) {
        console.log('🗑️ Removing existing panel');
        existing.remove();
      }

      // Create debug panel
      const panel = document.createElement('div');
      panel.id = 'flow-state-debug-panel';
      panel.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.95);
      color: #0f0;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      padding: 15px;
      border-radius: 8px;
      z-index: 2147483647;
      max-width: 450px;
      box-shadow: 0 4px 20px rgba(0, 255, 0, 0.3);
      border: 2px solid #0f0;
      animation: slideIn 0.3s ease-out;
    `;

      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(500px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);

      panel.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 10px; color: #0ff; font-size: 14px;">🔧 FLOW STATE AI - DEBUG MODE</div>
        <div id="debug-goal" style="margin: 5px 0; color: #fff;">Goal: <span style="color: #ff0;">Loading...</span></div>
        <div id="debug-url" style="margin: 5px 0; color: #fff;">URL: <span style="color: #fff;">${window.location.hostname}</span></div>
        <div id="debug-status" style="margin: 5px 0; color: #fff; font-weight: bold; font-size: 13px;">Status: <span style="color: #0f0;">Checking...</span></div>
        <div id="debug-blocked" style="margin: 5px 0; color: #fff;">Blocked List: <span style="color: #f00;">Loading...</span></div>
        <div id="debug-ai" style="margin: 5px 0; color: #fff;">AI Status: <span style="color: #ff0;">Waiting...</span></div>
        <button id="close-debug" style="
          margin-top: 10px;
          background: #f00;
          color: #fff;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        ">Close Debug Panel</button>
      `;

      document.body.appendChild(panel);
      console.log('✅ Debug panel added to DOM at:', new Date().toLocaleTimeString()); // Close button
      document.getElementById('close-debug')?.addEventListener('click', () => {
        panel.remove();
        console.log('🗑️ Debug panel closed');
      });

      // Get current goal and blocked sites
      chrome.storage.local.get(['currentGoal', 'blockedSites'], data => {
        console.log('📦 Storage data received:', data);

        const goalEl = document.getElementById('debug-goal');
        const blockedEl = document.getElementById('debug-blocked');

        if (goalEl) {
          if (data.currentGoal) {
            goalEl.innerHTML = `Goal: <span style="color: #0f0;">✓ ACTIVE</span> - "${data.currentGoal.substring(0, 40)}${data.currentGoal.length > 40 ? '...' : ''}"`;
            console.log('✅ Goal is set:', data.currentGoal);
          } else {
            goalEl.innerHTML = `Goal: <span style="color: #f00; font-weight: bold;">✗ NOT SET</span> (Open new tab to set goal)`;
            console.log('❌ No goal set - blocking disabled');
          }
        }

        if (blockedEl && data.blockedSites) {
          const sites = data.blockedSites.slice(0, 5);
          blockedEl.innerHTML = `Blocked List: <span style="color: #f00;">${data.blockedSites.length} sites</span> - ${JSON.stringify(sites)}${data.blockedSites.length > 5 ? '...' : ''}`;
          console.log('🚫 Blocked sites:', data.blockedSites);
        } else {
          blockedEl.innerHTML = `Blocked List: <span style="color: #666;">Empty</span>`;
          console.log('📝 No blocked sites yet');
        }
      });

      // Check if this site should be blocked
      console.log('🔍 Checking if current URL should be blocked...');
      const statusEl = document.getElementById('debug-status');
      const aiEl = document.getElementById('debug-ai');

      chrome.runtime.sendMessage(
        {
          type: 'CHECK_URL_STATUS',
          payload: { url: window.location.href },
        },
        response => {
          console.log('🤖 AI Response received:', response);

          if (chrome.runtime.lastError) {
            console.error('❌ Error checking URL:', chrome.runtime.lastError);
            if (statusEl) {
              statusEl.innerHTML = `Status: <span style="color: #f00;">❌ ERROR</span> - ${chrome.runtime.lastError.message}`;
            }
            if (aiEl) {
              aiEl.innerHTML = `AI Status: <span style="color: #f00;">❌ Communication Failed</span>`;
            }
            return;
          }

          if (statusEl) {
            if (response?.shouldBlock) {
              statusEl.innerHTML = `Status: <span style="color: #f00; font-weight: bold; font-size: 14px;">🚫 THIS SITE SHOULD BE BLOCKED!</span>`;
              console.log("🚫 ⚠️⚠️⚠️ BLOCKING SHOULD HAPPEN BUT DIDN'T! ⚠️⚠️⚠️");
              console.log('Hostname:', response.hostname);

              // Show big warning banner
              const banner = document.createElement('div');
              banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #ff0000, #ff6b00);
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            z-index: 2147483646;
            box-shadow: 0 4px 20px rgba(255,0,0,0.5);
          `;
              banner.innerHTML = `
            🚫 BLOCKING FAILED! This site (${response.hostname}) should be blocked but isn't! 🚫
          `;
              document.body.appendChild(banner);
            } else {
              statusEl.innerHTML = `Status: <span style="color: #0f0;">✓ ALLOWED</span>`;
              console.log('✅ Site is allowed');
            }
          }

          if (aiEl) {
            aiEl.innerHTML = `AI Status: <span style="color: #0f0;">✓ Response Received</span>`;
          }
        },
      );

      console.log('═════════════════════════════════════════════');
      console.log('🔧 FLOW STATE DEBUG PANEL ACTIVE');
      console.log('Check bottom-right corner of page');
      console.log('Panel element:', document.getElementById('flow-state-debug-panel'));
      console.log('═════════════════════════════════════════════');
    };

    // Try to inject immediately if DOM is ready
    if (document.body) {
      console.log('✅ DOM ready - injecting now');
      injectPanel();
    } else {
      console.log('⏳ Waiting for DOM...');
      // Wait for DOM
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          console.log('✅ DOMContentLoaded event fired');
          injectPanel();
        });
      } else {
        // DOM is already loaded but body might not be available yet
        setTimeout(() => {
          console.log('✅ Timeout - trying injection');
          injectPanel();
        }, 100);
      }
    }
  },
};
