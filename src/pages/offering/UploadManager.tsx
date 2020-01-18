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
            throw file;
        })
    }
}


class UploadManager {
    hasStarted = false
    uploadedFiles: Array<{ id: number, name: string, wasUploaded?: boolean }> = [];
    instances: Array<() => AxiosPromise> = [];

    constructor(public all: AllInterface, public http: HttpInstance, public onDelete: (file: File) => void) {}

    getFile(name: string) {
        return this.uploadedFiles.find(f => f.name === name)
    }

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
                    } else {
                        if (promiseResult.reason instanceof File) {
                            this.uploadedFiles = [ ...this.uploadedFiles, {name: promiseResult.reason.name, id: promiseResult.reason.size, wasUploaded: false}]
                        }
                    }
                });
                this.instances = [];
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

    delete(file: File) {
        const fileToDelete = this.getFile(file.name);
        if (fileToDelete) {
            this.onDelete(file)
            this.uploadedFiles = this.uploadedFiles.filter(f => f.name !== fileToDelete.name);
        }
        if (fileToDelete && fileToDelete.wasUploaded !== false) {
            this.http({ url: `http://localhost:1337/upload/files/${fileToDelete.id}`, method: 'delete'})
            .then(() => {
                this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== fileToDelete.id);
            })
        }
    }
}

const Manager: WrappedComponent<{ files: File[], wasSend: string, onDelete: (file: File) => void ,onUploadedFiles: (uploaded: {}[]) => void }> = (props) => {
    const { files, wasSend, All, http, onUploadedFiles, onDelete } = props;
    const [ managerInstance ] = useState<UploadManager>(new UploadManager(All, http, onDelete));

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