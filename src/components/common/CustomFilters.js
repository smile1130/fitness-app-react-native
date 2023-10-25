import React from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { mainColor, white } from '../../styles/colors';
import { CommonStyles } from '../../styles/CommonStyles';
import { ScaledSheet, scale } from 'react-native-size-matters';

const CustomFilters = ({
    filters,
    onPress,
    currentKey
}) => {
    const {
        textBold,
        textCenter,
        text14
    } = CommonStyles;

    return (
        <View style={styles.containerMainTab}>
            {
                filters.map((filter, index) => {
                    return (
                        <TouchableOpacity
                            style={[
                                styles.container,
                                {
                                    marginRight: (index + 1) !== filters.length ? scale(10) : 0 
                                }
                            ]}
                            key={filter.key}
                            onPress={() => onPress(filter.key)}
                            activeOpacity={0.8}
                            hitSlop={{
                                top: 10,
                                bottom: 10,
                                right: 10,
                                left: 10
                            }}
                        >
                            <View style={[
                                styles.containerInner,
                                {
                                    backgroundColor: currentKey === filter.key ? mainColor : white
                                }
                            ]}>
                                <Text style={[
                                    textCenter,
                                    text14,
                                    textBold,
                                    {
                                        color: currentKey === filter.key ? white : mainColor
                                    }
                                ]}>
                                    {filter.title}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    );
}

const styles = ScaledSheet.create({
    container: {
        flex: 1
    },
    containerInner: {
        paddingVertical: '7@s',
        borderRadius: '10@s',
        borderWidth: '1@s',
        borderColor: mainColor
    },
    containerMainTab: {
        flexDirection: 'row',
        marginBottom: '20@s',
        marginHorizontal: '15@s'
    }
});

export default CustomFilters;
