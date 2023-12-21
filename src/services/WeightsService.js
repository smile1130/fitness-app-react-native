import Api from '../../lib/api';

export default {
    storeWeight(params) {
        return new Promise((resolve, reject) => {
            Api.post('client/weights', params)
                .then(data => {
                    resolve(data.data);
                }).catch((error) => {
                    reject(error);
                });
        });
    },

    storeWeightFromWorkoutDetail(params) {
        return new Promise((resolve, reject) => {
            Api.post('client/weights/weights-from-workout-detail', {}, { ...params, isCompressed: true })
                .then(data => {
                    resolve(data.data);
                }).catch((error) => {
                    reject(error);
                });
        });
    },

    getWeightsFromSingleValues(params) {
        return new Promise((resolve, reject) => {
            Api.post('client/weights/weights-from-single-values', params)
                .then(data => {
                    resolve(data.data);
                }).catch((error) => {
                    reject(error);
                });
        });
    },

    getWeightsFromExercise(params) {
        return new Promise((resolve, reject) => {
            Api.get('client/weights/weights-from-exercise', params)
                .then(data => {
                    resolve(data.data);
                }).catch((error) => {
                    reject(error);
                });
        });
    },

    getWeightdetail(id) {
        return new Promise((resolve, reject) => {
            Api.get(`client/weights/${id}/detail`)
                .then(data => {
                    resolve(data.data);
                }).catch((error) => {
                    reject(error);
                });
        });
    },

    deleteWeights(weightId) {
        return new Promise((resolve, reject) => {
            Api.delete('client/weights/' + weightId)
                .then(data => {
                    resolve(data.data);
                }).catch((error) => {
                    reject(error);
                });
        });
    },

    getWeights() {
        return new Promise((resolve, reject) => {
            Api.get('client/weights')
                .then(data => {
                    resolve(data.data);
                }).catch((error) => {
                    reject(error);
                });
        });
    },

    storeWeightMessage(weightId, params) {
        return new Promise((resolve, reject) => {
            Api.post('client/weights/' + weightId + '/message', params)
                .then(data => {
                    resolve(data.data);
                }).catch((error) => {
                    reject(error);
                });
        });
    },

    storeWeightFile(weightId, params) {
        return new Promise((resolve, reject) => {
            Api.post('client/weights/' + weightId + '/file', {}, { ...params, isCompressed: true })
                .then(data => {
                    resolve(data.data);
                }).catch((error) => {
                    reject(error);
                });
        });
    },
}