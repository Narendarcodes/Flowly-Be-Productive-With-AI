import { jsx as _jsx } from "react/jsx-runtime";
import { Suspense } from 'react';
export const withSuspense = (Component, SuspenseComponent) => (props) => (_jsx(Suspense, { fallback: SuspenseComponent, children: _jsx(Component, { ...props }) }));
