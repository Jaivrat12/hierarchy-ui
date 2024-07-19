'use client';

import { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';
import { AppStore, makeStore } from '@/lib/store';
import { saveState } from '@/lib/browser-storage';

type StoreProviderProps = {
    children: ReactNode;
};

export default function StoreProvider({ children }: StoreProviderProps) {
    const storeRef = useRef<AppStore>();
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore();
        storeRef.current.subscribe(() => saveState(storeRef.current!.getState().company));
    }

    return (
        <Provider store={storeRef.current}>
            {children}
        </Provider>
    );
}
