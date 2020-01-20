import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom'
import { wrapper, WrappedComponent } from "state";
import { FormGroup, InputGroup, Button, Callout } from "@blueprintjs/core";
import { User } from 'models';

const Login: WrappedComponent<{ user: User, jwt: string }> = (prop) => {
    const { http, useGlobalState } = prop
    const [ user, updateUser ] = useGlobalState('user');
    const [ username, updateUsername ] = useState('');
    const [ password, updatePassword ] = useState('');

    const send = (e: React.FormEvent) => {
        e.preventDefault();
        http({
            url: 'http://localhost:1337/auth/local', 
            method: 'post',
            data: {
                identifier: username,
                password: password,
            }
        }).then((response) => {
            const user = response.data.user;
            const jwt = response.data.jwt;
            // Handle success.
            console.log('Well done!');
            console.log('User profile', user);
            localStorage.setItem('user', JSON.stringify(user))
            updateUser(user);

            console.log('User token', jwt);
            localStorage.setItem('token', jwt)
        })
        .catch(error => {
            // Handle error.
            console.log('An error occurred:', error);
        });
    }

    if (user) {
        return <Redirect to={'/dashboard'} />
    }

    return (
        <>
            <form onSubmit={send} id="login-from">
                <FormGroup
                    label="Username or email"
                    labelFor="user-input"
                >
                    <InputGroup id="user-input" placeholder="Username or email" onChange={(e: React.FormEvent<HTMLInputElement>) => updateUsername(e.currentTarget.value)} />
                </FormGroup>

                <FormGroup
                    label="Password"
                    labelFor="password-input"
                >
                    <InputGroup type="password" id="password-input" placeholder="Password" onChange={(e: React.FormEvent<HTMLInputElement>) => updatePassword(e.currentTarget.value)} />
                </FormGroup>

                <Button type="submit" id="submit-input">Login</Button>
            </form>
            <div style={{ display: 'flex', marginTop: '1rem'}}>
                <Callout style={{ marginRight: '0.5rem' }}>
                    <Link to="/register/expert">
                        <Button fill={true} id="submit-input">Register as Expert</Button>
                    </Link>
                </Callout>
                <Callout style={{ marginLeft: '0.5rem' }}>
                    <Link to="/register/client">
                        <Button fill={true} id="submit-input">Register as Client</Button>
                    </Link>
                </Callout>
            </div>
        </>
    );
}

export default wrapper(Login);