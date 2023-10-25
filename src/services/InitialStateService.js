import Api from '../../lib/api';

export default {
    getInitialState() {
        return Api.get('app/initial_state')
        .then(data => {
            return data.data;
        });
    }
}
