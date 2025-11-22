(function(){"use strict";const m=()=>{console.log("content script - sampleFunction() called from another module")};let i={typingCadence:0,errors:0,mouseSmoothness:0,switchCount:0,lastActive:Date.now()},r=[],c=[];const u={init:()=>{console.log("Flow State Metrics Collector Initialized"),document.addEventListener("keydown",e=>{const n=Date.now();i.lastActive=n,e.key==="Backspace"?i.errors++:e.key.length===1&&(r.push(n),r=r.filter(o=>n-o<6e4),i.typingCadence=r.length)}),document.addEventListener("mousemove",e=>{const n=Date.now();i.lastActive=n,c.push({x:e.clientX,y:e.clientY,t:n}),c=c.filter(o=>n-o.t<5e3),c.length>10&&(i.mouseSmoothness=100)}),document.addEventListener("visibilitychange",()=>{document.hidden||i.switchCount++}),setInterval(()=>{console.log("📤 Sending metrics to background:",{typing:i.typingCadence+" chars/min",errors:i.errors,mouse:i.mouseSmoothness,switches:i.switchCount,lastActive:new Date(i.lastActive).toLocaleTimeString()}),chrome.runtime.sendMessage({type:"FLOW_METRICS",payload:i}),i.errors=0,i.switchCount=0},1e4),chrome.runtime.onMessage.addListener(e=>{e.type==="AI_INTERVENTION"&&g(e.payload)})},showFlowStateChange:(e,n)=>{e==="flow"?g({classification:"deep flow",action:"amplify flow",reasoning:`Excellent! You're in flow state with a score of ${n}. Keep it up!`}):e==="distracted"&&g({classification:"decreasing focus",action:"block distraction",reasoning:`Your focus is slipping (score: ${n}). Take a breath and refocus on your goal.`})}};function g(e){const n=document.getElementById("flow-state-alert");n&&n.remove();const o=document.createElement("div");o.id="flow-state-alert",o.style.cssText=`
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px 24px;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 999999;
        max-width: 400px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        animation: slideIn 0.3s ease-out;
    `;const d=e.action==="block distraction"?"⚠️":e.action==="amplify flow"?"🚀":e.action==="micro-break"?"☕":"💡";o.innerHTML=`
        <style>
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
        </style>
        <div style="display: flex; align-items: start; gap: 12px;">
            <div style="font-size: 32px;">${d}</div>
            <div style="flex: 1;">
                <div style="font-weight: 600; font-size: 16px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${e.classification}
                </div>
                <div style="font-size: 14px; line-height: 1.5; opacity: 0.95;">
                    ${e.reasoning}
                </div>
                <div style="margin-top: 12px; font-size: 12px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px;">
                    ${e.action.replace(/-/g," ")}
                </div>
            </div>
            <button id="close-flow-alert" style="
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
            ">×</button>
        </div>
    `,document.body.appendChild(o),setTimeout(()=>{o.parentNode&&(o.style.animation="slideOut 0.3s ease-in",setTimeout(()=>o.remove(),300))},8e3);const s=document.getElementById("close-flow-alert");s&&(s.addEventListener("click",()=>{o.style.animation="slideOut 0.3s ease-in",setTimeout(()=>o.remove(),300)}),s.addEventListener("mouseenter",l=>{l.target.style.background="rgba(255,255,255,0.3)"}),s.addEventListener("mouseleave",l=>{l.target.style.background="rgba(255,255,255,0.2)"}))}const y={init:()=>{console.log("═══════════════════════════════════════════"),console.log("🔧 DEBUG OVERLAY STARTING..."),console.log("═══════════════════════════════════════════"),console.log("🌍 Current URL:",window.location.href),console.log("🏠 Hostname:",window.location.hostname);const e=()=>{var f;console.log("💉 Injecting debug panel into DOM...");const n=document.getElementById("flow-state-debug-panel");n&&(console.log("🗑️ Removing existing panel"),n.remove());const o=document.createElement("div");o.id="flow-state-debug-panel",o.style.cssText=`
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
    `;const d=document.createElement("style");d.textContent=`
        @keyframes slideIn {
          from { transform: translateX(500px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `,document.head.appendChild(d),o.innerHTML=`
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
      `,document.body.appendChild(o),console.log("✅ Debug panel added to DOM at:",new Date().toLocaleTimeString()),(f=document.getElementById("close-debug"))==null||f.addEventListener("click",()=>{o.remove(),console.log("🗑️ Debug panel closed")}),chrome.storage.local.get(["currentGoal","blockedSites"],t=>{console.log("📦 Storage data received:",t);const a=document.getElementById("debug-goal"),p=document.getElementById("debug-blocked");if(a&&(t.currentGoal?(a.innerHTML=`Goal: <span style="color: #0f0;">✓ ACTIVE</span> - "${t.currentGoal.substring(0,40)}${t.currentGoal.length>40?"...":""}"`,console.log("✅ Goal is set:",t.currentGoal)):(a.innerHTML='Goal: <span style="color: #f00; font-weight: bold;">✗ NOT SET</span> (Open new tab to set goal)',console.log("❌ No goal set - blocking disabled"))),p&&t.blockedSites){const b=t.blockedSites.slice(0,5);p.innerHTML=`Blocked List: <span style="color: #f00;">${t.blockedSites.length} sites</span> - ${JSON.stringify(b)}${t.blockedSites.length>5?"...":""}`,console.log("🚫 Blocked sites:",t.blockedSites)}else p.innerHTML='Blocked List: <span style="color: #666;">Empty</span>',console.log("📝 No blocked sites yet")}),console.log("🔍 Checking if current URL should be blocked...");const s=document.getElementById("debug-status"),l=document.getElementById("debug-ai");chrome.runtime.sendMessage({type:"CHECK_URL_STATUS",payload:{url:window.location.href}},t=>{if(console.log("🤖 AI Response received:",t),chrome.runtime.lastError){console.error("❌ Error checking URL:",chrome.runtime.lastError),s&&(s.innerHTML=`Status: <span style="color: #f00;">❌ ERROR</span> - ${chrome.runtime.lastError.message}`),l&&(l.innerHTML='AI Status: <span style="color: #f00;">❌ Communication Failed</span>');return}if(s)if(t!=null&&t.shouldBlock){s.innerHTML='Status: <span style="color: #f00; font-weight: bold; font-size: 14px;">🚫 THIS SITE SHOULD BE BLOCKED!</span>',console.log("🚫 ⚠️⚠️⚠️ BLOCKING SHOULD HAPPEN BUT DIDN'T! ⚠️⚠️⚠️"),console.log("Hostname:",t.hostname);const a=document.createElement("div");a.style.cssText=`
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
          `,a.innerHTML=`
            🚫 BLOCKING FAILED! This site (${t.hostname}) should be blocked but isn't! 🚫
          `,document.body.appendChild(a)}else s.innerHTML='Status: <span style="color: #0f0;">✓ ALLOWED</span>',console.log("✅ Site is allowed");l&&(l.innerHTML='AI Status: <span style="color: #0f0;">✓ Response Received</span>')}),console.log("═════════════════════════════════════════════"),console.log("🔧 FLOW STATE DEBUG PANEL ACTIVE"),console.log("Check bottom-right corner of page"),console.log("Panel element:",document.getElementById("flow-state-debug-panel")),console.log("═════════════════════════════════════════════")};document.body?(console.log("✅ DOM ready - injecting now"),e()):(console.log("⏳ Waiting for DOM..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{console.log("✅ DOMContentLoaded event fired"),e()}):setTimeout(()=>{console.log("✅ Timeout - trying injection"),e()},100))}};console.log("content script loaded"),u.init(),setTimeout(()=>{y.init()},1e3),m()})();
