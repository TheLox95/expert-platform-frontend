import { GlobalProps } from "./wrapper"

export default (p: GlobalProps) => ({
    delete: (id: number) => {
        return p.http({ method: 'delete', url: `http://localhost:1337/offerings/${id}` })
        .then(r => r.data)
    }
})