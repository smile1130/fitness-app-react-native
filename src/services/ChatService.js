import Api from '../../lib/api';

export default {
    conversations(params) {
        return new Promise((resolve, reject) => {
            Api.get('conversations', params)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    conversation(params) {
        return new Promise((resolve, reject) => {
            Api.get('conversation', params)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    loadMessagesFromLastMessageLoaded(params) {
        return new Promise((resolve, reject) => {
            Api.get('conversation/loadMessagesFromLastMessageLoaded', params)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    sendMessage(params) {
        return new Promise((resolve, reject) => {
            Api.post('conversation', params, params)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    markAsRead(params) {
        return new Promise((resolve, reject) => {
            Api.put('conversation/read', params)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },
}