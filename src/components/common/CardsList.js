import React from 'reactn';
import {
    Text,
    View,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';

import { mainColor, white, darkGray, gray2 } from '../../styles/colors';
import { CommonStyles } from '../../styles/CommonStyles';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const CardsList = (
    {
        items,
        labelStyle = null,
        itemStyle = null,
        onRefresh
    }) => {

    const [cards, setCards] = useState(items);
    const navigation = useNavigation();

    useEffect(() => {
        setCards(items);
    }, [items]);

    const handlePressItem = (item, index) => {
        if (item.route) {

            navigation.navigate(item.route);
            return;
        }

        toggleActiveFromIndex(index);
    }

    const toggleActiveFromIndex = (index) => {
        const updatedCards = [...cards];
        updatedCards[index].active = !updatedCards[index].active;

        setCards(updatedCards);
    }

    const renderInnerItem = (item, innerItem, innerIndex) => {
        const {
            text16,
            textBold,
            darkGrayText,
            whiteText
        } = CommonStyles;

        if (React.isValidElement(innerItem)) {
            return (
                <React.Fragment
                    key={innerIndex}
                >
                    <View
                        style={[
                            styles.innerItem,
                            innerIndex !== item.items.length - 1 ? styles.innerItemBorder : null
                        ]}
                    >
                        {innerItem}
                    </View>
                </React.Fragment>
            );
        }

        return (
            <TouchableOpacity
                style={[
                    styles.innerItem,
                    innerIndex !== item.items.length - 1 ? styles.innerItemBorder : null
                ]}
                key={innerIndex}
                activeOpacity={0.8}
                onPress={() => handlePressItem(innerItem, innerIndex)}
            >
                {
                    innerItem.icon &&
                    <View style={styles.containerItemIcon}>
                        <Icon
                            name={innerItem.icon}
                            color={innerItem.active ? white : mainColor}
                            size={scale(20)}
                        />
                    </View>
                }
                <Text style={[
                    text16,
                    textBold,
                    innerItem.active ? whiteText : darkGrayText
                ]}>
                    {innerItem.label}
                </Text>
            </TouchableOpacity>
        );
    }

    const renderItem = ({ item, index }) => {
        const {
            text20,
            textBold,
            darkGrayText,
            boxShadowLight,
            boxShadowLightMainColor,
            whiteText
        } = CommonStyles;

        return (
            <View>
                <TouchableOpacity
                    style={[
                        boxShadowLight,
                        styles.item,
                        item.active ? styles.itemActive : null,
                        itemStyle
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handlePressItem(item, index)}
                >
                    <View style={styles.itemInner}>
                        {
                            item.icon &&
                            <View style={styles.containerItemIcon}>
                                <Icon
                                    name={item.icon}
                                    color={item.active ? white : mainColor}
                                    size={scale(28)}
                                />
                            </View>
                        }
                        <Text style={[
                            text20,
                            item.active ? whiteText : darkGrayText,
                            labelStyle,
                            textBold
                        ]}>
                            {item.label}
                        </Text>
                    </View>
                    {
                        item.items &&
                        <Icon
                            name={item.active ? 'chevron-up' : 'chevron-down'}
                            color={item.active ? white : darkGray}
                            size={scale(26)}
                        />
                    }
                </TouchableOpacity>
                {
                    item.active &&
                    <View style={[styles.dropdownItem, boxShadowLightMainColor]}>
                        {
                            item.items.map((innerItem, innerIndex) => (
                                renderInnerItem(item, innerItem, innerIndex)
                            ))
                        }
                    </View>
                }
            </View>
        )
    }

    return (
        <FlatList
            data={cards}
            extraData={cards}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.containerItems}
            onRefresh={onRefresh}
            refreshing={!cards}
        />
    )
}

const styles = ScaledSheet.create({
    containerItems: {
        padding: '15@s'
    },
    item: {
        marginVertical: '7@s',
        backgroundColor: white,
        borderRadius: '10@s',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '15@s'
    },
    itemActive: {
        backgroundColor: mainColor,
        zIndex: 1
    },
    itemInner: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    innerItem: {
        flexDirection: 'row',
        paddingVertical: '20@s'
    },
    innerItemBorder: {
        borderBottomWidth: '1@s',
        borderBottomColor: gray2,
    },
    containerItemIcon: {
        marginRight: '25@s'
    },
    dropdownItem: {
        zIndex: 0,
        backgroundColor: white,
        marginTop: '-20@s',
        paddingTop: '10@s',
        paddingHorizontal: '20@s',
        borderBottomLeftRadius: '10@s',
        borderBottomRightRadius: '10@s',
        marginBottom: '5@s'
    }
});

export default CardsList;