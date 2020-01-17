import React from 'react';
import { Link } from "react-router-dom";
import { GlobalProps, wrapper } from "state";
import { Text, Button, Classes } from "@blueprintjs/core";

const obj = {
    LoginButton: (props: GlobalProps) => {
        const { useGlobalState, requests } = props;
        const [ user ] = useGlobalState('user');

        return (
            <>
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