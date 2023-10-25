import React, { PureComponent } from 'react';
import {
    FlatList,
    View,
    Text
} from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { CommonStyles } from '../../styles/CommonStyles';
import { mainColor, white } from '../../styles/colors';
import CustomButton from '../common/CustomButton';
import { Strings } from '../../config/Strings';
import ReservationService from '../../services/ReservationService';
import EmptySection from '../common/EmptySection';
import { showMessage } from 'react-native-flash-message';
import CustomModal from '../common/CustomModal';
import InputBorder from '../common/InputBorder';

class ReservationItem extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showMessageModal: false,
            message: null
        }

        this.realStartDate = null;
        this.reservationId = null;
    }

    handleCloseMessageModal = () => {
        this.setState({
            showMessageModal: false,
            message: null
        });
    }

    renderMessage = () => {
        return (
            <CustomModal
                visible={this.state.showMessageModal}
                title={Strings.label_insert_message}
                onCancel={this.handleCloseMessageModal}
                onConfirm={this.handleActionReservation}
                confirmText={Strings.label_reserve}
            >
                <InputBorder
                    placeholder={Strings.strings_write_reservation_message}
                    text={this.state.message}
                    handleValue={(message) => {this.setState({message})}}
                    multiline
                />
            </CustomModal>
        )
    }

    handleActionReservation = () => {
        const params = {
            real_start_date: this.realStartDate,
            message: this.state.message
        };

        ReservationService.storeReservation(this.reservationId, params)
        .then(data => {
            showMessage({
                message: data.message,
                type: "success"
            });
        }).finally(() => {
            this.props.callback();
            this.handleCloseMessageModal();
        });
    }

    handleReservation = (real_start_date, reservation) => {
        this.realStartDate = real_start_date;
        this.reservationId = reservation.id;

        if (reservation.enable_message) {
            this.setState({
                showMessageModal: true
            });

            return;
        }

        this.handleActionReservation();
    }

    cancelReservation = (reserved_current_user_id) => {
        ReservationService.removeReservation(reserved_current_user_id)
        .then(data => {
            showMessage({
                message: data.message,
                type: "success"
            });
        }).finally(() => {
            this.props.callback();
        });
    }

    renderAction = (real_start_date, item, isReserved) => {
        const textButton = isReserved ? CommonStyles.mainText : CommonStyles.whiteText;
        const bgButton = isReserved ? white : mainColor;
        const blackText = isReserved ? CommonStyles.whiteText : CommonStyles.blackText;

        if(item.reserved_current_user_id) {
            if (!item.can_delete) {
                return <Text style={[CommonStyles.textCenter, blackText]}>{Strings.label_time_to_cancel_expired}</Text>
            }

            return (
                <CustomButton
                    text={Strings.label_undo}
                    smallButton
                    containerStyle={[styles.buttonStyle, {
                        backgroundColor: bgButton
                    }]}
                    textStyle={textButton}
                    onPress={() => this.cancelReservation(item.reserved_current_user_id)}
                />
            )    
        }

        if (!item.can_reserve) {
            return <Text style={[CommonStyles.textCenter, blackText]}>{Strings.label_time_to_booking_expired}</Text>
        }

        if (item.no_places) {
            return <Text style={blackText}>{Strings.label_sold_out}</Text>
        }

        return (
            <CustomButton
                text={Strings.label_reserve}
                smallButton
                containerStyle={styles.buttonStyle}
                onPress={() => this.handleReservation(real_start_date, item)}
            />
        )
    }

    renderReservedText = (isReserved) => {
        if (!isReserved) {
            return null;
        }

        return (
            <View style={styles.containerReservedText}>
                <Icon
                    name={'checkmark-circle'}
                    size={scale(12)}
                    color={white}
                />
                <Text style={[CommonStyles.text10, CommonStyles.whiteText, CommonStyles.textBold]}>{' '}{Strings.label_reserved}</Text>
            </View>
        )
    }

    renderSingleElementList = (real_start_date, item, index) => {
        const isReserved = item.reserved_current_user_id;
        const styleFirstElement = index === 0 ? styles.firstContainerSingleElementList : null;
        const styleReserved = isReserved ? styles.containerSingleElementListReserved : null;
        const darkGrayTextColor = isReserved ? CommonStyles.whiteText : CommonStyles.darkGrayText;
        const blackTextColor = isReserved ? CommonStyles.whiteText : CommonStyles.blackText;

        return (
            <View style={[
                CommonStyles.boxShadowLight,
                styles.containerSingleElementList,
                styleFirstElement,
                styleReserved
            ]}>
                { this.renderReservedText(isReserved) }
                <View style={styles.containerElementInner}>
                    <Text style={[CommonStyles.text12, darkGrayTextColor]}>
                        <Icon
                            name={'time-outline'}
                            size={scale(12)}
                        />{' '}
                        {item.startTime} - {item.endTime}
                    </Text>
                    <Text style={[CommonStyles.text12, darkGrayTextColor, CommonStyles.textBold]}>
                        <Icon
                            name={'people-outline'}
                            size={scale(12)}
                        />{' '}
                        {item.num_clients ? (item.users_count+'/'+item.num_clients) : item.users_count}
                    </Text>
                </View>
                <View style={styles.containerElementInner}>
                    <Text style={[CommonStyles.text14, CommonStyles.textBold, blackTextColor, styles.title]}>{item.title}</Text>
                    { this.renderAction(real_start_date, item, isReserved) }
                </View>
            </View>
        )
    }

    renderEmptyReservations = () => {
        return (
            <EmptySection style={styles.emptySection} text={Strings.strings_empty_reservations} icon={'calendar'} />
        )
    }

    render() {
        const {
            text18,
            textBold
        } = CommonStyles;

        const real_start_date = this.props.item.real_start_date;

        return (
            <View style={styles.containerElement}>
                <View style={styles.containerDayName}>
                    <Text style={[text18, textBold]}>{this.props.item.real_start_date_formatted.toLowerCase()}</Text>
                </View>
                <FlatList
                    data={this.props.item.reservations}
                    extraData={this.props.item.reservations}
                    renderItem={({item, index}) => this.renderSingleElementList(real_start_date, item, index)}
                    keyExtractor={(_, index) => index.toString()}
                    refreshing={false}
                />
                { this.renderMessage() }
            </View>
        )
    }
}

const styles = ScaledSheet.create({
    containerElement: {
        flex: 1,
        marginTop: '20@s'
    },
    containerDayName: {
        marginHorizontal: '15@s'
    },
    buttonStyle: {
        marginTop: '10@s'
    },
    firstContainerSingleElementList: {
        marginTop: '20@s'
    },
    containerSingleElementList: {
        backgroundColor: white,
        padding: '15@s',
        marginHorizontal: '15@s',
        borderRadius: '12@s',
        marginBottom: '15@s'
    },
    containerSingleElementListReserved: {
        backgroundColor: mainColor
    },
    containerElementInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        marginTop: '5@s'
    },
    containerReservedText: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '5@s'
    },
    emptySection: {
        marginTop: '30@s'
    }
});

export default function(props) {
    const navigation = useNavigation();
  
    return <ReservationItem {...props} navigation={navigation} />;
};