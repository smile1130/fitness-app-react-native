import Api from '../../lib/api';

export default {
    getReminders(params) {
        return new Promise((resolve, reject) => {
            Api.get('client/reminders', params)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }
}