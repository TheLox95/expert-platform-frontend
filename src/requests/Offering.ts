import { GlobalProps } from "state/wrapper"
import { User, Offering } from 'models'

export default (p: GlobalProps) => ({
    get: (id: number) => {
        return p.http({
            method: 'GET',
            url: `http://localhost:1337/offerings/${id}`,
        }).then(r => r.data)

    },
    create: (title: string, description: string, user: User, uploadedPhotos: any[], uploadedVideos: any[]) => {
        return p.http({
            method: 'POST',
            url: 'http://localhost:1337/offerings',
            data: {
                name: title,
                description,
                user: user?.id,
                photos: uploadedPhotos.map(f => f.id),
                videos: uploadedVideos.map(f => f.id)
            }
        }).then(r => {
            p.requests.user.getUser()
            p.dispatch({ type: 'success', payload: `Offering ${title} was created!`})
            return r.data
        })
    },
    update: (title: string, description: string, user: User, uploadedPhotos: any[], uploadedVideos: any[], offering: Offering) => {
        return p.http({
            method: 'PUT',
            url: `http://localhost:1337/offerings/${offering.id}`,
            data: {
                name: title,
                description,
                user: user?.id,
                photos: [ ...uploadedPhotos.map(f => f.id), ...offering.photos.map(p => p.id) ],
                videos: [ ...uploadedVideos.map(f => f.id), ...offering.videos.map(p => p.id) ],
            }
        })
        .then(() => {
            p.requests.user.getUser()
            p.dispatch({ type: 'success', payload: `Offering ${title} was updated!`})
        });
    },
    delete: (offering: Offering) => {
        return p.http({ method: 'delete', url: `http://localhost:1337/offerings/${offering.id}` })
        .then(r => {
            p.requests.user.getUser()
            p.dispatch({ type: 'success', payload: `Offering ${offering.name} deleted!`})
            return r.data;
        })
    }
})