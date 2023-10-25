import Axios from 'axios';

import { setGlobal } from 'reactn';
import DeviceInfo from 'react-native-device-info';
import { BaseUrl } from '../src/config/Variables';
import { showMessage } from 'react-native-flash-message';
import { Strings } from '../src/config/Strings';
import * as RootNavigation from '../src/config/RootNavigation';
import { GLOBAL_ACTIVE_USER, GLOBAL_FORCE_LOGOUT } from '../src/state/StateInitializer';
import { Keyboard } from 'react-native';

Axios.defaults.timeout = 60000; // 60 Seconds timeout
Axios.defaults.headers.common['CoachPlus-Version-App'] = `${DeviceInfo.getVersion()}`;
Axios.defaults.headers.common['App-Name'] = 'CoachPlus';

class Api {
    static API_TOKEN = null;

    static get(url, params = {}, timeout = Axios.defaults.timeout) {
        return Api.request('GET', url, params, timeout);
    }

    static post(url, params = {}, data = null, timeout = Axios.defaults.timeout, axiosParams = {}) {
        return Api.request('POST', url, params, timeout, data, axiosParams);
    }

    static put(url, params = {}, data = null, timeout = Axios.defaults.timeout, axiosParams = {}) {
        return Api.request('PUT', url, params, timeout, data, axiosParams);
    }

    static delete(url, params = {}, data = null, timeout = Axios.defaults.timeout, axiosParams = {}) {
        return Api.request('DELETE', url, params, timeout, data, axiosParams);
    }

    static request(method, url, params = {}, timeout = undefined, data,  axiosParams) {
        
        if(data) {
            const paramNames = Object.keys(data);
            const hasPhotoParam = (
                method === 'POST' &&
                paramNames.some(i => ['file', 'front_file', 'side_file', 'back_file', 'media', 'photo'].indexOf(i) !== -1)
            );
    
            if (hasPhotoParam) {
                formData = new FormData();
    
                for ( var key in data ) {
                    //Check if media field is present (used for upload medias) is array to iterate
                    if(key === 'media') {
                        for (var x = 0; x < data['media'].length; x++) {
                            formData.append("media[]", data['media'][x]);
                        }
                    } else {
                        const value = data[key];
                        const processedValue = value === null ? '' : value; //Used to prevent sending 'null' as string
                        formData.append(key, processedValue);
                    }
                }

                data = formData;
            }

        }

        return new Promise((resolve, reject) => {
            return Axios({
                method: method,
                timeout,
                params,
                data,
                baseURL: BaseUrl,
                url,
                validateStatus: () => true,
                ...axiosParams,
                headers: {
                    'Authorization': `Bearer ${Api.API_TOKEN}`
                }

            })
            .then(response => {
                const data = response.data;

                if (data && data.success) {
                    resolve(data);
                    return;
                }

                if(response.status === 409) {
                    RootNavigation.navigate('AppVersion');
                    return;
                }

                if(response.status === 402) {
                    setGlobal({
                        [GLOBAL_ACTIVE_USER]: false
                    });
                    return;
                }

                if(response.status === 403) {
                    setGlobal({
                        [GLOBAL_FORCE_LOGOUT]: true
                    });
                    return;
                }

                if(data.message) {
                    Keyboard.dismiss();

                    showMessage({
                        message: data.message,
                        type: "danger",
                        duration: data.data?.duration || 3000
                    });
                }

                reject(data);
            })
            .catch(error => {
                showMessage({
                    message: Strings.exceptions_general_error,
                    type: "danger",
                });

                reject(error);
            });
        });
    }
}

export default Api;
