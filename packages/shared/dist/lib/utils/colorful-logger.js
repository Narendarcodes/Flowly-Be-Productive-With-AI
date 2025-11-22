import { COLORS } from './const.js';
export const colorfulLog = (message, type) => {
    let color;
    switch (type) {
        case 'success':
            color = COLORS.FgGreen;
            break;
        case 'info':
            color = COLORS.FgBlue;
            break;
        case 'error':
            color = COLORS.FgRed;
            break;
        case 'warning':
            color = COLORS.FgYellow;
            break;
        default:
            color = COLORS[type];
            break;
    }
    console.info(color, message);
    console.info(COLORS['Reset']);
};
