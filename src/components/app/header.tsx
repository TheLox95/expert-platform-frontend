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

const Header: WrappedComponent = ({ useGlobalState, http, requests }) => {
    const [ , update ] = useGlobalState('results');
    const [ searchTerm, updateSearch ] = useGlobalState('searchTerm');

    const send = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        http({url: `http://localhost:1337/offerings?name_contains=${searchTerm}`, method: 'get' }).then(r => {
            update(r.data as Offering[])
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
                    <Button className={Classes.MINIMAL} icon="home" text="Home" />
                </Link>
                <Link to="/search" >
                    <Button className={Classes.MINIMAL} icon="document" text="Search" />
                </Link>
                <SessionFactory component={'LoginButton'} />
            </NavbarGroup>
        </Navbar>
    );
}

export default wrapper(Header)