import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ErrorHeader } from './ErrorHeader';
import { ErrorResetButton } from './ErrorResetButton';
import { ErrorStackTraceList } from './ErrorStackTraceList';
export const ErrorDisplay = ({ error, resetErrorBoundary }) => (_jsx("div", { className: "flex items-center justify-center bg-gray-50 px-4 py-6 sm:px-6 lg:px-8", children: _jsxs("div", { className: "w-full max-w-md space-y-8", children: [_jsx(ErrorHeader, {}), _jsx(ErrorStackTraceList, { error: error }), _jsx(ErrorResetButton, { resetErrorBoundary: resetErrorBoundary })] }) }));
