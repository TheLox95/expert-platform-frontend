import { GlobalProps } from "state/wrapper"
import { Notification } from "models"

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
            url: `${process.env.REACT_APP_BACKEND_URL}/offerings/following`,
            method: 'get',
            disableGlobal: true
        })
        .then((r) => {
            p.dispatch({ type: 'notifications', payload: r })
        })
    }

    const readed = (notifications: Notification[]) => {

        Promise.all(notifications.map(n => {
            return p.http({
                disableGlobal: true,
                url: `${process.env.REACT_APP_BACKEND_URL}/notifications/${n.id}`,
                method: 'put',
                data: { wasRead: true },
            })
        }))
        .then(() => getNotifications());
    }

    return {
        readed,
        getNotifications,
    }
}

export default NotificationRequest;