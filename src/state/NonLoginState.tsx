import React from 'react';
import { Link } from "react-router-dom";
import { wrapper } from "state";
import { Button, Classes } from "@blueprintjs/core";

const obj = {
    LoginButton: () => {
        return <Link to="/login">
            <Button className={Classes.MINIMAL} icon="document" text="Login" />
        </Link>
    }
}

export default (name: string): React.SFC => {
    if (name === "LoginButton") {
        return wrapper(obj.LoginButton)
    }
    return wrapper(obj.LoginButton)
}