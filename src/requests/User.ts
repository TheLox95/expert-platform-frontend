import axios from "axios"
import { GlobalProps } from "state/wrapper"
import { Offering, Opinion, Photo, Video } from "models"

const UserRequest = (p: GlobalProps) => {

    const update = (photos: any[], videos: any[]) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
    
        return p.http({
            url: `${process.env.REACT_APP_BACKEND_URL}/users/${user.id}`,
            method: 'put',
            data: {
                photos: [ ...user.photos.map((p: any) => p.id), ...photos.map((p: any) => p.id) ],
                videos: [ ...user.videos.map((p: any) => p.id), ...videos.map((p: any) => p.id) ],
            }
        })
        .then(() => refreshUser())
    }
    
    const register = (username: string, email: string, password: string, role: string) => {
        p.http({
            url: `${process.env.REACT_APP_BACKEND_URL}/auth/local/register`,
            method: 'post',
            data: {
                username,
                email,
                password,
                role,
            }
        })
        .then(response => {
            // Handle success.
            console.log('Well done!');
            console.log('User profile', (response.data as any).user);
            console.log('User token', (response.data as any).jwt);
            localStorage.setItem('token', (response.data as any).jwt)
            p.dispatch({ type: 'user', payload: (response.data as any).user})
        })
    };
    
    const logout = () => {
        p.dispatch({ type: 'logout' })
    };
    
    const refreshUser = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return p.All([
            p.http({ method: 'get', url: `${process.env.REACT_APP_BACKEND_URL}/users/${user.id}` }).then(r => r.data),
            p.http({ method: 'get', url: `${process.env.REACT_APP_BACKEND_URL}/offerings?_sort=created_at:desc` }).then(r => r.data),
            p.http({ method: 'get', url: `${process.env.REACT_APP_BACKEND_URL}/opinions` }).then(r => r.data),
        ])
        .then(axios.spread((user, offerings, opinions) => {
            offerings = offerings.filter((o: Offering) => o.user.id === user.id).map((o: Offering) => {
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
            user.photos = user.photos.filter((p: Photo) => p.hasOwnProperty('id'))
            user.videos = user.videos.filter((p: Video) => p.hasOwnProperty('id'))
            user = {
                ...user,
                offerings
            }
            p.dispatch({ type: 'user', payload: user })
        }))
    }

    const getUser = (id: string | number) => {
        return p.All([
            p.http({ method: 'get', url: `${process.env.REACT_APP_BACKEND_URL}/users/${id}` }).then(r => r.data),
            p.http({ method: 'get', url: `${process.env.REACT_APP_BACKEND_URL}/offerings?_sort=created_at:desc` }).then(r => r.data),
            p.http({ method: 'get', url: `${process.env.REACT_APP_BACKEND_URL}/opinions` }).then(r => r.data),
        ])
        .then(axios.spread((user, offerings, opinions) => {
            offerings = offerings.filter((o: Offering) => o.user.id === user.id).map((o: Offering) => {
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
            user.photos = user.photos.filter((p: Photo) => p.hasOwnProperty('id'))
            user.videos = user.videos.filter((p: Video) => p.hasOwnProperty('id'))
            user = {
                ...user,
                offerings
            }
            return user;
        }))
    }

    const login = (username: string, password:string ) => {
        return p.http({
            url: `${process.env.REACT_APP_BACKEND_URL}/auth/local`, 
            method: 'post',
            data: {
                identifier: username,
                password: password,
            }
        }).then((response) => {
            const user = (response.data as any).user;
            const jwt = (response.data as any).jwt;
            // Handle success.
            console.log('Well done!');
            console.log('User profile', user);
            console.log('User token', jwt);
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('token', jwt)
            return user
        })
    }

    return {
        update,
        register,
        logout,
        refreshUser,
        login,
        getUser
    }
}

export default UserRequest;