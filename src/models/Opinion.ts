import { User } from "./User";

export interface Opinion {
    id: number;
    description: string;
    score: number;
    user: number | User;
    created_at: Date;
    updated_at: Date;
}