import React, { useState } from 'react';
import { useForm, ErrorMessage } from 'react-hook-form'
import * as Yup from 'yup';
import { wrapper, WrappedComponent } from 'state'
import { Classes, Intent, Button } from "@blueprintjs/core";
import { Redirect } from 'react-router-dom';

const validationSchema = Yup.object({
    email: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required'),
    passwordConfirmation: Yup.string()
        .required('Password confirmation is required')
       .oneOf([Yup.ref('password'), null], 'Passwords must match')
  });

const Form: WrappedComponent<{ userType: 'expert' | 'client' }> = (props) => {
    const { useGlobalState, requests, userType, i18n } = props;
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
        <form id="register-form" onSubmit={handleSubmit(data => {
            const {
                username,
                email,
                password,
            } = data;
            requests.user.register(username,email,password, userType)
        })}>
            <h3>{i18n.t('register')}</h3>

            <div className="bp3-form-group">
                <label className="bp3-label" htmlFor="username-input">{i18n.t('username')}</label>
                <div className="bp3-input-group">
                <input type="text" className={`${errors.username ? 'bp3-intent-danger': 'bp3-intent-none'} bp3-input`} id="username-input" name='username' placeholder={i18n.t('username')} ref={register({ required: true })}/>
                </div>
                <div className="bp3-form-helper-text">
                    <ErrorMessage errors={errors} name="username" />
                </div>
            </div>

            <div className="bp3-form-group">
                <label className="bp3-label" htmlFor="email-input">{i18n.t('email')}</label>
                <div className="bp3-input-group">
                <input type="text" className={`${errors.email ? 'bp3-intent-danger': 'bp3-intent-none'} bp3-input`} id="email-input" name='email' placeholder={i18n.t('email')} ref={register({ required: true })}/>
                </div>
                <div className="bp3-form-helper-text">
                    <ErrorMessage errors={errors} name="email" />
                </div>
            </div>

            <div className="bp3-form-group">
                <label className="bp3-label" htmlFor="password-input">{i18n.t('password')}</label>
                <div className="bp3-input-group">
                <input type="password" className={`${errors.password ? 'bp3-intent-danger': 'bp3-intent-none'} bp3-input`} id={'password-input'} name='password' placeholder={i18n.t('password')} ref={register({ required: true })}/>
                </div>
                <div className="bp3-form-helper-text">
                    <ErrorMessage errors={errors} name="password" />
                </div>
            </div>

            <div className="bp3-form-group">
                <label className="bp3-label" htmlFor="password-confirmation-input">{i18n.t('repeat-password')}</label>
                <div className="bp3-input-group">
                <input type="password" className={`${errors.passwordConfirmation ? 'bp3-intent-danger': 'bp3-intent-none'} bp3-input`} id={'password-confirmation-input'} name='passwordConfirmation' placeholder={i18n.t('repeat-password')} ref={register({ required: true })}/>
                </div>
                <div className="bp3-form-helper-text">
                    <ErrorMessage errors={errors} name="passwordConfirmation" />
                </div>
            </div>

            <br />
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button id="cancel-register-input" intent={Intent.DANGER} onClick={() => updateStatus('CANCELLED')} style={{ margin: "" }}>
                    {i18n.t('go-back')}
                </Button>
                <Button id="submit-register-input" type='submit' style={{ margin: "" }}>
                    {i18n.t('submit')}
                </Button>
            </div>
        </form>
    );
}

export default wrapper(Form)