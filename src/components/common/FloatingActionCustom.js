import React, {useState} from 'react';
import { View } from 'react-native';
import { applyOpacity, black, mainColor, white } from '../../styles/colors';
import { FloatingAction } from "react-native-floating-action";
import { ScaledSheet, scale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommonStyles } from '../../styles/CommonStyles';
import { isAndroid } from '../../config/Util';

const FloatingActionCustom = (props) => {
    const [visibleFloating, setVisibleFloating] = useState(false);

    const {
        handleItem,
        actions
    } = props;

    const finalActions = [];

    actions.forEach((element, index) => {
        finalActions.push({
            text: element.text,
            icon: <Icon name={element.icon} size={scale(20)} color={white} />,
            name: element.name,
            position: index + 1,
            buttonSize: scale(40),
            textColor: white,
            textBackground: mainColor,
            color: mainColor,
            margin: 5,
            textContainerStyle: styles.textContainer,
            textStyle: {...CommonStyles.text14, ...CommonStyles.textBold}
        })
    });

    const floatingVisible = visibleFloating ? styles.addProgressOpened : null;
    let androidStyle = null;

    if (isAndroid) {
        androidStyle = visibleFloating ? null : styles.androidWhenNotVisible;
    }
    
    return (
        <View style={[styles.addProgress, floatingVisible, androidStyle]}>
            <FloatingAction
                color={mainColor}
                actions={finalActions}
                buttonSize={scale(45)}
                onPressItem={handleItem}
                distanceToEdge={20}
                overlayColor={applyOpacity(black, 0.4)}
                onOpen={() => setVisibleFloating(true)}
                onClose={() => setVisibleFloating(false)}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    addProgress: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 10
    },
    addProgressOpened: {
        left: 0,
        top: 0
    },
    androidWhenNotVisible: {
        width: '70@s',
        height: '70@s'
    },
    textContainer: {
        height: '40@s',
        paddingHorizontal: '17@s',
        borderRadius: '20@s',
        justifyContent: 'center'
    }
});


export { FloatingActionCustom };
