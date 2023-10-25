import React, { useState } from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity
} from 'react-native';
import Modal from 'react-native-modal';
import { applyOpacity, black, gray2, white } from '../../styles/colors';
import { ScaledSheet } from 'react-native-size-matters';
import { CommonStyles } from '../../styles/CommonStyles';
import { screenHeight } from '../../config/Util';
import InputBorder from './InputBorder';

const CustomSelectModal = ({
    defaultSelected = null,
    placeholder = null,
    label,
    items,
    onSelect,
    marginTopInput = false
}) => {
    const [selected, setSelected] = useState(defaultSelected);
    const [visible, setVisible] = useState(false);

    const onShow = () => {
        setVisible(true);
    }

    const onCancel = () => {
        setVisible(false);
    }

    const onPressItem = (item) => {
        setSelected(item);
        onSelect(item.value);
        onCancel();
    }

    const {
        text14,
        textBold
    } = CommonStyles;

    return (
        <View style={marginTopInput ? styles.marginTopContainer : null}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onShow}
            >
                <InputBorder
                    label={label || null}
                    placeholder={placeholder}
                    text={selected ? selected.label : null}
                    editable={false}
                />
            </TouchableOpacity>
            
            <Modal
                isVisible={visible}
                animationIn="zoomIn"
                animationOut="fadeOut"
                onBackdropPress={onCancel}
                style={styles.modalContainer}
                backdropColor={applyOpacity(black, 0.5)}
                useNativeDriverForBackdrop
            >
                <View style={styles.modalContent}>
                    <ScrollView>
                        {
                            items.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.containerItem, index === items.length - 1 ? null : styles.containerItemBorder]}
                                    onPress={() => onPressItem(item)}
                                >
                                    <Text style={[text14, textBold]}>{item.label}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
};

const styles = ScaledSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    marginTopContainer: {
        marginTop: '20@s'
    },
    modalContent: {
        backgroundColor: white,
        borderRadius: '10@s',
        paddingVertical: '5@s',
        width: '90%',
        maxHeight: screenHeight * 0.75
    },
    containerItem: {
        paddingVertical: '12@s',
        paddingHorizontal: '20@s'
    },
    containerItemBorder: {
        borderBottomWidth: '1@s',
        borderBottomColor: gray2
    }
});

export default CustomSelectModal;