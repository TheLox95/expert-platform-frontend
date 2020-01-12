import { createGlobalState, UseGlobalState as Global } from 'react-hooks-global-state';
import { User, Offering } from 'models';

export interface InitialState {
    loading: boolean,
    results: null | Offering[],
    error: string | null,
    success: string | null,
    searchTerm: null | string,
    user: User | null
}

const initialState: InitialState = { 
    loading: false,
    results: null,
    error: null,
    success: null,
    searchTerm: null,
    user: JSON.parse(localStorage.getItem('user') || '{}') || null
};

export type UseGlobalState = Global<InitialState>;

const { GlobalStateProvider, useGlobalState } = createGlobalState(initialState);

export { GlobalStateProvider, useGlobalState }