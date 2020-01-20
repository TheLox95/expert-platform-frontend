import React, { useState } from 'react';
import { Alert, IconName, Intent } from '@blueprintjs/core';

interface Props {
    message: string,
    onCance: () => void,
    onConfirm: () => Promise<unknown>
    intent?: Intent
    buttonText: string
}

const ConfirmAction: React.FunctionComponent<Props> = (props) => {
    const { message, onCance, onConfirm, intent, buttonText } = props;

    return (
        <Alert
            canEscapeKeyCancel={true}
            canOutsideClickCancel={true}
            cancelButtonText="Cancel"
            confirmButtonText={buttonText}
            icon="trash"
            intent={intent? intent : Intent.DANGER}
            isOpen={true}
            onCancel={() => onCance()}
            onConfirm={() => {onConfirm().then(() => onCance())}}
        >
            <p>{message}</p>
        </Alert>
    );
}

export default ConfirmAction;