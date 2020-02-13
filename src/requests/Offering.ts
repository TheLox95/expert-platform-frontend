import { GlobalProps } from "state/wrapper"
import { User, Offering } from 'models'

export default (p: GlobalProps) => ({
    get: (id: number) => {
        return p.http({
            method: 'GET',
            url: `${process.env.REACT_APP_BACKEND_URL}/offerings/${id}`,
        }).then(r => r.data)

    },
    create: (title: string, description: string, user: User, uploadedPhotos: any[], uploadedVideos: any[]) => {
        return p.http({
            method: 'POST',
            url: `${process.env.REACT_APP_BACKEND_URL}/offerings`,
            data: {
                name: title,
                description,
                user: user?.id,
                photos: uploadedPhotos.map(f => f.id),
                videos: uploadedVideos.map(f => f.id)
            }
        }).then(r => {
            p.requests.user.refreshUser()
            p.dispatch({ type: 'success', payload: `Offering ${title} was created!`})
            return r.data
        })
    },
    update: (title: string, description: string, user: User, uploadedPhotos: any[], uploadedVideos: any[], offering: Offering) => {
        return p.http({
            method: 'PUT',
            url: `${process.env.REACT_APP_BACKEND_URL}/offerings/${offering.id}`,
            data: {
                name: title,
                description,
                user: user?.id,
                photos: [ ...uploadedPhotos.map(f => f.id), ...offering.photos.map(p => p.id) ],
                videos: [ ...uploadedVideos.map(f => f.id), ...offering.videos.map(p => p.id) ],
            }
        })
        .then(() => {
            p.requests.user.refreshUser()
            p.dispatch({ type: 'success', payload: `Offering ${title} was updated!`})
        });
    },
    delete: (offering: Offering) => {
        return p.http({ method: 'delete', url: `${process.env.REACT_APP_BACKEND_URL}/offerings/${offering.id}` })
        .then(r => {
            p.requests.user.refreshUser()
            p.dispatch({ type: 'success', payload: `Offering ${offering.name} deleted!`})
            return r.data;
        })
    }
})