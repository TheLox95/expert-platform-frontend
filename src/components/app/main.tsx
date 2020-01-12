import React, { useEffect } from 'react';
import { Toaster, Toast, Position, Intent } from "@blueprintjs/core";
import { Route, useLocation } from "react-router-dom";
import { useGlobalState, ProtectedRoute, wrapper, WrappedComponent } from "state";
import OfferingsDirectory from 'pages/offering/offerings-directory.page';
import Profile from 'pages/experts/profile.page';
import Login from 'pages/login.page';
import Home from 'pages/home.page';
import Dashboard from 'pages/experts/dashboard.page';

const Main: WrappedComponent = () => {
    const [ error, updateError ] = useGlobalState("error");
    const [ , update ] = useGlobalState('results');
    let location = useLocation()

    useEffect(() => {
        if (location.pathname !== '/search') {
            update( null )
        }
    },[location, update])

    return (
        <main style={{ height: '100%', padding: '2rem' }}>
            { error && (
                <Toaster position={Position.TOP}>
                    {/* "Toasted!" will appear here after clicking button. */}
                    <Toast message={error} intent={Intent.DANGER} onDismiss={() => updateError(null)}/>
                </Toaster>
            )}
            <Route exact path="/" component={Home} />
            <Route exact path="/search" component={OfferingsDirectory} />
            <Route exact path="/profile/:id" component={Profile} />
            <Route exact path="/login" component={Login} />
            <ProtectedRoute>
                <Route exact path="/dashboard" component={Dashboard} />
            </ProtectedRoute>
        </main>
    );
}

export default wrapper(Main);