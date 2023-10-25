import React, { PureComponent } from 'reactn';
import {
    View,
    Text
} from 'react-native'
import { CommonStyles } from '../../styles/CommonStyles';

class FlashMessageCustomComponent extends PureComponent {
    constructor(props) {
        super(props);
    }

    render () {
        if (!this.props.percentage) {
            return null;
        }

        return (
            <View>
                <Text style={[CommonStyles.textBold, CommonStyles.text14, CommonStyles.whiteText]}>{this.props.percentage}%</Text>
            </View>
        );
    }
}

export default FlashMessageCustomComponent;