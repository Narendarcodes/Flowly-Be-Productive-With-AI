(function(){"use strict";const l=()=>{console.log("content script - sampleFunction() called from another module")};let t={typingCadence:0,errors:0,mouseSmoothness:0,switchCount:0,lastActive:Date.now()},n=[],s=[];const d={init:()=>{console.log("Flow State Metrics Collector Initialized"),document.addEventListener("keydown",e=>{const o=Date.now();t.lastActive=o,e.key==="Backspace"?t.errors++:e.key.length===1&&(n.push(o),n=n.filter(i=>o-i<6e4),t.typingCadence=n.length)}),document.addEventListener("mousemove",e=>{const o=Date.now();t.lastActive=o,s.push({x:e.clientX,y:e.clientY,t:o}),s=s.filter(i=>o-i.t<5e3),s.length>10&&(t.mouseSmoothness=100)}),document.addEventListener("visibilitychange",()=>{document.hidden||t.switchCount++}),setInterval(()=>{console.log("📤 Sending metrics to background:",{typing:t.typingCadence+" chars/min",errors:t.errors,mouse:t.mouseSmoothness,switches:t.switchCount,lastActive:new Date(t.lastActive).toLocaleTimeString()}),chrome.runtime.sendMessage({type:"FLOW_METRICS",payload:t}),t.errors=0,t.switchCount=0},1e4),chrome.runtime.onMessage.addListener(e=>{e.type==="AI_INTERVENTION"&&r(e.payload)})},showFlowStateChange:(e,o)=>{e==="flow"?r({classification:"deep flow",action:"amplify flow",reasoning:`Excellent! You're in flow state with a score of ${o}. Keep it up!`}):e==="distracted"&&r({classification:"decreasing focus",action:"block distraction",reasoning:`Your focus is slipping (score: ${o}). Take a breath and refocus on your goal.`})}};function r(e){const o=document.getElementById("flow-state-alert");o&&o.remove();const i=document.createElement("div");i.id="flow-state-alert",i.style.cssText=`
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
    `;const m=e.action==="block distraction"?"⚠️":e.action==="amplify flow"?"🚀":e.action==="micro-break"?"☕":"💡";i.innerHTML=`
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
            <div style="font-size: 32px;">${m}</div>
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
    `,document.body.appendChild(i),setTimeout(()=>{i.parentNode&&(i.style.animation="slideOut 0.3s ease-in",setTimeout(()=>i.remove(),300))},8e3);const a=document.getElementById("close-flow-alert");a&&(a.addEventListener("click",()=>{i.style.animation="slideOut 0.3s ease-in",setTimeout(()=>i.remove(),300)}),a.addEventListener("mouseenter",c=>{c.target.style.background="rgba(255,255,255,0.3)"}),a.addEventListener("mouseleave",c=>{c.target.style.background="rgba(255,255,255,0.2)"}))}console.log("content script loaded"),d.init(),l()})();
