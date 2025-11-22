import { createStorage, StorageEnum } from '../base/index.js';
const storage = createStorage('theme-storage-key', {
    theme: 'light',
    isLight: true,
}, {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
});
export const exampleThemeStorage = {
    ...storage,
    toggle: async () => {
        await storage.set(currentState => {
            const newTheme = currentState.theme === 'light' ? 'dark' : 'light';
            return {
                theme: newTheme,
                isLight: newTheme === 'light',
            };
        });
    },
};
