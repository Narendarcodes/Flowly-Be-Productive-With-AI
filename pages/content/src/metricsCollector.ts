
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
            chrome.runtime.sendMessage({
                type: 'FLOW_METRICS',
                payload: metrics
            });

            // Reset periodic counters if needed, or keep cumulative?
            // For flow, we want current state.
            // Errors and switchCount might need decay or reset.
            // For now, we send cumulative and let background handle windowing if needed, 
            // or we reset here. Let's reset errors/switchCount to represent "rate" per 10s.
            metrics.errors = 0;
            metrics.switchCount = 0;
        }, 10000);
    }
};
