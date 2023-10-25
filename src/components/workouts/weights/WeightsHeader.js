import React, { PureComponent } from 'react';
import { useNavigation } from '@react-navigation/native';
import TitleComponent from '../../common/TitleComponent';

class WeightsHeader extends PureComponent {
    handleBack = () => {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <TitleComponent
                title={this.props.exercise.name}
                handleBack={this.handleBack}
            />
        )
    };
}

export default function(props) {
    const navigation = useNavigation();
  
    return <WeightsHeader {...props} navigation={navigation} />;
}