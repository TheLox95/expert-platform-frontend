import { AxiosPromise, AxiosResponse } from "axios";

export default interface AllInterface {
    (config: AxiosPromise[]): Promise<AxiosResponse<any>[]>
    (config: Promise<any>[]): Promise<any[]>
  }
  