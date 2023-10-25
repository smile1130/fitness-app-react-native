import Api from '../../lib/api';

export default {
    me() {
        return new Promise((resolve, reject) => {
            Api.get('auth/me')
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    edit(params) {
        return new Promise((resolve, reject) => {
            Api.post('profile', {}, params)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

}