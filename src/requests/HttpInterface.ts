import { AxiosInstance } from "axios";
import AllInterface from "./AllInterface";

export default interface HttpInterface extends AxiosInstance {
    All: AllInterface;
}