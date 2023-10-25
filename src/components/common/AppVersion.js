import React, { PureComponent } from 'react';
import { Linking } from 'react-native';
import { Strings } from '../../config/Strings';
import { isAndroid } from '../../config/Util';
import { useNavigation } from '@react-navigation/native';
import ResponseMessage from './ResponseMessage';

class AppVersion extends PureComponent {
    constructor(props) {
        super(props);
    };

    openAppOnStore = () => {
        const url = isAndroid ?
            'https://play.google.com/store/apps/details?id=com.coachplus.app' :
            'https://apps.apple.com/it/app/coachplus/id1576158679';

        Linking.openURL(url);
    }
    
    render() {
        return (
            <ResponseMessage 
                title={Strings.label_update_app}
                description={Strings.label_update_app_desc}
                buttonText={Strings.label_update}
                onButtonPress={this.openAppOnStore}
                hasButton
            />
        )
    }
}

export default function(props) {
    const navigation = useNavigation();
  
    return <AppVersion {...props} navigation={navigation} />;
}