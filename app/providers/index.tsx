'use client';

import { type ReactNode } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import StoreProvider from './StoreProvider';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <NextUIProvider>
            <StoreProvider>
                {children}
            </StoreProvider>
        </NextUIProvider>
    );
}
