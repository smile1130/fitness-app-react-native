import Api from '../../lib/api';

export default {
    shoppingList() {
        return new Promise((resolve, reject) => {
            Api.get('client/shopping-list')
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    toggleShoppingList(shoppingListId) {
        return new Promise((resolve, reject) => {
            Api.post('client/shopping-list/'+shoppingListId+'/toggle')
            .then(data => {
                resolve(data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    deleteShoppingList(shoppingListId) {
        return new Promise((resolve, reject) => {
            Api.delete('client/shopping-list/'+shoppingListId)
            .then(data => {
                resolve(data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    storeShoppingList(params) {
        return new Promise((resolve, reject) => {
            Api.post('client/shopping-list', params)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },
}