import React from 'react';
import { Notification } from "models";
import { Text, Card } from "@blueprintjs/core";
import { Link } from 'react-router-dom';

const NotificationList: React.FunctionComponent<{ notifications: Notification[]}> = ({ notifications }) => {

    return (
        <Card>
            {notifications.map(n => {
                return (
                    <Link to={`/offering/${n.offering.id}`}>
                        <Text key={n.id}>{n.offering.name}</Text>
                    </Link>
                );
            })}
        </Card>
    );
}

export default NotificationList;
