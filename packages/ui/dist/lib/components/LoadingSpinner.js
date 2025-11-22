import { jsx as _jsx } from "react/jsx-runtime";
import { RingLoader } from 'react-spinners';
export const LoadingSpinner = ({ size }) => (_jsx("div", { className: 'flex min-h-screen items-center justify-center', children: _jsx(RingLoader, { size: size ?? 100, color: 'aqua' }) }));
