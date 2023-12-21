import Api from '../../lib/api';

export default {
    surveys(params) {
        return new Promise((resolve, reject) => {
            Api.get('client/surveys', params)
                .then(data => {
                    resolve(data.data);
                }).catch((error) => {
                    reject(error);
                });
        });
    },

    completedSurveys() {
        return new Promise((resolve, reject) => {
            Api.get('client/surveys/completed',)
                .then(data => {
                    resolve(data.data);
                }).catch((error) => {
                    reject(error);
                });
        });
    },

    submitSurvey(params) {
        return new Promise((resolve, reject) => {
            Api.post('client/surveys', {}, { ...params, isCompressed: true })
                .then(data => {
                    resolve(data.data);
                }).catch((error) => {
                    reject(error);
                });
        });
    },

    loadAnswer(id) {
        return new Promise((resolve, reject) => {
            Api.get(`client/surveys/answers/${id}`,)
                .then(data => {
                    resolve(data.data);
                }).catch((error) => {
                    reject(error);
                });
        });
    },
}