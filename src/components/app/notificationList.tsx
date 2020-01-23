import React, { useEffect } from 'react';
import { Notification } from "models";
import { Text, Card } from "@blueprintjs/core";
import { Link } from 'react-router-dom';
import { WrappedComponent, wrapper } from 'state';

const NotificationList: WrappedComponent<{ notifications: Notification[]}> = ({ notifications, requests }) => {

    useEffect(() => {
        const nonReadNotifications = notifications.filter(n => n.wasRead !== true)

        requests.notification.readed(nonReadNotifications);

    }, []);

    return (
        <>
            {notifications.map(n => {
                return (
                    <Card>
                        <Link key={n.id} to={`/offering/${n.offering.id}`}>
                            <Text>{n.offering.name}</Text>
                        </Link>
                    </Card>
                );
            })}
        </>
    );
}

export default wrapper(NotificationList);
