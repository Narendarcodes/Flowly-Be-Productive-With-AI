import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ErrorHeader } from '../../../lib/components/error-display/ErrorHeader';
import { ErrorResetButton } from '../../../lib/components/error-display/ErrorResetButton';
import { ErrorStackTraceList } from '../../../lib/components/error-display/ErrorStackTraceList';
export const ErrorDisplay = ({ error, resetErrorBoundary }) => (_jsx("div", { className: "flex items-center justify-center bg-gray-50 px-4 py-6 sm:px-6 lg:px-8", children: _jsxs("div", { className: "w-full max-w-md space-y-8", children: [_jsx(ErrorHeader, {}), _jsx(ErrorStackTraceList, { error: error }), _jsx(ErrorResetButton, { resetErrorBoundary: resetErrorBoundary })] }) }));
