import React, { PureComponent } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { scale, ScaledSheet } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';

import { CommonStyles } from '../../styles/CommonStyles';
import { gray3, mainColor, white } from '../../styles/colors';
import { Strings } from '../../config/Strings';
import { useNavigation } from '@react-navigation/native';
import CustomLabel from '../common/CustomLabel';


class WorkoutDayCard extends PureComponent {
    constructor(props) {
        super(props);
    };

    goToDetail = () => {
        this.props.navigation.navigate('WorkoutDetail', {
            id: this.props.workout.id
        });
    }

    renderWorkoutDate = () => {
        if (this.props.hideWorkoutDate) {
            return;
        }

        const {
            darkGrayText,
            text10,
            textBold,
            mainText
        } = CommonStyles;

        return (
            <View style={styles.containerWeek}>
                <Icon
                    name={'calendar'}
                    size={13}
                    color={mainColor}
                    style={styles.icon}
                />
                <Text style={[text10, mainText]}>
                    <Text style={textBold}>{this.props.workout.date_day} {this.props.workout.date_month}</Text>
                    <Text style={darkGrayText}>{'  '}({Strings.label_week} {this.props.workout.weekNumber})</Text>
                </Text>
            </View>
        )
    }

    render() {
        const {
            darkGrayText,
            text12,
            text14,
            textBold,
            boxShadowLight
        } = CommonStyles;

        return (
            <TouchableOpacity
                onPress={this.goToDetail}
                style={[styles.container, this.props.index === 0 ? styles.firstElement : null, boxShadowLight]}
                activeOpacity={1}
            >
                <View style={styles.containerInner}>
                    <View style={styles.mainContainerDate}>
                        <CustomLabel
                            text={(`${Strings.label_day} ${this.props.workout.dayNumber}`).toUpperCase()}
                        />
                        {this.renderWorkoutDate()}
                    </View>
                    <View style={styles.mainContainerInfo}>
                        <View style={styles.containerInfo}>
                            <Text style={[text14, textBold]}>{this.props.workout.name}</Text>
                            <View style={styles.containerExercises}>
                                <Icon
                                    name={'barbell-outline'}
                                    size={scale(14)}
                                    color={gray3}
                                    style={styles.icon}
                                />
                                <Text style={[text12, darkGrayText]}>
                                    {Strings.formatString(Strings.label_n_exercises, this.props.workout.exercises_count)}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.containerArrow} activeOpacity={0.8} onPress={this.goToDetail}>
                            <Icon
                                name={'chevron-forward-outline'}
                                size={scale(30)}
                                color={white}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: white,
        flexDirection: 'row',
        padding: '15@s',
        borderRadius: '10@s',
        marginTop: '20@s',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: '15@s'
    },
    firstElement: {
        marginTop: '10@s'
    },
    containerInner: {
        flex: 1
    },
    mainContainerDate: {
        flexDirection: 'row'
    },
    mainContainerInfo: {
        flexDirection: 'row',
        marginTop: '15@s'
    },
    containerInfo: {
        flex: 1,
        alignItems: 'flex-start',
        marginTop: '3@s',
        marginRight: '5@s'
    },
    containerExercises: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: '5@s'
    },
    containerWeek: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerArrow: {
        width: '46@s',
        height: '46@s',
        backgroundColor: mainColor,
        borderRadius: '8@s',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        marginRight: '5@s'
    }
});

export default function (props) {
    const navigation = useNavigation();

    return <WorkoutDayCard {...props} navigation={navigation} />;
}