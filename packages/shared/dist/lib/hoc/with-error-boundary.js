import { jsx as _jsx } from "react/jsx-runtime";
import { ErrorBoundary } from 'react-error-boundary';
export const withErrorBoundary = (Component, FallbackComponent) => function WithErrorBoundary(props) {
    return (_jsx(ErrorBoundary, { FallbackComponent: FallbackComponent, children: _jsx(Component, { ...props }) }));
};
