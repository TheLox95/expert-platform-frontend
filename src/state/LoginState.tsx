import React from 'react';
import { Link } from "react-router-dom";
import { GlobalProps, wrapper, WrappedComponent } from "state";
import { Text, Button, Classes, Popover, Colors, Tag } from "@blueprintjs/core";
import NotificationList from 'components/app/notificationList';

const obj: { LoginButton: WrappedComponent } = {
    LoginButton: ({ useGlobalState, requests, i18n }) => {
        const [user] = useGlobalState('user');
        const [notifications] = useGlobalState('notifications');

        const TagComponent: (props: { notifications: { wasRead: boolean }[] }) => JSX.Element = ({ notifications }) => {
            const readedNotifications = notifications.filter(n => n.wasRead === false)
            const style = { backgroundColor: readedNotifications.length === 0 ? Colors.GRAY2 : Colors.BLUE2 }
            return (
                <Tag id="header-notifications" icon='notifications' interactive={true} style={style}>
                    {readedNotifications.length === 0 ? '' : readedNotifications.length}
                </Tag>
            );
        };

        return (
            <>
                {user?.role.type !== 'client' ? null : (
                    <Popover content={<NotificationList notifications={notifications} />} target={<TagComponent notifications={notifications} />} />
                )}

                {user?.role.type !== 'expert' ? null : (
                    <Link to="/dashboard" >
                        <Button id="header-dashboard" className={Classes.MINIMAL} icon="dashboard" text={i18n.t('header-dashboard')} />
                    </Link>
                )}

                <Text>Hi {user?.username}!</Text>
                <Button
                    id="header-logout"
                    className={Classes.MINIMAL}
                    icon="log-out"
                    text={i18n.t('header-logout')}
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