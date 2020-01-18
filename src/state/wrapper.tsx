import { Dispatch } from 'react-hooks-global-state';
import React from 'react';
import { useGlobalState as getGlobalState, UseGlobalState, dispatch, DispatchInterface } from "./store";
import actions, { Actions } from "./actions";
import http, { HttpInstance, AllInterface } from "./http";
import { WrappedComponent } from 'state';
import User from './User';
import Offering from './Offering';
import File from './File';

export interface GlobalProps<T ={}> {
  useGlobalState: UseGlobalState
  actions: Actions
  http: HttpInstance<T>
  All: AllInterface
  dispatch: Dispatch<DispatchInterface>
  requests: any
};

export default <P extends {}>(Wrapped: WrappedComponent<P>) => (props: React.PropsWithChildren<P>) => {
  const [ , updateLoading ] = getGlobalState('loading');
  const [ , updateError ] = getGlobalState('error');

  const modules = http<P>(updateLoading, updateError);

  const p: GlobalProps<P> = {
    useGlobalState: getGlobalState,
    actions: actions,
    http: modules.instance,
    All: modules.All,
    dispatch: dispatch,
    requests: null
  }

  const user = User(p)
  const offering = Offering(p)
  const file = File(p)

  const requests = {
    user: User({ ...p, requests: { user, offering, file }}),
    offering: Offering({ ...p, requests: { user, offering, file }}),
    file: File({ ...p, requests: { user, offering, file }})
  }

  return <Wrapped {...props} {...p} requests={requests} />
};