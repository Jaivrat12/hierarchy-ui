import { configureStore } from '@reduxjs/toolkit';
import companyReducer from './features/company/companySlice';
import { loadState } from './browser-storage';

export const makeStore = () => {
    return configureStore({
        reducer: {
            company: companyReducer,
        },
        preloadedState: { company: loadState() },
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
