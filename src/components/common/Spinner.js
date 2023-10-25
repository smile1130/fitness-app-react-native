import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { mainColor } from '../../styles/colors';
import { CommonStyles } from '../../styles/CommonStyles';

const Spinner = (props) => {
    const {
        size,
        text,
        style,
        textStyle,
        colorSpin
    } = props;

    const {
        text11
    } = CommonStyles;
    
    return (
        <View style={[styles.containerStyle, style]}>
            <ActivityIndicator size={size || 'large'} color={colorSpin || mainColor} />
            {
                text &&
                    <Text style={[text11, textStyle]}>{text}</Text>
            }
        </View>
    );
};

const styles = {
    containerStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
};


export { Spinner };
