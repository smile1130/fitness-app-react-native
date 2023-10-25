import Api from '../../lib/api';

export default {
    programs() {
        return new Promise((resolve, reject) => {
            Api.get('client/programs')
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    workout(id) {
        return new Promise((resolve, reject) => {
            Api.get('client/programs/workouts/' + id)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    markWorkoutCompleted(id, data) {
        return new Promise((resolve, reject) => {
            Api.post('client/programs/workouts/'+id+'/completed', data)
            .then(data => {
                resolve(data);
            }).catch((error) => {
                reject(error);
            });
        });
    }
}