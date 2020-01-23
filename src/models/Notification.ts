import { Offering } from "./Offering";

export interface Notification {
    id: number;
    wasRead: boolean;
    offering: Offering;
}