import React from 'react';
import { useGlobalState as getGlobalState, UseGlobalState } from "./store";
import actions, { Actions } from "./actions";
import http, { HttpInstance, AllInterface } from "./http";

export interface GlobalProps<T ={}> {
  useGlobalState: UseGlobalState
  actions: Actions
  http: HttpInstance<T>
  All: AllInterface
};

export default <P extends {}>(Wrapped: React.ComponentType<P>) =>(props: any) => {
  const [ , updateLoading ] = getGlobalState('loading');
  const [ , updateError ] = getGlobalState('error');

  const modules = http(updateLoading, updateError );

  const p: GlobalProps = {
    useGlobalState: getGlobalState,
    actions: actions,
    http: modules.instance,
    All: modules.All,
  }
  return <Wrapped {...props as P} {...p}/>
};