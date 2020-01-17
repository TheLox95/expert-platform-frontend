import React, { useState, useEffect } from 'react';
import { wrapper, WrappedComponent } from "state";
import { ProgressBar, Intent, Text } from "@blueprintjs/core";

const Progress: WrappedComponent<{ manager: any, file: File }> = (props) => {
    const { manager, file } = props;
    const [ progress, updateProgress ] = useState(0)

    useEffect(() => {
        manager.getHttp(file, (v: number) => updateProgress(v))
    }, []);

    let intent: Intent = Intent.PRIMARY

    if (progress === 100) {
        intent = Intent.SUCCESS
    }

    if (progress === -1) {
        intent = Intent.DANGER
    }

    return (
        <>
            <ProgressBar intent={intent} value={progress === -1 ? 100 : progress / 100} animate={progress !== 100 && progress !== -1}></ProgressBar>
            <Text>{file.name}</Text>
        </>
    );
}

export default wrapper(Progress)