import { GlobalProps } from "state/wrapper"

export default (p: GlobalProps) => ({
    delete: (id: number) => {
        return p.http({ method: 'delete', url: `${process.env.REACT_APP_BACKEND_URL}/upload/files/${id}` })
        .then(r => {
            return p.requests.user.getUser()
            .then(() => r.data)
        })
    },
})