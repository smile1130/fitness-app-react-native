import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { black, gray, gray2, mainColor, white } from '../../styles/colors';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { CommonStyles } from '../../styles/CommonStyles';
import { Strings } from '../../config/Strings';

const SearchBar = ({
    style,
    placeholder = Strings.label_search,
    handleSearch
}) => {
    const [search, setSearch] = useState();
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const onChangeText = (search) => {
        setSearch(search);
        handleSearch(search);
    }

    const {
        textInput
    } = CommonStyles;

    return (
        <View style={[style, styles.mainContainer]}>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={gray}
                value={search}
                onChangeText={onChangeText}
                onFocus={handleFocus}
                onBlur={handleBlur}
                autoCapitalize='none'
                style={[textInput, styles.textInput, isFocused ? styles.textFocused : null]}
            />
            <TouchableOpacity
                style={styles.icon}
                onPress={() => onChangeText(null)}
                activeOpacity={search ? 0.8 : 1}
                hitSlop={{
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
                }}
            >
                <Icon
                    name={search ? 'close-outline' : 'search-outline'}
                    color={mainColor}
                    size={scale(20)}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = ScaledSheet.create({
    mainContainer: {
        height: '40@s',
    },
    textInput: {
        backgroundColor: gray2,
        borderRadius: '20@s',
        height: '40@s',
        color: black
    },
    textFocused: {
        backgroundColor: white,
        borderColor: mainColor,
        borderWidth: '1.2@s'
    },
    icon: {
        position: 'absolute',
        right: '10@s',
        top: '10@s',
        zIndex: 10
    }
});

export default SearchBar;
