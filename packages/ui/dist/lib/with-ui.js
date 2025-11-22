import deepmerge from 'deepmerge';
export const withUI = (tailwindConfig) => deepmerge(tailwindConfig, {
    content: ['../../packages/ui/lib/**/*.tsx'],
});
