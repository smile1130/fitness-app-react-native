import { setGlobal } from 'reactn';

export const GLOBAL_REFRESH_WORKOUTS_LIST = 'refreshWorkoutsList';
export const GLOBAL_REFRESH_RESERVATIONS = 'refreshReservations';
export const GLOBAL_REFRESH_METRICS_LIST = 'refreshMetricsList';
export const GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL = 'refreshWeightsHistoryDetail';
export const GLOBAL_REFRESH_WEIGHTS_HISTORY_SINGLE_DETAIL = 'refreshWeightsHistorySingleDetail';
export const GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL_FROM_WORKOUT_DETAIL = 'refreshWeightsHistoryDetailFromWorkoutDetail';
export const GLOBAL_REFRESH_WEIGHTS_LIST = 'refreshWeightsList';
export const GLOBAL_REFRESH_MEDIA_LIST = 'refreshMediaList';
export const GLOBAL_REFRESH_PROGRESS_LIST = 'refreshProgressList';
export const GLOBAL_ACTIVE_COUNTER_TIMER_MODAL = 'activeCounterTimerModal';
export const GLOBAL_COUNTER_TIMER_MODAL = 'counterTimerModal';
export const GLOBAL_LOGGED_USER = 'loggedUser';
export const GLOBAL_INITIAL_STATE = 'initialState';
export const GLOBAL_ACTIVE_USER = 'activeUser';
export const GLOBAL_FORCE_LOGOUT = 'forceLogout';
export const GLOBAL_ACTIVE_KEEP_AWAKE = 'activeKeepAwake';

// Initial global state
setGlobal({
    [GLOBAL_LOGGED_USER]: {},
    [GLOBAL_INITIAL_STATE]: {},
    [GLOBAL_ACTIVE_USER]: true,
    [GLOBAL_FORCE_LOGOUT]: false,
    [GLOBAL_REFRESH_WORKOUTS_LIST]: false,
    [GLOBAL_REFRESH_RESERVATIONS]: false,
    [GLOBAL_REFRESH_METRICS_LIST]: false,
    [GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL]: false,
    [GLOBAL_REFRESH_WEIGHTS_HISTORY_SINGLE_DETAIL]: false,
    [GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL_FROM_WORKOUT_DETAIL]: false,
    [GLOBAL_REFRESH_WEIGHTS_LIST]: false,
    [GLOBAL_REFRESH_MEDIA_LIST]: false,
    [GLOBAL_REFRESH_PROGRESS_LIST]: false,
    [GLOBAL_ACTIVE_COUNTER_TIMER_MODAL]: false,
    [GLOBAL_COUNTER_TIMER_MODAL]: null,
    [GLOBAL_ACTIVE_KEEP_AWAKE]: false
});