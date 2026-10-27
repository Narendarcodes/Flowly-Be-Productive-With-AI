import '@src/index.css';
import Blocked from '@src/Blocked';
import { createRoot } from 'react-dom/client';

const container = document.querySelector('#app-container');
if (!container) throw new Error('Can not find #app-container');
createRoot(container).render(<Blocked />);
