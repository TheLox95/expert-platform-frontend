import { Photo } from './Photo'
import { Video } from './Video'
import { Offering } from './Offering'

export interface User {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    role: {
        id: number,
        name: string,
        description: string,
        type: string
    };
    aboutme: string;
    created_at: Date;
    updated_at: Date;
    photos: Photo[];
    videos: Video[];
    offerings: Offering[]
}