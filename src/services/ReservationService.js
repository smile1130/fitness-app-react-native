import Api from '../../lib/api';

export default {
    reservations() {
        return new Promise((resolve, reject) => {
            Api.get('client/reservations')
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    workout(params) {
        return new Promise((resolve, reject) => {
            Api.get('client/reservations/detail', params)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    storeReservation(reservationId, params) {
        return new Promise((resolve, reject) => {
            Api.post('client/reservations/'+reservationId+'/client', params)
            .then(data => {
                resolve(data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    removeReservation(reserved_current_user_id) {
        return new Promise((resolve, reject) => {
            Api.delete('client/reservations/'+reserved_current_user_id+'/client')
            .then(data => {
                resolve(data);
            }).catch((error) => {
                reject(error);
            });
        });
    },
}