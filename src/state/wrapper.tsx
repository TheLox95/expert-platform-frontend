import React from 'react';
import { AxiosInstance } from 'axios';
import { useGlobalState as getGlobalState, UseGlobalState } from "./store";
import actions, { Actions } from "./actions";
import http from "./http";

export interface GlobalProps {
  useGlobalState: UseGlobalState,
  actions: Actions,
  http: AxiosInstance,
};

export default <P extends {}>(Wrapped: React.ComponentType<P>) =>(props: any) => {
  const [ , updateLoading ] = getGlobalState('loading');
  const [ , updateError ] = getGlobalState('error');

  const instance = http(updateLoading, updateError );


  const p = {
    useGlobalState: getGlobalState,
    actions: actions,
    http: instance,
  }
  return <Wrapped {...props as P} {...p}/>
};