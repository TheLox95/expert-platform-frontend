import React from 'react';
import { Link } from "react-router-dom";
import { GlobalProps, wrapper } from "state";
import { Text, Button, Classes, Popover, Colors, Tag } from "@blueprintjs/core";
import NotificationList from 'components/app/notificationList';

const obj = {
    LoginButton: (props: GlobalProps) => {
        const { useGlobalState, requests } = props;
        const [ user ] = useGlobalState('user');
        const [ notifications ] = useGlobalState('notifications');

        const TagComponent: (props: {notifications: { wasRead: boolean }[] }) => JSX.Element = ({notifications }) => {
            const readedNotifications = notifications.filter(n => n.wasRead === false )
            const style = { backgroundColor: readedNotifications.length === 0 ? Colors.GRAY2: Colors.BLUE2 }
            return (
                <Tag icon='notifications' interactive={true} style={style}>
                    {readedNotifications.length === 0 ? '' : readedNotifications.length}
                </Tag>
            );
        };

        return (
            <>
                <Popover content={<NotificationList notifications={notifications}/>} target={<TagComponent notifications={notifications}/>} />

                <Link to="/dashboard" >
                    <Button className={Classes.MINIMAL} icon="dashboard" text="Dashboard" />
                </Link>
                <Text>Hi {user?.username}!</Text>
                <Button
                    className={Classes.MINIMAL}
                    icon="log-out"
                    text="Logout"
                    onClick={() => requests.user.logout()}
                />
            </>
        );
    }
}

export default (name: string): React.SFC<GlobalProps> => {
    if (name === "LoginButton") {
        return wrapper(obj.LoginButton)
    }
    return wrapper(obj.LoginButton)
}