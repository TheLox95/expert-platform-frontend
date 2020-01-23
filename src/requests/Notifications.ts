import { GlobalProps } from "state/wrapper"
import { Notification, User } from "models"

const NotificationRequest = (p: GlobalProps) => {

    const getNotifications = () => {
        const user = localStorage.getItem('user');
        if (!user) {
            return
        }

        if (JSON.parse(user).role.type !== 'client') {
            return
        }

        return p.http({
            url: `http://localhost:1337/offerings/following`,
            method: 'get',
            disableGLobal: true
        })
        .then((r) => {
            p.dispatch({ type: 'notifications', payload: r.data })
        })
    }

    const readed = (notifications: Notification[]) => {

        p.All(notifications.map(n => {
            return p.http({
                disableGLobal: true,
                url: `http://localhost:1337/notifications/${n.id}`,
                method: 'put',
                data: { wasRead: true }
            })
        }), { disableGLobal: true })
        .then(() => getNotifications());
    }

    return {
        readed,
        getNotifications,
    }
}

export default NotificationRequest;