import React, { useState, useEffect } from 'react';
import { wrapper, WrappedComponent } from "state";
import { ProgressBar, Intent, Text, Callout, Icon } from "@blueprintjs/core";

const Progress: WrappedComponent<{ manager: any, file: File }> = (props) => {
    const { manager, file } = props;
    const [ progress, updateProgress ] = useState(0)
    const [ isHovering, updateHovering ] = useState(false)

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
        <Callout className="file-upload-progress" style={{ display: 'flex', justifyContent: 'space-between'}}>
            <div style={{ flex: '1'}}>
                <ProgressBar intent={intent} value={progress === -1 ? 100 : progress / 100} animate={progress !== 100 && progress !== -1}></ProgressBar>
                <Text>{file.name}</Text>
            </div>
            <div style={{ marginLeft: '0.5rem'}}>
                <Icon
                    style={{ cursor: 'pointer' }}
                    icon='delete'
                    color={isHovering ? 'red': ''}
                    onMouseEnter={() => updateHovering(true)}
                    onMouseLeave={() => updateHovering(false)}
                    onClick={() => manager.delete(file)}
                />
            </div>
        </Callout>
    );
}

export default wrapper(Progress)