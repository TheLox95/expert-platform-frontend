import React, { useState, useEffect } from 'react';
import { wrapper, WrappedComponent } from "state";
import { ProgressBar, Intent, Text } from "@blueprintjs/core";

const Progress: WrappedComponent<{ manager: any, file: File }> = (props) => {
    const { manager, file } = props;
    const [ progress, updateProgress ] = useState(0)

    useEffect(() => {
        manager.getHttp(file, (v: number) => updateProgress(v))
    }, []);

    return (
        <>
            <ProgressBar intent={progress === 100 ? Intent.SUCCESS: Intent.PRIMARY} value={progress / 100} animate={progress !== 100}></ProgressBar>
            <Text>{file.name}</Text>
        </>
    );
}

export default wrapper(Progress)