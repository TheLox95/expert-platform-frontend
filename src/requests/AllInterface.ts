import { AxiosPromise, AxiosResponse } from "axios";

export default interface AllInterface {
    (promises: AxiosPromise[], config?: { disableGLobal: boolean }): Promise<AxiosResponse<any>[]>
    (promises: Promise<any>[], config?: { disableGLobal: boolean }): Promise<any[]>
  }
  