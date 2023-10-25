import Api from '../../lib/api';

export default {
    medias(params) {
        return new Promise((resolve, reject) => {
            Api.get('client/media/v2', params)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }
}