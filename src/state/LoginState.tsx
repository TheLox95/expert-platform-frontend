import React from 'react';
import { Link } from "react-router-dom";
import { GlobalProps, wrapper } from "state";
import { Text, Button, Classes } from "@blueprintjs/core";

const obj = {
    LoginButton: (props: GlobalProps) => {
        const { useGlobalState } = props;
        const [ user ] = useGlobalState('user');

        return (
            <>
                <Link to="/dashboard" >
                    <Button className={Classes.MINIMAL} icon="dashboard" text="Dashboard" />
                </Link>
                <Text>Hi {user?.username}!</Text>
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