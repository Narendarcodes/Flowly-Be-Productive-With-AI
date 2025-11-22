import { baseEnv, dynamicEnvValues } from './lib/index.js';
export * from './lib/index.js';
export default {
    ...baseEnv,
    ...dynamicEnvValues,
};
