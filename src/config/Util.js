import {
    Dimensions,
    Platform,
    NativeModules,
    Linking
} from 'react-native';
import { setGlobal, getGlobal } from 'reactn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';
import 'moment/min/locales';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { GLOBAL_INITIAL_STATE, GLOBAL_LOGGED_USER } from '../state/StateInitializer';
import Api from '../../lib/api';
import { showMessage } from 'react-native-flash-message';
import { red } from '../styles/colors';
import { Strings } from './Strings';

export let screenHeight = Dimensions.get('screen').height;
export let screenWidth = Dimensions.get('screen').width;
export const isAndroid = Platform.OS === 'android';

//Manage user state
export function setUserDataAsync(user) {
    AsyncStorage.setItem('user', JSON.stringify(user));
}

export function setUserData(user) {
    setGlobal({
        [GLOBAL_LOGGED_USER]: user
    });
}

export function setInitialState(initialState) {
    setGlobal({
        [GLOBAL_INITIAL_STATE]: initialState
    });
}

export async function getUserDataAsync() {
    return JSON.parse(await AsyncStorage.getItem('user'));
}

export function getUserData() {
    return getGlobal()[GLOBAL_LOGGED_USER];
}

export function setToken(userToken) {
    Api.API_TOKEN = userToken;
}

export function signInUser(userData) {
    Api.API_TOKEN = userData.access_token;

    setUserDataAsync(userData);
    setUserData(userData);
}

//Open media with native fileviewer
export const openChatFile = (url, fileName, progressCallback) => {
    const localFile = `${RNFS.CachesDirectoryPath}/${fileName}`;

    RNFS.exists(localFile)
    .then((exist) => {
        if(exist) {
            console.log('EXIST', localFile);
            FileViewer.open(localFile)
        } else {
            console.log('NOT EXIST');
            const options = {
                fromUrl: url,
                toFile: localFile,
                progressDivider: 1,
                begin: (res) => {
                    // console.log('begin', res);
                },
                progress: (res) => {
                    console.log(res);
                    var percentage = Math.floor((res.bytesWritten/res.contentLength) * 100);
                    progressCallback(percentage);
                }
            };

            const ret = RNFS.downloadFile(options);

            ret.promise.then(() => {
                console.log('file manager', localFile);
                progressCallback(100);
                FileViewer.open(localFile)
            })
            .catch(error => {
                // error
            });
        }
    })
    .then(() => {
        // success
    })
    .catch(error => {
        console.log('CATCH ERROR!');
        // error
    });    
};

//Clear user data
export async function clearUserData() {
    await AsyncStorage.removeItem('user');
    setGlobal({
        [GLOBAL_LOGGED_USER]: {}
    });
    Api.API_TOKEN = null;
}

//Utility
export function chunkArray(array, size) {
    const chunked_arr = [];
    for (let i = 0; i < array.length; i++) {
        const last = chunked_arr[chunked_arr.length - 1];
        if (!last || last.length === size) {
            chunked_arr.push([array[i]]);
        } else {
            last.push(array[i]);
        }
    }
    return chunked_arr;
}

export function getCurrentDate() {
    return moment().tz('Europe/Rome').format('YYYY-MM-DD HH:mm:ss');
}

export function formatChatDate(date) {
    return moment(date).tz('Europe/Rome', true).local().format('HH:mm');
}

export function formatMetriGraphDate(date) {
    return moment(date).tz('Europe/Rome', true).local().format('D MMM')
}

export function formatYMDDate(date) {
    return moment(date).tz('Europe/Rome', true).local().format('YYYY-MM-DD');
}

export function formatYMDDateNoTZ(date) {
    return moment(date).format('YYYY-MM-DD');
}

export function formatDateHuman(date) {
    return moment(date).tz('Europe/Rome', true).local().format('ddd D MMM');
}

export const getFileNameFromUrl = (url) => {
    return url.substring(url.lastIndexOf('/') + 1);
}

export async function getBase64File(url) {
    const base64data = await RNFS.readFile(url, 'base64')
    return base64data;
}

export function clearUrlToSend (url) {
    let newUrl = url.replace('file://','');
    return newUrl.replace(/%20/g,' ');
}

export function errorImagePicker(errorCode) {
    if(
        errorCode === "E_NO_LIBRARY_PERMISSION" ||
        errorCode === "E_NO_CAMERA_PERMISSION"
    ) {
        showMessage({
            message: errorCode === "E_NO_LIBRARY_PERMISSION" ? Strings.exceptions_permission_library : Strings.exceptions_permission_camera,
            description: Strings.exceptions_permission_desc,
            duration: 8000,
            backgroundColor: red,
            onPress: () => Linking.openSettings()
        });
    }
}

export function newWeightParamValue(params) {
    return {
        exercise_id: params.exercise_id,
        exerciseType: params.exerciseType,
        name: params.name,
        sets: params.sets,
        final_type: params.final_type || params.type,
        final_value: params.final_value || params.value
    };
}

export function getTimezoneOffset() {
    const d = new Date();
    
    return d.getTimezoneOffset();
}

export function getLocaleFromDevice() {
    const appLanguage =
        !isAndroid
        ?
            NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0]
        :
            NativeModules.I18nManager.localeIdentifier;

    if (appLanguage && appLanguage.includes('it')) {
        return 'it';
    }

    return 'en';
}

// Save workout weights

export function getKeyFromExercise(exercise) {
    if (!Array.isArray(exercise)) {
        const id = exercise.id;
        const dayId = exercise.dayId;
        const workoutId = exercise.workoutId;

        return id.toString()+dayId.toString()+workoutId.toString();
    }

    let key = '';

    exercise.forEach(element => {
        const id = element.id;
        const dayId = element.dayId;
        const workoutId = element.workoutId;

        key += id.toString()+dayId.toString()+workoutId.toString();
    });

    return key;
}

export function setWorkoutWeightsDataAsync(key, data) {
    AsyncStorage.setItem('workout_'+key, JSON.stringify(data));
}

export function removeWorkoutWeightsDataAsync(key, data) {
    AsyncStorage.removeItem('workout_'+key);
}

export async function getWorkoutWeightsDataAsync(key) {
    return JSON.parse(await AsyncStorage.getItem('workout_'+key));
}

export function setExpandedTimer(value) {
    AsyncStorage.setItem('expanded_timer', value);
}

export async function getExpandedTimer() {
    return await AsyncStorage.getItem('expanded_timer');
}

export function setAudioOnTimer(value) {
    AsyncStorage.setItem('audio_on_timer', value);
}

export async function getAudioOnTimer() {
    return await AsyncStorage.getItem('audio_on_timer');
}

export async function setWorkoutStart(key, value) {
    return await AsyncStorage.setItem(key, value);
}

export async function removeWorkoutStart(key) {
    return await AsyncStorage.removeItem(key);
}

export async function getWorkoutStart(key) {
    return await AsyncStorage.getItem(key);
}

export async function setLastWorkoutId(value) {
    return await AsyncStorage.setItem('last_workout_id', value.toString());
}

export async function removeLastWorkoutId() {
    return await AsyncStorage.removeItem('last_workout_id');
}

export async function getLastWorkoutId() {
    return await AsyncStorage.getItem('last_workout_id');
}

export function truncateText(text, maxLength = 50) {
    if (text.length <= maxLength) {
        return text;
    } else {
        const firstHalf = text.substring(0, maxLength / 2);
        const secondHalf = text.substring(text.length - maxLength / 2);
        return firstHalf + '...' + secondHalf;
    }
}