import React, { PureComponent } from 'reactn';
import {
    View,
    Text
} from 'react-native';
import { scale, ScaledSheet } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommonStyles } from '../../../styles/CommonStyles';
import { Strings } from '../../../config/Strings';
import { useNavigation } from '@react-navigation/native';
import UploadMedias from '../../common/UploadMedias';
import { mainColor } from '../../../styles/colors';
import MediasList from '../../common/MediasList';

class WeightAttachments extends PureComponent {
    constructor(props) {
        super(props);
    };

    render = () => {
        const {
            text14,
            textBold
        } = CommonStyles;

        return (
            <View style={styles.containerFiles}>
                <Text style={[text14, textBold]}>
                    {Strings.label_attachments} {this.props.exerciseName}
                </Text>
                {
                    this.props.files && this.props.files.length > 0 &&
                    <View style={styles.containerMedias}>
                        <MediasList
                            medias={this.props.files}
                        />
                    </View>
                }
                <View style={styles.uploadBtn}>
                    <UploadMedias
                        handleFileChange={this.props.handleMedia}
                    />
                </View>
            </View>
        )
    }
}

const styles = ScaledSheet.create({
    containerFiles: {
        marginTop: '15@s'
    },
    containerMedias: {
        marginTop: '10@s'
    },
    uploadBtn: {
        marginTop: '10@s'
    }
});

export default function(props) {
    const navigation = useNavigation();
  
    return <WeightAttachments {...props} navigation={navigation} />;
};