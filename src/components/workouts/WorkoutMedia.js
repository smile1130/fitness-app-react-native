import React, { PureComponent } from 'react';
import {
    View
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import HtmlCustom from '../common/HtmlCustom';
import MediasList from '../common/MediasList';

class WorkoutMedia extends PureComponent {
    constructor(props) {
        super(props);
    };

    render() {
        return (
            <View style={styles.containerWM}>
                {
                    this.props.linkedExercises &&
                        <View style={styles.containerAssets}>
                            <MediasList
                                medias={this.props.linkedExercises.assets}
                            />
                        </View>
                }
                <HtmlCustom html={this.props.exercise.description} />
            </View>
        )
    }
}

const styles = ScaledSheet.create({
    containerWM: {
        marginTop: '10@s',
        marginBottom: '20@s'
    },
    containerAssets: {
        marginBottom: '10@s'
    }
});

export default WorkoutMedia;