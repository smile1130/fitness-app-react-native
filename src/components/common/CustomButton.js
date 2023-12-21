import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Animated } from 'react-native';
import { scale, ScaledSheet } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';

import { black, gray, gray2, mainColor, white } from '../../styles/colors';
import { CommonStyles } from '../../styles/CommonStyles';

const CustomButton = ({
    onPress,
    text,
    icon,
    iconSize,
    iconColor,
    disabled,
    isAbsolute,
    smallButton,
    showSpinner,
    containerStyle,
    textStyle,
    secondaryButton,
    blackButton,
    grayButton,
    whiteButton
}) => {
    const {
        whiteText,
        text14,
        text10,
        mainText,
        textCenter,
        boxShadowLight,
        textBold,
        grayText
    } = CommonStyles;

    const buttonStyle = [
        style.mainContainer,
        containerStyle,
        isAbsolute ? { ...style.absoluteButton, ...boxShadowLight } : null,
        smallButton ? style.smallButton : null,
        secondaryButton ? style.secondaryButton : null,
        blackButton ? style.blackBtn : null,
        grayButton ? style.grayBtn : null,
        whiteButton ? style.whiteBtn : null
    ];

    const buttonTextStyles = [
        secondaryButton ? mainText : (whiteButton ? null : (grayButton ? grayText : whiteText)),
        textCenter,
        smallButton ? text10 : text14,
        textBold,
        textStyle
    ];

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

    const isDisabled = disabled || showSpinner;
    const disabledStyle = isDisabled ? style.disabledStyle : null;

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.9}
            disabled={isDisabled || false}
            style={[buttonStyle, animatedScaleStyle, disabledStyle]}
        >
            <Text style={buttonTextStyles}>{text}</Text>
            {showSpinner && <ActivityIndicator size={'small'} color={white} style={style.indicator} />}
            {icon && !showSpinner && (
                <Icon
                    name={icon}
                    size={iconSize || scale(18)}
                    color={iconColor || (secondaryButton ? mainColor : (whiteButton ? black : (grayButton ? gray : white)))}
                    style={style.icon}
                />
            )}
        </TouchableOpacity>
    );
};

const style = ScaledSheet.create({
    mainContainer: {
        backgroundColor: mainColor,
        borderWidth: '1@s',
        borderColor: mainColor,
        paddingHorizontal: '13@s',
        paddingVertical: '7@s',
        borderRadius: '20@s',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    indicator: {
        marginLeft: '8@s'
    },
    icon: {
        marginLeft: '5@s'
    },
    absoluteButton: {
        position: 'absolute',
        bottom: '20@s',
        borderRadius: '20@s',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: mainColor,
        right: '20@s',
        zIndex: 10
    },
    secondaryButton: {
        backgroundColor: white,
        borderWidth: '1@s',
        borderColor: mainColor
    },
    smallButton: {
        paddingVertical: '6@s'
    },
    blackBtn: {
        backgroundColor: black,
        borderWidth: '1@s',
        borderColor: black
    },
    grayBtn: {
        backgroundColor: gray2,
        borderWidth: '1@s',
        borderColor: gray2
    },
    whiteBtn: {
        backgroundColor: white,
        borderWidth: '1@s',
        borderColor: white
    },
    disabledStyle: {
        opacity: 0.7
    }
});

export default CustomButton;