import { Video } from './Video'
import { Photo } from './Photo'
import { User } from './User'
import { Opinion } from './Opinion'

export interface Offering {
    id: number;
    name: string;
    description: string;
    user: User;
    created_at: Date;
    updated_at: Date;
    photos: Photo[];
    videos: Video[];
    opinions: Opinion[];
}