import { createStore, UseGlobalState as Global } from 'react-hooks-global-state';
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
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null
};

export type DispatchInterface = {type: string, payload: any};

const reducer = (state:InitialState, action: DispatchInterface) => {
    switch (action.type) {
      case 'user': {
          if (typeof action.payload === 'object') {
            localStorage.setItem('user', JSON.stringify(action.payload))
            return { ...state, user: action.payload};
          }
        return { ...state, user: action.payload};
      }
      default: return state;
    }
};

export type UseGlobalState = Global<InitialState>;

const { GlobalStateProvider, useGlobalState, dispatch } = createStore(reducer, initialState);

export { GlobalStateProvider, useGlobalState, dispatch }