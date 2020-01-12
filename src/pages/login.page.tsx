import React, { useState } from 'react';
import { Redirect } from 'react-router-dom'
import { wrapper, WrappedComponent } from "state";
import { FormGroup, InputGroup, Button } from "@blueprintjs/core";

const Login: WrappedComponent = (prop) => {
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
        }).then(response => {
            // Handle success.
            console.log('Well done!');
            console.log('User profile', response.data.user);
            console.log('User token', response.data.jwt);
            localStorage.setItem('token', response.data.jwt)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            updateUser(response.data.user);
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
    );
}

export default wrapper(Login);