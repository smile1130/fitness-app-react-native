import React from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommonStyles } from '../../styles/CommonStyles';
import { darkGray, mainColor, white } from '../../styles/colors';
import FastImage from 'react-native-fast-image';
import CustomButton from './CustomButton';

const TitleComponent = ({
    title,
    titleStyle = null,
    image = null,
    hideBack = false,
    handleBack,
    isButton = false,
    buttonText = null,
    icon = null,
    actionPress
}) => {
    const {
        text22,
        darkGrayText,
        textBold,
        textWrap,
        boxShadowLightNoTopShadow
    } = CommonStyles;

    renderAction = () => {
        if (isButton) {
            return (
                <CustomButton
                    onPress={actionPress}
                    text={buttonText}
                    icon={icon}
                />
            )
        } else if (icon) {
            return (
                <TouchableOpacity
                    onPress={actionPress}
                >
                    <Icon
                        name={icon}
                        size={scale(24)}
                        color={mainColor}
                    />
                </TouchableOpacity>
            )
        }
    }
    
    return (
        <View style={[boxShadowLightNoTopShadow, styles.containerTitle]}>
            <View style={styles.containerTitleInner}>
                {
                    !hideBack &&
                    <TouchableOpacity
                        onPress={handleBack}
                        hitSlop={{
                            top: 15,
                            right: 50,
                            bottom: 15,
                            left: 25
                        }}
                        style={styles.touchable}
                    >
                        <Icon
                            name={'chevron-back-outline'}
                            size={scale(24)}
                            solid
                            color={darkGray}
                        />
                    </TouchableOpacity>
                }
                <View style={styles.containerText}>
                    {
                        image &&
                        <FastImage
                            source={{
                                uri: image
                            }}
                            style={styles.image}
                        />
                    }
                    <Text style={[text22, darkGrayText, textBold, textWrap, titleStyle]}>{title}</Text>
                </View>
            </View>
            { renderAction() }
            
        </View>
    )
}

const styles = ScaledSheet.create({
    containerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20@s',
        paddingVertical: '10@s',
        paddingHorizontal: '15@s',
        backgroundColor: white
    },
    containerTitleInner: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    touchable: {
        zIndex: 1,
        marginRight: '15@s'
    },
    containerText: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        width: '30@s',
		height: '30@s',
		borderRadius: '15@s',
        marginRight: '10@s'
    }
});

export default TitleComponent;
