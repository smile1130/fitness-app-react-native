import React, { useEffect, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

import { CommonStyles } from '../../styles/CommonStyles';
import { gray, darkGray, white, black, gray2 } from '../../styles/colors';

const InputBorder = ({
    marginTopInput,
    inputStyle,
    label,
    labelStyle,
    placeholder,
    text,
    handleValue,
    autoCapitalize = 'none',
    textColor,
    bgColor,
    borderColor,
    editable = true,
    keyboardType = 'default',
    multiline = false
}) => {
    const [inputText, setInputText] = useState(text || '');

    useEffect(() => {
        setInputText(text || '');
    }, [text]);

    const handleInputChange = (text) => {
        setInputText(text);
        handleValue(text);
    };

    const {
        text13,
        text12
    } = CommonStyles;

    return (
        <View
            style={marginTopInput ? styles.mainContainer : null}
            pointerEvents={editable ? 'auto' : 'none'}
        >
            {label && <Text style={[text13, styles.label, labelStyle]}>{label}</Text>}
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={gray}
                value={inputText}
                onChangeText={handleInputChange}
                autoCapitalize={autoCapitalize}
                style={[
                    text12,
                    styles.input,
                    multiline ? styles.multiline : styles.singleLine,
                    inputStyle,
                    {
                        color: textColor || black,
                        backgroundColor: bgColor || white,
                        borderColor: borderColor || gray2,
                    }
                ]}
                editable={editable}
                keyboardType={keyboardType}
                multiline={multiline}
                textAlignVertical={multiline ? 'top' : 'auto'}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    mainContainer: {
        marginTop: '20@s'
    },
    input: {
        paddingHorizontal: '10@s',
        borderWidth: '1@s',
        borderRadius: '6@s'
    },
    singleLine: {
        height: '40@s'
    },
    multiline: {
        minHeight: '80@s',
        paddingVertical: '6@s',
        maxHeight: '160@s'
    },
    label: {
        color: darkGray,
        marginBottom: '5@s'
    }
});

export default InputBorder;
