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
    Tag,
    Popover,
    Colors
} from "@blueprintjs/core";

import { Link } from "react-router-dom";
import { Offering } from 'models';
import NotificationList from './notificationList';

const TagComponent: (props: {notifications: { wasRead: boolean }[] }) => JSX.Element = ({notifications }) => {
    const readedNotifications = notifications.filter(n => n.wasRead === false )
    const style = { backgroundColor: readedNotifications.length === 0 ? Colors.GRAY2: Colors.BLUE2 }
    return (
        <Tag icon='notifications' interactive={true} style={style}>
            {readedNotifications.length === 0 ? '' : readedNotifications.length}
        </Tag>
    );
};

const Header: WrappedComponent = ({ useGlobalState, http, requests }) => {
    const [ , update ] = useGlobalState('results');
    const [ notifications ] = useGlobalState('notifications');
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
                
                <Popover content={<NotificationList notifications={notifications}/>} target={<TagComponent notifications={notifications}/>} />


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