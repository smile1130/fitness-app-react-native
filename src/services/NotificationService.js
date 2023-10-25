import Api from '../../lib/api';

export default {
    getNotifications(params) {
        return new Promise((resolve, reject) => {
            Api.get('client/notifications', params)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }
}