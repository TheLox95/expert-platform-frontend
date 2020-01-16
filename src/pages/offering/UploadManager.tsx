import React, { useEffect } from 'react';
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
        }
    }
}

let manager: UploadManager | null = null
let uploadedFiles: Array<any> = []

const Manager: WrappedComponent<{ files: File[], wasSend: boolean, onUploadedFiles: (uploaded: {}[]) => void }> = (props) => {
    const { files, wasSend, All, http, onUploadedFiles } = props;

    if (!manager) {
        manager = new UploadManager(All);
    }

    useEffect(() => {
        if (manager) {
            const waitForUpload = manager.start();
            if (waitForUpload) {
                waitForUpload.then((responses) => {
                    uploadedFiles = [ ...uploadedFiles, ...responses.map((r) => r.data).flat()]
                    onUploadedFiles(uploadedFiles)
                    manager = new UploadManager(All)
                })
            }
        }
    }, [files]);

    useEffect(() => {
        return () => {
            if (wasSend === false) {
                All(uploadedFiles.map(file => http({ url: `http://localhost:1337/upload/files/${file.id}`, method: 'delete'})))
                .then((r) => {
                    console.log(r)
                    console.log('Form was not send and files were deleted from backedn')
                    uploadedFiles = [];
                })
            } 
        }
    }, []);
    return (
        <>
            {files.map(f => {
                return <Progress key={f.name} manager={manager} file={f} />
            })}
        </>
    );
}

export default wrapper(Manager);