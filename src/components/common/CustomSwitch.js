import React, { PureComponent } from 'react';
import {
    View,
    Text,
    Switch
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

import { CommonStyles } from '../../styles/CommonStyles';
import { darkGray, white, mainColor, gray2 } from '../../styles/colors';

class CustomSwitch extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            value: this.props.value || false
        }
    };

    handleValue = (value) => {
        this.setState({
            value
        }, () => {
            this.props.handleValue(this.state.value);
        })
    }

    render() {
        const {
            text13,
            textRegular
        } = CommonStyles;

        return (
            <View style={styles.mainContainer}>
                <Text style={[text13, textRegular, styles.label]}>{this.props.label}</Text>
                <Switch
                    trackColor={{ false: gray2, true: mainColor }}
                    thumbColor={white}
                    ios_backgroundColor={gray2}
                    onValueChange={this.handleValue}
                    value={this.state.value}
                />
            </View>
        );
    }
}

const styles = ScaledSheet.create({
    mainContainer: {
        marginTop: '20@s',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    label: {
        color: darkGray
    }
});

export default CustomSwitch;