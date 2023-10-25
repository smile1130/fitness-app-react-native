import React from 'react';
import {
    TouchableOpacity,
    View,
    Text
} from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommonStyles } from '../../styles/CommonStyles';
import { applyOpacity, black, mainColor, mainColorLight, white } from '../../styles/colors';
import CustomLabel from './CustomLabel';

const CardWithIcon = ({
    title,
    subtitle,
    icon,
    handlePress,
    labelText,
    labelColor = mainColorLight,
    labelBold = true,
    labelTextColor = applyOpacity(black, 0.7)
}) => {
    const {
        text12,
        text11,
        textBold,
        grayText,
        boxShadowLight
    } = CommonStyles;

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.container, boxShadowLight]}
            onPress={handlePress}
        >
            <View style={styles.innerMedia}>
                <View style={styles.containerIcon}>
                    <Icon
                        name={icon}
                        size={scale(24)}
                        color={mainColor}
                    />
                </View>
            </View>
            <View style={styles.containerTexts}>
                <Text style={[text12, textBold]}>{title}</Text>
                {
                    subtitle &&
                    <Text style={[text11, grayText, styles.dateLabel]}>{subtitle}</Text>
                }
            </View>
            {
                labelText &&
                <View>
                    <CustomLabel
                        text={labelText}
                        background={labelColor}
                        boldText={labelBold}
                        textColor={labelTextColor}
                    />
                </View>
            }
        </TouchableOpacity>
    );
}

const styles = ScaledSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: white,
        marginBottom: '15@s',
        marginHorizontal: '15@s',
        borderRadius: '15@s',
        padding: '7@s',
    },
    containerIcon: {
        width: '40@s',
        height: '40@s',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: mainColorLight,
        borderRadius: '10@s'
    },
    innerMedia: {
        marginRight: '10@s'
    },
    dateLabel: {
        marginTop: '3@s'
    },
    containerTexts:{
        flex: 1,
        justifyContent: 'center'
    }
});

export default CardWithIcon;
