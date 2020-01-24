import React from 'react';
import { Link } from "react-router-dom";
import { wrapper, WrappedComponent } from "state";
import { Button, Classes } from "@blueprintjs/core";

const obj: {LoginButton: WrappedComponent} = {
    LoginButton: ({ i18n }) => {
        return <Link to="/login">
            <Button className={Classes.MINIMAL} icon="document" text={i18n.t('header-login')} />
        </Link>
    }
}

export default (name: string): React.SFC => {
    if (name === "LoginButton") {
        return wrapper(obj.LoginButton)
    }
    return wrapper(obj.LoginButton)
}