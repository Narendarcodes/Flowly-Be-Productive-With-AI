import { sampleFunction } from '@src/sample-function';

import { MetricsCollector } from '../../metricsCollector';

console.log('content script loaded');

MetricsCollector.init();


void sampleFunction();
