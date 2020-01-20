import axios from "axios"
import { GlobalProps } from "./wrapper"
import { Offering, Opinion, Photo, Video, User } from "models"

export default (p: GlobalProps) => ({
    logout: () => {
        p.dispatch({ type: 'logout' })
    },
    getUser: () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return p.All([
            p.http({ method: 'get', url: `http://localhost:1337/users/${user.id}` }).then(r => r.data),
            p.http({ method: 'get', url: `http://localhost:1337/offerings?_sort=created_at:desc` }).then(r => r.data),
            p.http({ method: 'get', url: `http://localhost:1337/opinions` }).then(r => r.data),
        ])
        .then(axios.spread((user, offerings, opinions) => {
            offerings = offerings.map((o: Offering) => {
                o.photos = o.photos.filter((p: Photo) => p.hasOwnProperty('id'))
                o.videos = o.videos.filter((v: Video) => v.hasOwnProperty('id'))
                return o;
            })

            offerings = (offerings as Offering[]).map((offering: Offering) => {
                offering.opinions = offering.opinions.map(originalOpinion => {
                    return (opinions as Opinion[]).filter((fullOpiniion: Opinion) => {
                        if (typeof fullOpiniion.user === 'object') {
                            return fullOpiniion.user.id === originalOpinion.user
                        }
                        return null;
                    })
                }).flat()
                return offering;
            })
            user = {
                ...user,
                offerings
            }
            p.dispatch({ type: 'user', payload: user })
        }))
    }
})