import React, { useEffect } from 'react';
import { wrapper, SessionFactory, WrappedComponent } from "state";
import {
    Alignment,
    Button,
    Classes,
    Navbar,
    NavbarGroup,
    NavbarHeading,
    InputGroup,
} from "@blueprintjs/core";

import { Link } from "react-router-dom";
import { Offering } from 'models';

const Header: WrappedComponent = ({ useGlobalState, http, requests, i18n }) => {
    const [ , update ] = useGlobalState('results');
    const [ searchTerm, updateSearch ] = useGlobalState('searchTerm');

    const send = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        http<Offering[]>({url: `${process.env.REACT_APP_BACKEND_URL}/offerings?name_contains=${searchTerm}`, method: 'get' }).then(r => {
            update(r)
            updateSearch(searchTerm)
        })
    }

    useEffect(() => {
        requests.notification.getNotifications()
        setInterval(() => {
            requests.notification.getNotifications()
        }, 10 * 1000)
    }, []);

    return (
        <Navbar id='navbar' className="flex-item">
            <NavbarGroup align={Alignment.LEFT}>
                <NavbarHeading>Platform</NavbarHeading>
                <form
                    onSubmit={send}>
                    <InputGroup type="search" leftIcon={"search"} intent={"primary"} onChange={(e: any) => updateSearch(e.target.value)} />
                </form>
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT}>
                <Link to="/">
                    <Button id="header-home" className={Classes.MINIMAL} icon="home" text={i18n.t('header-home')} />
                </Link>
                <Link to="/search" >
                    <Button id="header-search" className={Classes.MINIMAL} icon="document" text={i18n.t('header-search')} />
                </Link>
                <SessionFactory component={'LoginButton'} />
            </NavbarGroup>
        </Navbar>
    );
}

export default wrapper(Header)