import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { mainColor } from '../../styles/colors';

const DOT_SIZE = 8;
const HALFT_DOT_SIZE = DOT_SIZE / 2;

class TabIcon extends PureComponent {
    render() {
        const {showDot, ...iconProps} = this.props;

        return (
            <View style={styles.container}>
                <Icon {...iconProps} />
                {!!showDot && <View style={styles.dot} />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    dot: {
        backgroundColor: mainColor,
        borderRadius: 1000,
        height: DOT_SIZE,
        position: 'absolute',
        right: -HALFT_DOT_SIZE,
        top: 0,
        width: DOT_SIZE,
    }
});

export default TabIcon;
