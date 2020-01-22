import { AxiosRequestConfig, AxiosPromise } from "axios";

export default interface HttpInstance<T = {}> {
    (config: AxiosRequestConfig & { disableGLobal?: boolean }): AxiosPromise<T>
  }