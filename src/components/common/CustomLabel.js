import React from 'react';
import {
    View,
    Text
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { CommonStyles } from '../../styles/CommonStyles';
import { mainColor, white } from '../../styles/colors';

const CustomLabel = ({
    text,
    background = mainColor,
    boldText = true,
    textColor = white,
    large = false
}) => {
    const {
        text10,
        text12,
        textBold
    } = CommonStyles;

    return (
        <View style={[
            styles.label,
            large ? styles.labelLarge : null,
            {
                backgroundColor: background
            }
        ]}>
            <Text style={[
                large ? text12 : text10,
                boldText ? textBold : null,
                {
                    color: textColor
                }
            ]}>
                {text}
            </Text>
        </View>
    );
}

const styles = ScaledSheet.create({
    label: {
        borderRadius: '8@s',
        paddingVertical: '4@s',
        paddingHorizontal: '8@s',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '10@s'
    },
    labelLarge: {
        borderRadius: '15@s',
        paddingHorizontal: '15@s',
        paddingVertical: '6@s',
    }
});

export default CustomLabel;
