import React, { useEffect, useState } from 'react';
import Progress from './Progres';
import { wrapper, WrappedComponent } from 'state';
import { AxiosPromise } from 'axios';
import { HttpInstance, AllInterface } from 'state/http';
import resolveAll from 'promise.allsettled';

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
        })
        .catch((err) => {
            onProgress(-1)
            throw err;
        })
    }
}


class UploadManager {
    hasStarted = false
    uploadedFiles: Array<{ id: number}> = [];
    instances: Array<() => AxiosPromise> = [];

    constructor(public all: AllInterface, public http: HttpInstance,) {}

    getHttp(file: File, onProgress: (v: number) => void) {
        const i = uploadFile(this.http, file, onProgress);
        this.instances.push(i)
        return this;
    }

    start(onUploadedFiles: (value: {id:number}[]) => void) {
        if (this.hasStarted === false) {
            this.hasStarted = true
            return resolveAll(this.instances.map(i => i()))
            .then((results) => {
                results.forEach(promiseResult => {
                    if (promiseResult.status === 'fulfilled') {
                        this.uploadedFiles = [ ...this.uploadedFiles, ...promiseResult.value.data]
                        onUploadedFiles(this.uploadedFiles)
                    }
                });
                this.hasStarted = false;
            })
        }
    }

    clear() {
        return this.all(this.uploadedFiles.map(file => this.http({ url: `http://localhost:1337/upload/files/${file.id}`, method: 'delete'})))
        .then((r) => {
            this.uploadedFiles = [];
        })
    }
}

const Manager: WrappedComponent<{ files: File[], wasSend: () => boolean, onUploadedFiles: (uploaded: {}[]) => void }> = (props) => {
    const { files, wasSend, All, http, onUploadedFiles } = props;
    const [ managerInstance ] = useState<UploadManager>(new UploadManager(All, http));

    useEffect(() => {
        if (files.length !== 0) {
            managerInstance.start(onUploadedFiles);
        }
    }, [files.length]);

    useEffect(() => {
        return () => {
            if (wasSend() === false) {
                managerInstance.clear()
            } 
        }
    }, []);
    return (
        <>
            {files.map(f => {
                return <Progress key={f.name} manager={managerInstance} file={f} />
            })}
        </>
    );
}

export default wrapper(Manager);