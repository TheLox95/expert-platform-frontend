import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance, AxiosPromise } from 'axios';

let options = {}
let instance: AxiosInstance | null = null

if (localStorage.getItem('token') !== null) {
  options = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }
}

export interface HttpInstance<T = {}> {
  (config: AxiosRequestConfig & { disableGLobal?: boolean }): AxiosPromise<T>
}

export interface AllInterface {
  (config: AxiosPromise[]): Promise<AxiosResponse<any>[]>
}

export interface HttpInterface extends AxiosInstance {
  All: AllInterface;
}

export default <P>(updateLoading: unknown, updateError: unknown): { instance: HttpInstance<P>, All: AllInterface } => {
  const responseInterceptor = (response: AxiosResponse) => {
    if (typeof updateLoading === 'function') {
      updateLoading(() => false)
    }
    // Do something with response data
    return response;
  };
  
  const errorInterceptor = (error: any) => {
    if (axios.isCancel(error)) {
      if (typeof updateLoading === 'function') {
        updateLoading(false)
      }
    } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        if (typeof updateError === 'function') {
          updateError(JSON.stringify(error.response.data))
        }
        
        if (typeof updateLoading === 'function') {
          updateLoading(false)
        }
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
        
        if (typeof updateError === 'function') {
          updateError("No response recieved")
        }
        if (typeof updateLoading === 'function') {
          updateLoading(false)
        }
    } else {
        // Something happened in setting up the request that triggered an Error
        if (typeof updateError === 'function') {
          updateError(error.message )
        }
        
        if (typeof updateLoading === 'function') {
          updateLoading(false)
        }
        console.log('Error', error.message);
    } 
    // Do something with response error
    return Promise.reject(error);
  }
  
  const requestInterceptor = (config: AxiosRequestConfig) => {
    if (typeof updateLoading === 'function') {
      updateLoading(true)
    }
    // Do something before request is sent
    return config;
  }

  const All: AllInterface = (requests) => {
    if (typeof updateLoading === 'function') {
      updateLoading(true)
    }
    return axios.all(requests)
    .then((r) => {
      if (typeof updateLoading === 'function') {
        updateLoading(false)
      }
      return r;
    });
  }

  if (instance === null) {
    instance = axios.create(options);
    instance.interceptors.request.use(requestInterceptor)
    instance.interceptors.response.use(responseInterceptor, errorInterceptor)
    return { instance, All };
  } else {
    return { instance, All };
  }
}

