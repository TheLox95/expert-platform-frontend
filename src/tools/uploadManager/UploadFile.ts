import { HttpInstance } from "requests"

const uploadFile = (http: HttpInstance<unknown>, file: File, onProgress: (v: number) => void) => {
    const data = new FormData()
    data.append('files', file)

    return () => {
        return http({
            disableGLobal: true,
            url: `${process.env.REACT_APP_BACKEND_URL}/upload`,
            method: 'post',
            data,
            onUploadProgress: function(progressEvent: {loaded: number, total: number} ) {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                onProgress(percentCompleted)
            },
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .catch(() => {
            onProgress(-1)
            throw file;
        })
    }
}

export default uploadFile;