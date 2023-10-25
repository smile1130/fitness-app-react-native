import { ScaledSheet } from 'react-native-size-matters';
import { black, mainColor, white, red, gray, gray3, darkGray, applyOpacity } from './colors';
import { isAndroid } from '../config/Util';

export const CommonStyles = ScaledSheet.create({
    text150: {
        fontSize: '150@s',
        fontFamily: "Poppins-Regular"
    },
    text30: {
        fontSize: '30@s',
        fontFamily: "Poppins-Regular"
    },
    text26: {
        fontSize: '26@s',
        fontFamily: "Poppins-Regular"
    },
    text24: {
        fontSize: '24@s',
        fontFamily: "Poppins-Regular"
    },
    text22: {
        fontSize: '22@s',
        fontFamily: "Poppins-Regular"
    },
    text20: {
        fontSize: '20@s',
        fontFamily: "Poppins-Regular"
    },
    text18: {
        fontSize: '18@s',
        fontFamily: "Poppins-Regular"
    },
    text16: {
        fontSize: '16@s',
        fontFamily: "Poppins-Regular"
    },
    text14: {
        fontSize: '14@s',
        fontFamily: "Poppins-Regular"
    },
    text13: {
        fontSize: '13@s',
        fontFamily: "Poppins-Regular"
    },
    text12: {
        fontSize: '12@s',
        fontFamily: "Poppins-Regular"
    },
    text11: {
        fontSize: '11@s',
        fontFamily: "Poppins-Regular"
    },
    text10: {
        fontSize: '10@s',
        fontFamily: "Poppins-Regular"
    },
    text9: {
        fontSize: '9@s',
        fontFamily: "Poppins-Regular"
    },
    whiteText: {
        color: white
    },
    dangerText: {
        color: red
    },
    grayText: {
        color: gray
    },
    gray3Text: {
        color: gray3
    },
    darkGrayText: {
        color: darkGray
    },
    blackText: {
        color: black
    },
    mainText: {
        color: mainColor
    },
    textCenter: {
        textAlign: 'center'
    },
    textWrap: {
        flex: 1,
        flexWrap: 'wrap'
    },
    textRegular: {
        fontFamily: "Poppins-Regular"
    },
    textBold: {
        fontFamily: "Poppins-Bold"
    },
    textExtraBold: {
        fontFamily: "Poppins-Bold"
    },
    textTitle: {
        fontSize: '18@s',
        fontWeight: '800',
        color: mainColor
    },
    textShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    textInput: {
        flex: 1,
        backgroundColor: 'transparent',
        color: white,
        height: '45@s',
        paddingHorizontal: '15@s',
        fontSize: '13@s'
    },
    textInputBlack: {
        color: black
    },
    textUppercase: {
        textTransform: 'uppercase'
    },
    boxShadowLight: {
        shadowColor: isAndroid ? applyOpacity(black, 0.5) : black,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.5,
        elevation: 3,
    },
    boxShadowLightMainColor: {
        shadowColor: isAndroid ? applyOpacity(mainColor, 0.5) : mainColor,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.5,
        elevation: 3,
    },
    boxShadowLightNoTopShadow: {
        shadowColor: isAndroid ? applyOpacity(black, 0.5) : black,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.03,
        shadowRadius: 3.68,
        elevation: 3,
    },
    boxShadowDark: {
        shadowColor: black,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 6.68,
        elevation: 3,
    },
    textUnderline: {
        textDecorationLine: 'underline'
    }
});