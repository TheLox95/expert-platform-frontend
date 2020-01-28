import { AxiosPromise } from "axios";
import resolveAll from 'promise.allsettled';
import uploadFile from "./UploadFile";
import { AllInterface, HttpInstance } from "requests";

export default class UploadManager {
    hasStarted = false
    uploadedFiles: Array<{ id: number, name: string, wasUploaded?: boolean }> = [];
    instances: Array<() => AxiosPromise> = [];

    constructor(public all: AllInterface, public http: HttpInstance<unknown>, public onDelete: (file: File) => void) {}

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
        return this.all(this.uploadedFiles.map(file => this.http({ url: `${process.env.REACT_APP_BACKEND_URL}/offerings/files/${file.id}`, method: 'delete'})))
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
            this.http({ url: `${process.env.REACT_APP_BACKEND_URL}/offerings/files/${fileToDelete.id}`, method: 'delete'})
            .then(() => {
                this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== fileToDelete.id);
            })
        }
    }
}