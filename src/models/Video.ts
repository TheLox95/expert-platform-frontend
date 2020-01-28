export interface Video {
    id: number;
    name: string;
    hash: string;
    sha256: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    thumbnail: string;
    provider: string;
    provider_metadata?: any;
    created_at: Date;
    updated_at: Date;
}