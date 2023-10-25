import Api from '../../lib/api';

export default {
    metrics() {
        return new Promise((resolve, reject) => {
            Api.get('client/metrics/v2')
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    metric(metricId) {
        return new Promise((resolve, reject) => {
            Api.get('client/metrics/'+metricId)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    addResult(params) {
        return new Promise((resolve, reject) => {
            Api.post('client/metrics/v2', params)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    deleteResult(resultId) {
        return new Promise((resolve, reject) => {
            Api.delete('client/metrics/values/'+resultId)
            .then(data => {
                resolve(data);
            }).catch((error) => {
                reject(error);
            });
        });
    },
}