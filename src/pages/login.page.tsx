import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom'
import { wrapper, WrappedComponent } from "state";
import { FormGroup, InputGroup, Button, Callout } from "@blueprintjs/core";
import { User } from 'models';

const Login: WrappedComponent = ({ http, useGlobalState, i18n, requests }) => {
    const [ user, setUser ] = useGlobalState('user');
    const [ username, updateUsername ] = useState('');
    const [ password, updatePassword ] = useState('');

    const send = (e: React.FormEvent) => {
        e.preventDefault();
        requests.user.login(username, password)
        .then((u: User) => setUser(u))
    }

    if (user) {
        return <Redirect to={'/dashboard'} />
    }

    return (
        <>
            <form onSubmit={send} id="login-from">
                <FormGroup
                    label={i18n.t('login-identifier')}
                    labelFor="user-input"
                >
                    <InputGroup id="user-input" placeholder={i18n.t('login-identifier')} onChange={(e: React.FormEvent<HTMLInputElement>) => updateUsername(e.currentTarget.value)} />
                </FormGroup>

                <FormGroup
                    label={i18n.t('login-password')}
                    labelFor="password-input"
                >
                    <InputGroup type="password" id="password-input" placeholder={i18n.t('login-password')} onChange={(e: React.FormEvent<HTMLInputElement>) => updatePassword(e.currentTarget.value)} />
                </FormGroup>

                <Button type="submit" id="submit-input">{i18n.t('login-button')}</Button>
            </form>
            <div style={{ display: 'flex', marginTop: '1rem'}}>
                <Callout style={{ marginRight: '0.5rem' }}>
                    <Link to="/register/expert">
                        <Button fill={true} id="register-expert-input">{i18n.t('register-expert')}</Button>
                    </Link>
                </Callout>
                <Callout style={{ marginLeft: '0.5rem' }}>
                    <Link to="/register/client">
                        <Button fill={true} id="register-client-input">{i18n.t('register-client')}</Button>
                    </Link>
                </Callout>
            </div>
        </>
    );
}

export default wrapper(Login);