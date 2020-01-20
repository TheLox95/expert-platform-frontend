import { GlobalProps } from "./wrapper"
import { User, Offering } from 'models'

export default (p: GlobalProps) => ({
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
    delete: (id: number) => {
        return p.http({ method: 'delete', url: `http://localhost:1337/offerings/${id}` })
        .then(r => r.data)
    }
})