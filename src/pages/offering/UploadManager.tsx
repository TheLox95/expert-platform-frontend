import React, { useState, useEffect } from 'react';
import Progress from './Progres';
import { wrapper, WrappedComponent } from 'state';

const Manager: WrappedComponent<{ files: File[]}> = (props) => {
    const { files } = props;
    const [ photos, updatePhotos ] = useState<File[]>([]);


    useEffect(() => {
        if (files.length !== 0) {
            if (manager) {
                const r = manager.start();
                if (r) {
                    r.then(() => {
                        manager = new Manager(All)
                        updatePhotos([])
                    })
                }
            }
        }
    });

    return (
        <>
            {files.map(f => {
                return <Progress key={f.name} manager={manager} file={f} />
            })}
        </>
    );
}

export default wrapper(Manager);