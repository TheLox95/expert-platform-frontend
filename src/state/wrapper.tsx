import { Dispatch } from 'react-hooks-global-state';
import React from 'react';
import { useGlobalState as getGlobalState, UseGlobalState, dispatch, DispatchInterface } from "./store";
import actions, { Actions } from "./actions";
import { http, HttpInstance, AllInterface, User, Offering, File, Notification } from "requests";
import { WrappedComponent } from 'state';
import i18n from 'i18n/i18n';
import { i18n as i18nInterface } from 'i18next';

export interface GlobalProps<T ={}> {
  useGlobalState: UseGlobalState
  actions: Actions
  http: HttpInstance<T>
  All: AllInterface
  dispatch: Dispatch<DispatchInterface>
  requests: any
  i18n: i18nInterface
};

export default <P extends {}>(Wrapped: WrappedComponent<P>) => (props: React.PropsWithChildren<P>) => {
  const [ , updateLoading ] = getGlobalState('loading');
  const [ , updateError ] = getGlobalState('error');
  const [ lang ] = getGlobalState('lang');

  const modules = http<P>(updateLoading, updateError);

  const p: GlobalProps<P> = {
    useGlobalState: getGlobalState,
    actions: actions,
    http: modules.instance,
    All: modules.All,
    dispatch: dispatch,
    requests: null,
    i18n: i18n(lang)
  }

  const user = User(p)
  const offering = Offering(p)
  const file = File(p)
  const notification = Notification(p)

  const requests = {
    user: User({ ...p, requests: { user, offering, file, notification }}),
    offering: Offering({ ...p, requests: { user, offering, file, notification }}),
    file: File({ ...p, requests: { user, offering, file, notification }}),
    notification: Notification({ ...p, requests: { user, offering, file, notification }})
  }

  return <Wrapped {...props} {...p} requests={requests} />
};