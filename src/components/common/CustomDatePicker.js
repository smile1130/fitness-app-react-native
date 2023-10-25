import React, { PureComponent } from 'react';
import {
    View,
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';

import { applyOpacity, black, white } from '../../styles/colors';
import { getUserData, isAndroid } from '../../config/Util';

class CustomDatePicker extends PureComponent {
    constructor(props) {
        super(props)
    };

    renderPicker = () => {
        const { locale } = getUserData();
        let localeToSet = 'it-IT';

        if (locale === 'en') {
            localeToSet = 'en-EN'
        }

        return (
            <DateTimePicker
                testID="dateTimePicker"
                value={this.props.date}
                mode={'date'}
                is24Hour={true}
                display={isAndroid ? "default" : "spinner"}
                onChange={this.props.onChangeDate}
                locale={localeToSet}
            />
        )
    }

    render() {

        if(isAndroid) {
            if(this.props.isDatePickerVisible) {
                return this.renderPicker();
            }

            return null;
        }

        return (
            <Modal
                isVisible={this.props.isDatePickerVisible}
                onBackdropPress={this.props.toggleModal}
                swipeDirection={['down']}
                onSwipeComplete={this.props.toggleModal}
                backdropColor={applyOpacity(black, 0.5)}
                style={styles.modalContainer}
            >
                <View style={styles.innerModal}>
                    {this.renderPicker()}
                </View>
            </Modal>
        )
    }
}

const styles = ScaledSheet.create({
	modalContainer: {
        justifyContent: 'flex-end',
        margin: 0
    },
    innerModal: {
        backgroundColor: white,
        paddingVertical: '20@s'
    },
});

export default CustomDatePicker;