import { createRoot } from 'react-dom/client';
import Analytics from './Analytics';
import './index.css';

function init() {
    const appContainer = document.querySelector('#app-container');
    if (!appContainer) {
        throw new Error('Can not find #app-container');
    }
    const root = createRoot(appContainer);
    root.render(<Analytics />);
}

init();
