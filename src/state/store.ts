import { createStore, UseGlobalState as Global } from 'react-hooks-global-state';
import { User, Offering, Notification } from 'models';

export interface InitialState {
    loading: boolean,
    results: null | Offering[],
    error: string | null,
    success: string | null,
    searchTerm: null | string,
    user: User | null
    notifications: Notification[],
    lang: 'en' | 'es',
    availableLangs: ['en', 'es']
}

const initialState: InitialState = { 
    loading: false,
    results: null,
    error: null,
    success: null,
    searchTerm: null,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null,
    notifications: [],
    lang: 'en',
    availableLangs: ['en', 'es']
};

export type DispatchInterface = {type: string, payload?: any};

const reducer = (state:InitialState, action: DispatchInterface) => {
    switch (action.type) {
      case 'user': {
          if (typeof action.payload === 'object') {
            localStorage.setItem('user', JSON.stringify(action.payload))
            return { ...state, user: action.payload};
          }
        return { ...state, user: action.payload};
      }
      case 'notifications': 
        return { ...state, notifications: action.payload };
      case 'success': 
        return { ...state, success: action.payload };
      case 'logout': {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        return { ...state, user: null};
    }
      default: return state;
    }
};

export type UseGlobalState = Global<InitialState>;

const { GlobalStateProvider, useGlobalState, dispatch } = createStore(reducer, initialState);

export { GlobalStateProvider, useGlobalState, dispatch }