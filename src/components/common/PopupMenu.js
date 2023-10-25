import React from 'react';
import {
    View,
    Text,
    Keyboard
} from 'react-native';
import { scale, ScaledSheet } from 'react-native-size-matters';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Ionicons';

import { gray2, mainColor, white } from '../../styles/colors';
import { CommonStyles } from '../../styles/CommonStyles';
import { Strings } from '../../config/Strings';

const PopupMenu = ({
    options,
    showLabel = true,
    isCustomIcon = false,
    icon = 'add-outline',
    handlePress
}) => {
    const onOpen = () => {
        Keyboard.dismiss();
    }

    const renderedMenuOptions = options.map((item, index) => (
        <MenuOption
            key={index}
            onSelect={() => handlePress(item.key || index)}
            customStyles={{
                optionTouchable: { underlayColor: 'rgba(170,170,170,0.1)' },
                optionWrapper: index !== options.length - 1 ? styles.containerMenuOption : null
            }}
        >
            <View style={styles.innerMenuOption}>
                <Icon
                    name={item.icon}
                    size={scale(20)}
                    style={styles.innerMenuOptionIcon}
                />
                <Text style={CommonStyles.text14}>{item.text}</Text>
            </View>
        </MenuOption>
    ));

    return (
        <Menu onOpen={onOpen}>
            <MenuTrigger
                customStyles={{
                    triggerWrapper: [
                        styles.containerUploadIcon,
                        showLabel ? styles.containerUploadWithLabel : null,
                        isCustomIcon ? styles.isCustomIcon : null
                    ],
                    triggerTouchable: {
                        underlayColor: 'none',
                        activeOpacity: 0.5,
                        hitSlop: {
                            top: 15,
                            bottom: 15,
                            left: 15,
                            right: 15
                        }
                    }
                }}
            >
                {
                    showLabel &&
                        <Text style={[CommonStyles.whiteText, CommonStyles.text14, CommonStyles.textBold]}>{Strings.label_upload_attachment}</Text>
                }
                <Icon
                    name={icon}
                    size={isCustomIcon ? scale(17) : scale(20)}
                    color={white}
                />
            </MenuTrigger>
            <MenuOptions optionsContainerStyle={styles.menuOptions}>
                {renderedMenuOptions}
            </MenuOptions>
        </Menu>
    );
}

const styles = ScaledSheet.create({
	containerUploadIcon: {
        flexDirection: 'row',
        borderRadius: '5@s',
        padding: '8@s',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: mainColor
    },
    containerUploadWithLabel: {
        borderRadius: '20@s',
    },
    isCustomIcon: {
        width: '26@s',
        height: '26@s',
        borderRadius: '13@s',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        marginBottom: '5@s'
    },
    menuOptions: {
        borderRadius: '7@s',
        backgroundColor: white,
        top: '20@s',
        shadowRadius: 50,
        elevation: 0,
        shadowOffset: { width: 0, height: 0 }
    },
    innerMenuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: '5@s'
    },
    innerMenuOptionIcon: {
        marginRight: '10@s'
    },
    containerMenuOption: {
        borderBottomWidth: 1,
        borderColor: gray2
    }
});

export default PopupMenu;