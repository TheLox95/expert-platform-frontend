import { GlobalProps } from "state/wrapper"

export default (p: GlobalProps) => ({
    delete: (id: number) => {
        return p.http({ method: 'delete', url: `${process.env.REACT_APP_BACKEND_URL}/offerings/files/${id}` })
        .then(r => {
            return p.requests.user.refreshUser()
            .then(() => r.data)
        })
    },
})