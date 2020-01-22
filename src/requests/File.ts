import { GlobalProps } from "state/wrapper"

export default (p: GlobalProps) => ({
    delete: (id: number) => {
        return p.http({ method: 'delete', url: `http://localhost:1337/upload/files/${id}` })
        .then(r => {
            return p.requests.user.getUser()
            .then(() => r.data)
        })
    },
})