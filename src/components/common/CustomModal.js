import React, { useEffect, useState } from 'react';
import { View, Text, KeyboardAvoidingView, TouchableOpacity, Keyboard } from 'react-native';
import Modal from 'react-native-modal';
import { applyOpacity, black, white } from '../../styles/colors';
import { ScaledSheet } from 'react-native-size-matters';
import { CommonStyles } from '../../styles/CommonStyles';
import { Strings } from '../../config/Strings';
import CustomButton from './CustomButton';
import { isAndroid } from '../../config/Util';

const CustomModal = ({
    visible,
    title,
    subtitle,
    onCancel,
    onConfirm,
    confirmText = Strings.label_yes,
    confirmIcon = 'checkmark-outline',
    children
}) => {
    const [isKeyboardOpen, setKeyboardOpen] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardOpen(true);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardOpen(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handleMainPress = () => {
        return isKeyboardOpen ? Keyboard.dismiss() : onCancel();
    }

    const handleViewPress = (event) => {
        Keyboard.dismiss()
        event.stopPropagation();
    };

    const {
        text14,
        text12,
        textBold,
        textCenter
    } = CommonStyles;

    return (
        <Modal
            isVisible={visible}
            animationIn="zoomIn"
            animationOut="fadeOut"
            onBackdropPress={onCancel}
            style={styles.flex1}
            backdropColor={applyOpacity(black, 0.5)}
            useNativeDriverForBackdrop
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={handleMainPress}
                style={styles.flex1}
            >
                <KeyboardAvoidingView
                    style={styles.keyboardContainer}
                    behavior={!isAndroid ? 'padding' : null}
                >
                    <TouchableOpacity
                        style={styles.modalContent}
                        onPress={handleViewPress}
                        activeOpacity={1}
                    >
                        <Text style={[text14, textCenter, textBold]}>{title}</Text>
                        {
                            subtitle &&
                                <Text style={[text12, styles.subtitle]}>{subtitle}</Text>
                        }
                        <View style={styles.content}>{children}</View>
                        <CustomButton
                            onPress={onConfirm}
                            text={confirmText}
                            icon={confirmIcon}
                            containerStyle={styles.button}
                        />
                        <CustomButton
                            onPress={onCancel}
                            secondaryButton
                            text={Strings.label_undo}
                            icon={'close-outline'}
                            containerStyle={styles.button}
                        />
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = ScaledSheet.create({
    flex1: {
        flex: 1
    },
    keyboardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: white,
        borderRadius: '10@s',
        padding: '20@s',
        width: '90%',
    },
    subtitle: {
        marginTop: '15@s'
    },
    content: {
        marginVertical: '25@s',
    },
    button: {
        marginTop: '10@s'
    }
});

export default CustomModal;