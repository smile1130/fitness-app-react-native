import React, { PureComponent } from 'react';
import {
    View,
    Text
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import Modal from 'react-native-modal';

import { CommonStyles } from '../../styles/CommonStyles';
import { Strings } from '../../config/Strings';
import CustomButton from './CustomButton';
import { applyOpacity, black } from '../../styles/colors';

class ConfirmModal extends PureComponent {
    constructor(props) {
        super(props)
    };

    render() {
        const {
            text14
        } = CommonStyles;

        return (
            <Modal
                isVisible={this.props.isModalVisible}
                onBackdropPress={this.props.toggleModal}
                swipeDirection={['down']}
                onSwipeComplete={this.props.toggleModal}
                backdropColor={applyOpacity(black, 0.5)}
                style={styles.modalContainer}
            >
                <View style={styles.innerModalContainer}
                >
                    <Text style={text14}>{this.props.text}</Text>
                    <View style={styles.containerBtnModal}>
                        <CustomButton
                            onPress={this.props.toggleModal}
                            secondaryButton
                            text={Strings.label_no}
                            icon={'close-outline'}
                        />
                        <CustomButton
                            onPress={this.props.action}
                            text={Strings.label_yes}
                            icon={'checkmark-outline'}
                        />
                    </View>
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
    innerModalContainer: {
        backgroundColor: 'white',
        paddingHorizontal: '20@s',
        paddingVertical: '25@s',
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerBtnModal: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginTop: '20@s',
        marginBottom: '10@s'
    }
});

export default ConfirmModal;