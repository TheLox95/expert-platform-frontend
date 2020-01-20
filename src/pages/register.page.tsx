import React, { useState, useEffect } from 'react';
import { useForm, ErrorMessage } from 'react-hook-form'
import * as Yup from 'yup';
import { wrapper, WrappedComponent } from 'state'
import { Overlay, Classes, Intent, Button, FormGroup } from "@blueprintjs/core";
import UploadManager from 'tools/UploadManager';
import { Redirect } from 'react-router-dom';

const validationSchema = Yup.object({
    email: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required'),
    passwordConfirmation: Yup.string()
        .required('Password confirmation is required')
       .oneOf([Yup.ref('password'), null], 'Passwords must match')
  });

const Form: WrappedComponent<{ close: () => void }> = (props) => {
    const { useGlobalState, requests } = props;
    const { register, handleSubmit, errors } = useForm({ validationSchema })
    const [ user ] = useGlobalState('user');

    const [ status, updateStatus ] = useState<'OPENED' | 'CANCELLED' | 'SEND'>('OPENED');

    if (status === 'CANCELLED') {
        return <Redirect to={'/'} />;
    }

    if (user) {
        return <Redirect to={'/dashboard'} />;
    }

    return (
        <form onSubmit={handleSubmit(data => {
            const {
                username,
                email,
                password,
            } = data;
            requests.user.register(username,email,password, 'expert')
        })}>
            <h3>Register</h3>

            <div className="bp3-form-group">
                <label className="bp3-label" htmlFor="username-input">Username</label>
                <div className="bp3-input-group">
                <input type="text" className={`${errors.username ? 'bp3-intent-danger': 'bp3-intent-none'} bp3-input`} id="username-input" name='username' placeholder="Username" ref={register({ required: true })}/>
                </div>
                <div className="bp3-form-helper-text">
                    <ErrorMessage errors={errors} name="username" />
                </div>
            </div>

            <div className="bp3-form-group">
                <label className="bp3-label" htmlFor="email-input">Email</label>
                <div className="bp3-input-group">
                <input type="text" className={`${errors.email ? 'bp3-intent-danger': 'bp3-intent-none'} bp3-input`} id="email-input" name='email' placeholder="Email" ref={register({ required: true })}/>
                </div>
                <div className="bp3-form-helper-text">
                    <ErrorMessage errors={errors} name="email" />
                </div>
            </div>

            <div className="bp3-form-group">
                <label className="bp3-label" htmlFor="password-input">Password</label>
                <div className="bp3-input-group">
                <input type="password" className={`${errors.password ? 'bp3-intent-danger': 'bp3-intent-none'} bp3-input`} id={'password-input'} name='password' placeholder="Password" ref={register({ required: true })}/>
                </div>
                <div className="bp3-form-helper-text">
                    <ErrorMessage errors={errors} name="password" />
                </div>
            </div>

            <div className="bp3-form-group">
                <label className="bp3-label" htmlFor="password-confirmation-input">Repeat Password</label>
                <div className="bp3-input-group">
                <input type="password" className={`${errors.passwordConfirmation ? 'bp3-intent-danger': 'bp3-intent-none'} bp3-input`} id={'password-confirmation-input'} name='passwordConfirmation' placeholder="Repeat Password" ref={register({ required: true })}/>
                </div>
                <div className="bp3-form-helper-text">
                    <ErrorMessage errors={errors} name="passwordConfirmation" />
                </div>
            </div>

            <br />
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button intent={Intent.DANGER} onClick={() => updateStatus('CANCELLED')} style={{ margin: "" }}>
                    Go back
                </Button>
                <Button type='submit' style={{ margin: "" }}>
                    Submit
                </Button>
            </div>
        </form>
    );
}

export default wrapper(Form)