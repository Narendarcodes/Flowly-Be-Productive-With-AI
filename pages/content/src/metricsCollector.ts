
export interface Metrics {
    typingCadence: number; // chars per minute (approx)
    errors: number; // backspace count
    mouseSmoothness: number; // variance in mouse movement
    switchCount: number; // tab switches (requires background listener, but we can track focus/blur)
    lastActive: number;
}

let metrics: Metrics = {
    typingCadence: 0,
    errors: 0,
    mouseSmoothness: 0,
    switchCount: 0,
    lastActive: Date.now(),
};

let keystrokes: number[] = [];
let mousePositions: { x: number; y: number; t: number }[] = [];

export const MetricsCollector = {
    init: () => {
        console.log('Flow State Metrics Collector Initialized');

        // Typing listener
        document.addEventListener('keydown', (e) => {
            const now = Date.now();
            metrics.lastActive = now;

            if (e.key === 'Backspace') {
                metrics.errors++;
            } else if (e.key.length === 1) {
                keystrokes.push(now);
                // Keep last 60 seconds
                keystrokes = keystrokes.filter(t => now - t < 60000);
                metrics.typingCadence = keystrokes.length;
            }
        });

        // Mouse listener
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            metrics.lastActive = now;

            mousePositions.push({ x: e.clientX, y: e.clientY, t: now });
            // Keep last 5 seconds for smoothness calc
            mousePositions = mousePositions.filter(p => now - p.t < 5000);

            if (mousePositions.length > 10) {
                // Calculate smoothness (simple variance of delta)
                // This is a simplified placeholder logic
                metrics.mouseSmoothness = 100; // Default high smoothness
            }
        });

        // Visibility listener
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Tab switched away or minimized
                // We can't track switch count reliably here, but we can detect focus loss
            } else {
                metrics.switchCount++;
            }
        });

        // Send metrics loop
        setInterval(() => {
            console.log('📤 Sending metrics to background:', {
                typing: metrics.typingCadence + ' chars/min',
                errors: metrics.errors,
                mouse: metrics.mouseSmoothness,
                switches: metrics.switchCount,
                lastActive: new Date(metrics.lastActive).toLocaleTimeString()
            });
            
            chrome.runtime.sendMessage({
                type: 'FLOW_METRICS',
                payload: metrics
            });

            // Reset periodic counters to represent "rate" per 10s interval
            metrics.errors = 0;
            metrics.switchCount = 0;
        }, 10000);

        // Listen for AI interventions
        chrome.runtime.onMessage.addListener((message) => {
            if (message.type === 'AI_INTERVENTION') {
                showAlert(message.payload);
            }
        });
    },

    showFlowStateChange: (status: string, score: number) => {
        // Show visual feedback when flow state changes significantly
        if (status === 'flow') {
            showAlert({
                classification: 'deep flow',
                action: 'amplify flow',
                reasoning: `Excellent! You're in flow state with a score of ${score}. Keep it up!`
            });
        } else if (status === 'distracted') {
            showAlert({
                classification: 'decreasing focus',
                action: 'block distraction',
                reasoning: `Your focus is slipping (score: ${score}). Take a breath and refocus on your goal.`
            });
        }
    }
};

// Visual alert overlay
function showAlert(payload: any): void {
    // Remove existing alert if any
    const existing = document.getElementById('flow-state-alert');
    if (existing) existing.remove();

    const alert = document.createElement('div');
    alert.id = 'flow-state-alert';
    alert.style.cssText = `
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
    `;

    const icon = payload.action === 'block distraction' ? '⚠️' : 
                 payload.action === 'amplify flow' ? '🚀' : 
                 payload.action === 'micro-break' ? '☕' : '💡';

    alert.innerHTML = `
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
            <div style="font-size: 32px;">${icon}</div>
            <div style="flex: 1;">
                <div style="font-weight: 600; font-size: 16px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${payload.classification}
                </div>
                <div style="font-size: 14px; line-height: 1.5; opacity: 0.95;">
                    ${payload.reasoning}
                </div>
                <div style="margin-top: 12px; font-size: 12px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px;">
                    ${payload.action.replace(/-/g, ' ')}
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
    `;

    document.body.appendChild(alert);

    // Auto-dismiss after 8 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => alert.remove(), 300);
        }
    }, 8000);

    // Close button
    const closeBtn = document.getElementById('close-flow-alert');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            alert.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => alert.remove(), 300);
        });
        closeBtn.addEventListener('mouseenter', (e) => {
            (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.3)';
        });
        closeBtn.addEventListener('mouseleave', (e) => {
            (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.2)';
        });
    }
}
