import React, { Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { wrapper, WrappedComponent } from 'state';

const Protect: WrappedComponent = (props) => {
    const { useGlobalState, children } = props;
    const [ user ] = useGlobalState('user');

    return (
    <Fragment>
        { user ? children : <Redirect to={'/login'} /> }
    </Fragment>)
}

export default wrapper(Protect)