import React, { useEffect } from 'react';
import { Toaster, Toast, Position, Intent } from "@blueprintjs/core";
import { Route, useLocation } from "react-router-dom";
import { ProtectedRoutes, wrapper, WrappedComponent } from "state";
import OfferingsDirectory from 'pages/offering/offerings-directory.page';
import Profile from 'pages/experts/profile.page';
import Login from 'pages/login.page';
import Home from 'pages/home.page';
import Dashboard from 'pages/experts/dashboard.page';
import Register from 'pages/register.page';
import Offering from 'pages/offering/Offering.page';

const Main: WrappedComponent = (props) => {
    const { useGlobalState } = props;
    const [ error, updateError ] = useGlobalState("error");
    const [ success, updateSuccess ] = useGlobalState("success");
    const [ , update ] = useGlobalState('results');
    let location = useLocation()

    useEffect(() => {
        if (location.pathname !== '/search') {
            update( null )
        }
    },[location, update])

    return (
        <main style={{ height: '100%', padding: '2rem', flex: 1 }} className="flex-item">
            { error && (
                <Toaster position={Position.TOP}>
                    {/* "Toasted!" will appear here after clicking button. */}
                    <Toast message={error} intent={Intent.DANGER} onDismiss={() => updateError(null)}/>
                </Toaster>
            )}
            { success && (
                <Toaster position={Position.TOP}>
                    {/* "Toasted!" will appear here after clicking button. */}
                    <Toast message={success} intent={Intent.SUCCESS} onDismiss={() => updateSuccess(null)}/>
                </Toaster>
            )}
            <Route exact path="/" component={Home} />
            <Route exact path="/search" component={OfferingsDirectory} />
            <Route exact path="/profile/:id" component={Profile} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/offering/:id" component={Offering} />
            <Route exact path="/register/expert">
                <Register userType="expert"/>
            </Route>
            <Route exact path="/register/client">
                <Register userType="client"/>
            </Route>
            <ProtectedRoutes>
                <Route exact path="/dashboard" component={Dashboard} />
            </ProtectedRoutes>
        </main>
    );
}

export default wrapper(Main);