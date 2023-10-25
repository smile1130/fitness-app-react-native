import React from 'react';
import {
    Animated,
    TouchableOpacity
} from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import { mainColor, white } from '../../styles/colors';

const CustomButtonIcon = ({
    onPress,
    icon = 'trash-outline',
    bgColor = mainColor,
    isAbsolute = false,
    disabled = false,
    customStyle,
    iconStyle
}) => {
    const animatedValue = new Animated.Value(1);

    const handlePressIn = () => {
        Animated.spring(animatedValue, {
            toValue: 0.92,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(animatedValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const animatedScaleStyle = {
        transform: [{ scale: animatedValue }],
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.9}
            disabled={disabled}
            style={[
                animatedScaleStyle,
                styles.containerRemove,
                isAbsolute ? styles.isAbsolute : null,
                customStyle,
                {
                    backgroundColor: bgColor
                }
            ]}
            hitSlop={{
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            }}
        >
            <Icon
                name={icon}
                size={scale(15)}
                color={white}
                style={[styles.icon, iconStyle]}
            />
        </TouchableOpacity>

    );
}

const styles = ScaledSheet.create({
    containerRemove: {
        width: '26@s',
        height: '26@s',
        borderRadius: '13@s',
        justifyContent: 'center',
        alignItems: 'center'
    },
    isAbsolute: {
        position: 'absolute',
        zIndex: 10,
        top: '5@s',
        right: '5@s'
    },
    icon: {
        marginLeft: '1@s'
    }
});

export default CustomButtonIcon;
