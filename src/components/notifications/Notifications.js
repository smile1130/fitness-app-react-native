import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import ComponentWithBackground from '../common/ComponentWithBackground';
import { CommonStyles } from '../../styles/CommonStyles';
import { Strings } from '../../config/Strings';
import { mainColor, white } from '../../styles/colors';
import { Spinner } from '../common/Spinner';
import { getCurrentDate } from '../../config/Util';
import { useNavigation } from '@react-navigation/native';
import NotificationService from '../../services/NotificationService';
import CustomButton from '../common/CustomButton';
import HtmlCustom from '../common/HtmlCustom';
import TitleComponent from '../common/TitleComponent';

const Notifications = () => {
    const [time, setTime] = useState(getCurrentDate());
    const [notifications, setNotifications] = useState(null);
    const [notificationsNextPage, setNotificationsNextPage] = useState(1);
    const [isFetching, setIsFetching] = React.useState(false);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    useEffect(()=>{
        loadNotifications(false);
    },[]) //notice the empty array here

    const loadNotifications = (forceReload = false) => {
        let timeParam = time;
        let pageParam = notificationsNextPage;
        
        if (forceReload) {
            pageParam = 1;
            timeParam = getCurrentDate();
            setTime(timeParam);
        }

        let params = {
            time: timeParam,
            page: pageParam
        };

        NotificationService.getNotifications(params)
        .then(response => {
            const newNotifications = (notifications && !forceReload) ? [...notifications, ...response.notifications] : response.notifications;
            setNotifications(newNotifications);

            setNotificationsNextPage(response.next_page);
        })
        .finally(() => {
            setLoading(false);
            setIsFetching(false);
        });
    }

    const handleAction = (item) => {
        if (item.type.includes('NewNutritionalAdvicePushNotification')) {
            navigation.navigate('NutritionalAdvice');
        } else if(item.type.includes('CreateReservationFromCoachNotification')) {
            navigation.navigate('Reservation');
        } else if(item.type.includes('DeleteReservationFromCoachNotification')) {
            navigation.navigate('Reservation');    
        } else if(item.type.includes('AssignedProgramPushNotification')) {
            navigation.navigate('WorkoutsList');
        } else if(item.type.includes('AssignedMealPlanPushNotification') && item.meal_plan_id) {
            navigation.navigate('MealPlan', {
                id: item.meal_plan_id
            });
        } else if(item.type.includes('AssignedMacroPushNotification') && item.macro_id) {
            navigation.navigate('Macro', {
                id: item.macro_id
            });
        } else if (item.type.includes('NewWeightMessageNotification') && item.weight_id) {
            navigation.navigate('WeightHistoryDetail', {
                id: item.weight_id
            });
        }
    }

    const renderItem = ({item, index}) => {
        const {
            text12,
            text14,
            text10,
            grayText,
            textBold
        } = CommonStyles;

        return (
            <TouchableOpacity onPress={() => handleAction(item)} style={styles.containerItem}>
                <View style={styles.containerIcon}>
                    <Icon
                        name={item.icon || 'notifications-outline'}
                        size={scale(13)}
                        color={white}
                    />
                </View>
                <View style={styles.containerTexts}>
                    <Text style={[text14, textBold, styles.titleLabel]}>{item.title}</Text>
                    <HtmlCustom
                        html={item.text}
                        baseFontStyle={{ ...text12 }}
                    />
                    <Text style={[text10, grayText, styles.dateLabel]}>{item.createdAt}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const renderTitle = () => {
        return (
            <TitleComponent
                title={Strings.label_notifications}
                hideBack
            />
        )
    }

    const onRefresh = () => {
        setIsFetching(true);
        loadNotifications(true);
    }

    const loadMoreMessage = () => {
        if(
            notificationsNextPage
        ) {
            return (
                <CustomButton
                    onPress={() => loadNotifications(false)}
                    text={Strings.label_load_more}
                    containerStyle={styles.loadMoreBtn}
                />
            )
        }

        return null;
    }

    if(loading) {
        return <Spinner />;
    }

    return (
        <ComponentWithBackground safeAreaEnabled>
            <FlatList
                data={notifications}
                extraData={notifications}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                refreshing={isFetching}
                onRefresh={onRefresh}
                ListHeaderComponent={renderTitle}
                ListFooterComponent={loadMoreMessage}
            />
        </ComponentWithBackground>
    );
      
}

const styles = ScaledSheet.create({
    containerTexts:{
        flex: 1
    },
    containerItem: {
        flexDirection: 'row',
        marginBottom: '20@s',
        paddingHorizontal: '15@s'
    },
    containerIcon: {
        width: '24@s',
        height: '24@s',
        borderRadius: '12@s',
        backgroundColor: mainColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '10@s'
    },
    titleLabel: {
        marginBottom: '5@s'
    },
    dateLabel: {
        marginTop: '3@s'
    },
    loadMoreBtn: {
        marginHorizontal: '15@s'
    },
});

export default function(props) {
    const navigation = useNavigation();
  
    return <Notifications {...props} navigation={navigation} />;
}