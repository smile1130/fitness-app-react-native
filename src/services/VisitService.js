import Api from '../../lib/api';

export default {
    visit(name) {
        return new Promise((resolve, reject) => {
            Api.get('client/visits/'+name)
            .then(data => {
                resolve(data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }
}