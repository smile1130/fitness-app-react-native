import Api from '../../lib/api';

export default {
    progress() {
        return new Promise((resolve, reject) => {
            Api.get('client/progress')
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    addProgress(params) {
        return new Promise((resolve, reject) => {
            Api.post('client/progress', {}, params)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    deleteProgress(progressId) {
        return new Promise((resolve, reject) => {
            Api.delete('client/progress/'+progressId)
            .then(data => {
                resolve(data);
            }).catch((error) => {
                reject(error);
            });
        });
    },
}