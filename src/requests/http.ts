import axios, { AxiosRequestConfig } from "axios"

export type HttpFun = <A>(config: AxiosRequestConfig & { disableGlobal?: boolean }) => Promise<A>

export default (setLoading: (val: boolean) => void, setError: (val: string) => void) => {

    return <A>(config: AxiosRequestConfig & { disableGlobal?: boolean }) => {
        if (config.disableGlobal !== true) {
            setLoading(true)
        }

        const authHeader = localStorage.getItem('token') !== null ? {Authorization: `Bearer ${localStorage.getItem('token')}`} : {}


        return axios({
            ...config,
            headers: {
              ...config.headers,
              ...authHeader
            }
          })
        .then(r => {
            if (config.disableGlobal !== true) {
                setLoading(false)
            }
            return r.data as A;
        })
        .catch(error => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
                setError(JSON.stringify(error.response.data))
                if (config.disableGlobal !== true) {
                    setLoading(false)
                }

            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);                
                setError("No response recieved")
                if (config.disableGlobal !== true) {
                    setLoading(false)
                }
            } else {
                // Something happened in setting up the request that triggered an Error
                setError(error.message )
                if (config.disableGlobal !== true) {
                    setLoading(false)
                }
                console.log('Error', error.message);
            } 
            throw error
        })
    }

}