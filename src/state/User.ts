import axios from "axios"
import { GlobalProps } from "./wrapper"
import { Offering, Opinion } from "models"

export default (p: GlobalProps) => ({
    getUser: (id: number) => {
        p.All([
            p.http({ method: 'get', url: `http://localhost:1337/users/${id}` }).then(r => r.data),
            p.http({ method: 'get', url: `http://localhost:1337/offerings?_sort=created_at:desc` }).then(r => r.data),
            p.http({ method: 'get', url: `http://localhost:1337/opinions` }).then(r => r.data),
        ])
        .then(axios.spread((user, offerings, opinions) => {
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
            console.log(user)
            p.dispatch({ type: 'user', payload: user })
        }))
    }
})