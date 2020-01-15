import React, { useState, useEffect } from 'react';
import Progress from './Progres';
import { wrapper, WrappedComponent } from 'state';
import { AxiosPromise } from 'axios';
import { HttpInstance, AllInterface } from 'state/http';

const uploadFile = (http: HttpInstance, file: File, onProgress: (v: number) => void) => {
    const data = new FormData()
    data.append('files', file)

    return () => {
        return http({
            disableGLobal: true,
            url: 'http://localhost:1337/upload',
            method: 'post',
            data,
            onUploadProgress: function(progressEvent ) {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                onProgress(percentCompleted)
            },
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
}


class UploadManager {
    hasStarted = false
    startCalledTimes = 0
    instances: Array<() => AxiosPromise> = [];

    constructor(public all: AllInterface) {}

    getHttp(http: HttpInstance, file: File, onProgress: (v: number) => void) {
        const i = uploadFile(http, file, onProgress);
        this.instances.push(i)
        return this;
    }

    start() {
        if (this.hasStarted === false) {
            this.hasStarted = true
            return this.all(this.instances.map(i => i()))
            .then((r) => console.log(r))
        }
    }
}

let manager: UploadManager | null = null

const Manager: WrappedComponent<{ files: File[]}> = (props) => {
    const { files, All } = props;
    // const [ photos, updatePhotos ] = useState<File[]>([]);

    useEffect(() => {
        if (files.length !== 0) {
            if (manager) {
                const r = manager.start();
                if (r) {
                    r.then(() => {
                        manager = new UploadManager(All)
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