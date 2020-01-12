import { Photo } from './Photo'
import { Video } from './Video'

export interface User {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    role: number;
    aboutme: string;
    created_at: Date;
    updated_at: Date;
    photos: Photo[];
    videos: Video[];
}