import React, { useEffect, useState } from 'react';
import Progress from '../../pages/offering/Progres';
import { wrapper, WrappedComponent } from 'state';
import UploadManager from './Manager';

const Manager: WrappedComponent<{ files: File[], wasSend: string, onDelete: (file: File) => void ,onUploadedFiles: (uploaded: {}[]) => void }> = (props) => {
    const { files, wasSend, http, onUploadedFiles, onDelete } = props;
    const [ managerInstance ] = useState(new UploadManager(http, onDelete));

    useEffect(() => {
        if (files.length !== 0) {
            managerInstance.start(onUploadedFiles);
        }
    }, [files.length]);

    useEffect(() => {
        if (wasSend === 'CANCELLED') {
            managerInstance.clear()
        } 
    }, [wasSend]);
    return (
        <>
            {files.map(f => {
                return <Progress key={f.name} manager={managerInstance} file={f} />
            })}
        </>
    );
}

export default wrapper(Manager);