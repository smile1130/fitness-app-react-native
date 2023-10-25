import React, { PureComponent } from 'react';
import {
    View,
    SafeAreaView
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

import { gray2 } from '../../styles/colors';

class ComponentWithBackground extends PureComponent {
    constructor(props) {
        super(props)
    };

    renderContent = () => {
        if(this.props.safeAreaEnabled) {

            const extraStyle = this.props.backGray ? { backgroundColor: gray2 } : null;
            
            return (
                <SafeAreaView style={[style.innerContent, extraStyle]}>
                    { this.props.children }
                </SafeAreaView>
            )
        }

        return (
            <View style={style.innerContent}>
                { this.props.children }
            </View>
        );
    }

    render() {
        return (
            <View style={style.mainContainer}>
                { this.renderContent() }
            </View>
        );
    }
}

const style = ScaledSheet.create({
	mainContainer: {
        flex: 1
    },
    innerContent: {
        flex: 1
    }
});

export default ComponentWithBackground;