import Api from '../../lib/api';

export default {
    nutritionalAdvices(params) {
        return new Promise((resolve, reject) => {
            Api.get('client/nutritional-advices', params)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    mealPlans() {
        return new Promise((resolve, reject) => {
            Api.get('client/meal-plans')
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    mealPlan(id) {
        return new Promise((resolve, reject) => {
            Api.get('client/meal-plans/' + id)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    macros() {
        return new Promise((resolve, reject) => {
            Api.get('client/macros')
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    macro(id) {
        return new Promise((resolve, reject) => {
            Api.get('client/macros/' + id)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },
}