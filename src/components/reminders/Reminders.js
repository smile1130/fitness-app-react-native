import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList
} from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import ComponentWithBackground from '../common/ComponentWithBackground';
import { CommonStyles } from '../../styles/CommonStyles';
import { Strings } from '../../config/Strings';
import { mainColor, white } from '../../styles/colors';
import { Spinner } from '../common/Spinner';
import { getCurrentDate } from '../../config/Util';
import CustomButton from '../common/CustomButton';
import ReminderService from '../../services/ReminderService';
import EmptySection from '../common/EmptySection';
import TitleComponent from '../common/TitleComponent';

const Reminders = () => {
    const [time, setTime] = useState(getCurrentDate());
    const [reminders, setReminders] = useState(null);
    const [remindersNextPage, setRemindersNextPage] = useState(1);
    const [isFetching, setIsFetching] = React.useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        loadReminders(false);
    },[]) //notice the empty array here

    const loadReminders = (forceReload = false) => {
        let timeParam = time;
        let pageParam = remindersNextPage;
        
        if (forceReload) {
            pageParam = 1;
            timeParam = getCurrentDate();
            setTime(timeParam);
        }

        let params = {
            time: timeParam,
            page: pageParam
        };

        ReminderService.getReminders(params)
        .then(response => {
            const newReminders = (reminders && !forceReload) ? [...reminders, ...response.reminders] : response.reminders;
            setReminders(newReminders);

            setRemindersNextPage(response.next_page);
        })
        .finally(() => {
            setLoading(false);
            setIsFetching(false);
        });
    }

    const renderItem = ({item, index}) => {
        const {
            text14,
            text10,
            grayText,
            textBold,
            blackText
        } = CommonStyles;

        return (
            <View style={styles.containerItem}>
                <View style={styles.containerIcon}>
                    <Icon
                        name={'calendar-outline'}
                        size={scale(13)}
                        color={white}
                    />
                </View>
                <View style={styles.containerTexts}>
                    <Text style={[text14, textBold]}>{item.text}</Text>
                    { 
                        item.endDate && item.endDate !== item.fullDate ? 
                            <View>
                                <Text style={[text10, grayText, styles.dateLabel]}><Text style={[blackText, textBold]}>{Strings.label_start}:</Text> {item.fullDateFormatted}</Text>
                                <Text style={[text10, grayText, styles.dateLabel]}><Text style={[blackText, textBold]}>{Strings.label_end}:</Text> {item.endDateFormatted}</Text>
                            </View>
                        : <Text style={[text10, grayText, styles.dateLabel]}>{item.fullDateFormatted}</Text>
                    }
                </View>
            </View>
        )
    }

    const renderTitle = () => {
        return (
            <TitleComponent
                title={Strings.label_reminders}
                hideBack
            />
        )
    }

    const renderEmptyReminders = () => {
        return (
            <EmptySection text={Strings.strings_empty_reminders} icon={'calendar'} />
        )
    }

    const onRefresh = () => {
        setIsFetching(true);
        loadReminders(true);
    }

    const loadMoreMessage = () => {
        if(
            remindersNextPage
        ) {
            return (
                <CustomButton
                    onPress={() => loadReminders(false)}
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
                data={reminders}
                extraData={reminders}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                refreshing={isFetching}
                onRefresh={onRefresh}
                ListEmptyComponent={renderEmptyReminders}
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
        marginHorizontal: '15@s',
        marginBottom: '20@s'
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
    dateLabel: {
        marginTop: '3@s'
    },
    loadMoreBtn: {
        marginHorizontal: '15@s'
    },
});

export default Reminders;