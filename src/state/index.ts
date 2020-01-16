import React from 'react';
import { GlobalStateProvider, useGlobalState } from "./store";
import wrapper, { GlobalProps as GlobalP } from "./wrapper";
import actions from "./actions";
import ProtectedRoute from "./ProtectedRoutes";

import Login from "./LoginState";
import NonLogin from "./NonLoginState";

const SessionFactory: React.SFC<{ component: string}> = (props) => {
    const { component } = props;
    const [ user ] = useGlobalState('user')
    let toRender = Login;

    if (!user) {
        toRender = NonLogin
    }

    const toWrap = toRender(component);
    const Resolved = wrapper(toWrap);

    return React.createElement(Resolved);
}

export {
    SessionFactory,
    GlobalStateProvider,
    useGlobalState,
    wrapper,
    actions,
    ProtectedRoute,
}

export type WrappedComponent<T = {}> = React.ComponentType<GlobalP<T> & T>;
export type GlobalProps = GlobalP;
