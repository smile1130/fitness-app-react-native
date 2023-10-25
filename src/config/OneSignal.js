import * as RootNavigation from '../../src/config/RootNavigation';
import OneSignal from 'react-native-onesignal';

export let OSAppId = "1b3a62a7-7db3-4f90-b0d9-6f4238ed4210";

export const initOneSignal = () => {
    //Remove this method to stop OneSignal Debugging 
    OneSignal.setLogLevel(6, 0);
    
    // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
    OneSignal.setAppId(OSAppId);

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler(notification => {
        if(
            notification &&
            notification.notification &&
            notification.notification.additionalData &&
            notification.notification.additionalData.data
        ) {
            setTimeout(() => {
                navigateToSection(notification.notification.additionalData.data);
            }, 1000);
        }

        console.log("OneSignal: notification opened:", notification);
    });
}

export function navigateToSection(data) {
    if (data.routeName === 'Chat') {
        RootNavigation.navigate('Chat', {
            conversationId: data.conversationId || null
        });
    } else if(
        data.routeName === 'Macro' &&
        data.id
    ) {
        RootNavigation.navigate('Macro', {
            id: data.id
        });
    } else if(
        data.routeName === 'MealPlan' &&
        data.id
    ) {
        RootNavigation.navigate('MealPlan', {
            id: data.id
        });
    } else if(
        data.routeName === 'NutritionalAdvice'
    ) {
        RootNavigation.navigate('NutritionalAdvice');
    } else if(
        data.routeName === 'MyReservations'
    ) {
        RootNavigation.navigate('Reservation');
    } else if(
        data.routeName === 'WeightHistoryDetail'
    ) {
        RootNavigation.navigate('WeightHistoryDetail', {
            id: data.id
        });
    } else if(
        data.routeName === 'WorkoutsList'
    ) {
        RootNavigation.navigate('WorkoutsList');
    }
}