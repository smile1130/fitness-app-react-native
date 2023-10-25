import React, { Component } from 'react';
import {
    View,
    TouchableOpacity
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { ScaledSheet } from 'react-native-size-matters';

import moment from 'moment-timezone';
import { gray2, black, white } from '../../../styles/colors';
import { CommonStyles } from '../../../styles/CommonStyles';
import { Strings } from '../../../config/Strings';
import CustomButton from '../../common/CustomButton';
import { useNavigation } from '@react-navigation/native';
import ConfirmModal from '../../common/ConfirmModal';
import { formatYMDDateNoTZ, getTimezoneOffset, isAndroid } from '../../../config/Util';
import CustomDatePicker from '../../common/CustomDatePicker';
import AddWeightsComponentOnlyWeights from './AddWeightsComponentOnlyWeights';
import InputBorder from '../../common/InputBorder';

class AddWeightsComponent extends Component {
    constructor(props) {
        super(props);

        let wDateValue = new Date();

        const timeZoneOffset = getTimezoneOffset();

        if (this.props.wDate) {
            // Trasform date from UTC adding 2 hours and add offset from local timezone
            if (timeZoneOffset > 0) {
                wDateValue = moment(this.props.wDate).add(2, 'hours').add(Math.abs(timeZoneOffset), 'minutes').toDate();
            } else {
                wDateValue = moment(this.props.wDate).add(2, 'hours').add(Math.abs(timeZoneOffset), 'minutes').toDate();
            }
        }

        this.state = {
            weights: this.props.weights || [
                {
                    weight: null,
                    value: null
                }
            ],
            weight: null,
            value: null,
            note: this.props.note || null,
            wDate: wDateValue,
            isDatePickerVisible: false,
            isModalVisible: false
        }
    }

    handleAction = () => {
        this.props.handleAction(
            this.state.weights,
            this.state.note,
            this.state.wDate
        );
    }

    checkDataBeforeSubmit = () => {
        let error = false;

        if (this.props.exercise.exerciseType !== 'circuit') {
            this.state.weights.forEach(item => {
                if(
                    item.weight === null ||
                    item.weight === '' ||
                    item.value === null ||
                    item.value === ''
                ) {
                    error = true;
                }
            });
        } else {
            if (!this.state.note || this.state.note.length === 0) {
                error = true;
            }
        }

        if(error) {
            showMessage({
                message: Strings.exceptions_insert_all_values,
                type: "danger",
            });
            return;
        }

        if(this.props.exercise.sets && this.state.weights.length !== this.props.exercise.sets) {
            this.toggleModal();
            return;
        }

        this.handleAction();
    }

    addWeightResultFromModal = () => {
        this.toggleModal();
        this.handleAction();
    }

    toggleModal = () => {
        this.setState({isModalVisible: !this.state.isModalVisible});
    }

    toggleDatePicker = () => {
        this.setState({isDatePickerVisible: !this.state.isDatePickerVisible});
    }

    formatDate = () => {
        return formatYMDDateNoTZ(this.state.wDate);
    }

    onChangeDate = (event, wDate) => {
        if(wDate !== undefined) {
            if(isAndroid) {
                this.setState({isDatePickerVisible: !this.state.isDatePickerVisible}, () => {
                    this.setState({ wDate });
                });
            } else {
                this.setState({ wDate });
            }
        } else {
            this.toggleDatePicker();
        }
    }

    renderDateModal = () => {
        return (
            <CustomDatePicker
                onChangeDate={this.onChangeDate}
                date={this.state.wDate}
                isDatePickerVisible={this.state.isDatePickerVisible}
                toggleModal={this.toggleDatePicker}
            />
        )
    }

    renderModal = () => {
        return (
            <ConfirmModal
                text={Strings.strings_confirm_add_weights_different_set}
                toggleModal={this.toggleModal}
                isModalVisible={this.state.isModalVisible}
                action={this.addWeightResultFromModal}
            />
        )
    }

    renderWeights = () => {
        return (
            <AddWeightsComponentOnlyWeights
                weights={this.props.weights}
                exercise={this.props.exercise}
                handleWeights={(weights) => this.setState({weights})}
            />
        )
    }

    renderNote = () => {
        const {
            text14,
            textBold,
            blackText
        } = CommonStyles;

        const containerNoteStyle = this.props.exercise.exerciseType === 'circuit' ? styles.containerNoteStyle : null;

        return (
            <View style={containerNoteStyle}>
                <InputBorder
                    label={Strings.label_notes}
                    labelStyle={[text14, textBold, blackText, styles.labelInput]}
                    placeholder={Strings.label_insert_note}
                    text={this.state.note}
                    handleValue={(note) => this.setState({note})}
                    multiline
                />
            </View>
        )
    }

    renderDate = () => {
        const {
            text14,
            textBold
        } = CommonStyles;

        return (
            <TouchableOpacity activeOpacity={1} onPress={this.toggleDatePicker}>
                <View style={styles.containerDate} pointerEvents={'none'}>
                    <InputBorder
                        label={Strings.label_date}
                        placeholder={Strings.label_insert_date}
                        text={this.formatDate()}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const {
            boxShadowLight
        } = CommonStyles;

        return (
            <View style={styles.mainContainer}>
                <View style={[boxShadowLight, styles.container]}>
                    {this.renderWeights()}
                    {this.renderNote()}
                    {this.renderDate()}
                </View>
                <CustomButton
                    onPress={this.checkDataBeforeSubmit}
                    text={Strings.label_save_weight_result}
                    containerStyle={styles.saveBtn}
                    disabled={this.props.btnActionDisabled}
                    icon={'checkmark-outline'}
                />
                {this.renderModal()}
                {this.renderDateModal()}
            </View>
        );
    }
}

const styles = ScaledSheet.create({
    mainContainer: {
        marginHorizontal: '15@s'
    },
    container: {
        backgroundColor: white,
        borderRadius: '10@s',
        paddingHorizontal: '20@s',
        paddingBottom: '25@s'
    },
    saveBtn: {
        marginVertical: '30@s'
    },
    note: {
        height: '100@s',
        fontSize: '12@s',
        padding: '10@s',
        borderWidth: '1@s',
        borderRadius: '8@s',
        borderColor: gray2,
        color: black
    },
    containerNoteStyle: {
        marginTop: '20@s'
    },
    containerDate: {
        marginTop: '20@s'
    },
	inputDate: {
        height: '40@s',
        fontSize: '14@s',
        fontWeight: '600',
        paddingHorizontal: '10@s',
        borderWidth: '1@s',
        borderRadius: '3@s',
        color: black,
        borderColor: gray2
    },
    labelInput: {
        marginBottom: '7@s'
    },
});

export default function(props) {
    const navigation = useNavigation();
  
    return <AddWeightsComponent {...props} navigation={navigation} />;
}