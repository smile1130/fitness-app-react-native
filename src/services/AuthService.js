import Api from '../../lib/api';

export default {
    
    login(params) {
        return new Promise((resolve, reject) => {
            Api.post('auth/login', params)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    resetPassword(params) {
        return new Promise((resolve, reject) => {
            Api.post('password/reset/email', params)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

}