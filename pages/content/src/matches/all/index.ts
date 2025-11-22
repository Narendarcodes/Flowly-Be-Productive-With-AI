import { DebugOverlay } from '../../debugOverlay';
import { MetricsCollector } from '../../metricsCollector';
import { sampleFunction } from '@src/sample-function';

console.log('content script loaded');

MetricsCollector.init();

// Initialize debug overlay (shows blocking status on every page)
setTimeout(() => {
  DebugOverlay.init();
}, 1000);

void sampleFunction();
