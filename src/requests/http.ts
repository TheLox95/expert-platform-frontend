import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance, AxiosPromise } from 'axios';
import HttpInstance from './HttpInstance';
import AllInterface from './AllInterface';

let instance: ( (config: AxiosRequestConfig & { disableGLobal?: boolean }) => AxiosPromise ) | null = null

export default <P>(updateLoading: unknown, updateError: unknown): { instance: HttpInstance<P>, All: AllInterface } => {
  const responseInterceptor = (response: AxiosResponse) => {
    if ((response.config as AxiosRequestConfig & { disableGLobal?: boolean }).disableGLobal && (response.config as AxiosRequestConfig & { disableGLobal?: boolean }).disableGLobal === true) {
      return response;
    }
    if (typeof updateLoading === 'function') {
      updateLoading(false)
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
        console.log(error.response);
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
  
  const requestInterceptor = (config: AxiosRequestConfig & { disableGLobal?: boolean }) => {
    if (config.disableGLobal && config.disableGLobal === true) {
      return config;
    }
    if (typeof updateLoading === 'function') {
      updateLoading(true)
    }
    // Do something before request is sent
    return config;
  }

  const All: AllInterface = (requests: Promise<any>[], config?: { disableGLobal: boolean }) => {
    let disabled = false;
    if (config && config.disableGLobal && config.disableGLobal === true) {
      disabled = true;
    }
    if (typeof updateLoading === 'function' && disabled === false) {
      updateLoading(true)
    }
    return axios.all(requests)
    .then((r) => {
      if (typeof updateLoading === 'function' && disabled === false) {
        updateLoading(false)
      }
      return r;
    });
  }

  if (instance === null) {
    instance = (config: AxiosRequestConfig) => {
      const authHeader = localStorage.getItem('token') !== null ? {Authorization: `Bearer ${localStorage.getItem('token')}`} : {}

      return axios({
        ...config,
        headers: {
          ...config.headers,
          ...authHeader
        }
      })
    };
    axios.interceptors.request.use(requestInterceptor)
    axios.interceptors.response.use(responseInterceptor, errorInterceptor)
    return { instance, All };
  } else {
    return { instance, All };
  }
}

