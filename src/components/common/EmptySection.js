import React, { PureComponent } from 'react';
import {
    View,
    Text
} from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import { darkGray } from '../../styles/colors';
import { CommonStyles } from '../../styles/CommonStyles';

class EmptySection extends PureComponent {
    constructor(props) {
        super(props);
    };
    
    render() {
        const {
            text10,
            darkGrayText,
            textCenter
        } = CommonStyles;

        return (
            <View style={[styles.container, this.props.style]}>
                <Icon
                    name={this.props.icon}
                    size={scale(16)}
                    style={styles.icon}
                    color={darkGray}
                />
                <Text style={[text10, darkGrayText, textCenter]}>{this.props.text}</Text>
            </View>
        )
    }
}

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginBottom: '5@s'
    }
});

export default EmptySection;