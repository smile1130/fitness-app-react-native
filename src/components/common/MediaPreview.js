import React, { PureComponent } from 'react';
import {
    View
} from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';

import { gray2, white } from '../../styles/colors';


class MediaPreview extends PureComponent {
    constructor(props) {
        super(props);
    };
    
    render() {
        return (
            <View style={[styles.container, {backgroundColor: this.props.background || gray2}]}>
                <Icon
                    name={this.props.icon}
                    size={this.props.size || scale(30)}
                    color={this.props.color || white}
                />
            </View>
        )
    }
}

const styles = ScaledSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '7@s'
    },
    icon: {
        marginBottom: '5@s'
    }
});

export default MediaPreview;