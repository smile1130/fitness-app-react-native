import React, { PureComponent } from 'react';
import {
    FlatList,
    View,
    RefreshControl
} from 'react-native';
import { setGlobal } from 'reactn';
import { ScaledSheet } from 'react-native-size-matters';
import { showMessage } from 'react-native-flash-message';
import ComponentWithBackground from '../common/ComponentWithBackground';
import { mainColor, mainColorDark } from '../../styles/colors';
import WorkoutService from '../../services/WorkoutService';
import { Spinner } from '../common/Spinner';
import ExerciseCard from './ExerciseCard';
import { GLOBAL_ACTIVE_KEEP_AWAKE, GLOBAL_REFRESH_WORKOUTS_LIST } from '../../state/StateInitializer';
import { useNavigation } from '@react-navigation/native';
import TimerModal from '../common/TimerModal';
import { getKeyFromExercise, removeLastWorkoutId, removeWorkoutWeightsDataAsync, setLastWorkoutId } from '../../config/Util';
import TitleComponent from '../common/TitleComponent';
import WorkoutTime from './WorkoutTime';
import CustomButton from '../common/CustomButton';
import { Strings } from '../../config/Strings';

class WorkoutDetail extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            workout: null,
            isTimerModalVisible: false,
            showWorkoutCompleted: false,
            isLoadingWorkoutCompleted: false
        };

        this.preRenderRefreshControl = this.renderRefreshControl();
    };

    componentDidMount() {
        this.loadWorkout();

        setGlobal({
            [GLOBAL_ACTIVE_KEEP_AWAKE]: true
        });

        setLastWorkoutId(this.props.route.params.id);
    }

    componentWillUnmount() {
        setGlobal({
            [GLOBAL_ACTIVE_KEEP_AWAKE]: false
        });

        removeLastWorkoutId();
    }

    setWorkoutState = (workout) => {
        let oldExercises = workout.exercises;
        let newExercises = [];
        let superSet = [];

        oldExercises.forEach(exercise => {
            if(
                exercise.supersetPosition &&
                (
                    superSet.length === 0 ||
                    superSet[superSet.length -1].supersetPosition === (exercise.supersetPosition - 1)
                )
            ) {
                superSet.push(exercise);
            } else {
                if (superSet.length > 0) {
                    newExercises.push(superSet);
                    superSet = [];
                }

                if (exercise.supersetPosition) {
                    superSet.push(exercise);
                } else {
                    newExercises.push(exercise);
                }
            }
        });

        if (superSet.length > 0) {
            newExercises.push(superSet);
        }

        workout.exercises = newExercises;

        this.setState({
            workout: workout
        });
    };

    loadWorkout = () => {
        const workoutId = this.props.route.params.id;
        
        WorkoutService.workout(workoutId)
        .then(data => {
            this.setWorkoutState(data.workout);
        }).catch(() => {
            removeLastWorkoutId();
            this.handleBack();
        });
    }

    showSuccessMessage = (message) => {
        // Refresh workouts list
        setGlobal({
            [GLOBAL_REFRESH_WORKOUTS_LIST]: true
        });

        // Show success message
        showMessage({
            message,
            type: "success",
        });

        // Go back
        this.handleBack();
    }

    removeAllWeightsStored = () => {
        this.state.workout.exercises.forEach(exercise => {
            const key = getKeyFromExercise(exercise);

            removeWorkoutWeightsDataAsync(key);
        });
    }

    handleMarkWorkoutCompleted = (seconds, feedback) => {
        const workoutId = this.props.route.params.id;

        const data = {
            seconds,
            feedback
        };

        this.setState({
            isLoadingWorkoutCompleted: true
        });

        WorkoutService.markWorkoutCompleted(workoutId, data)
        .then(data => {
            this.removeAllWeightsStored();
            this.showSuccessMessage(data.message);
        }).finally(() => {
            this.setState({
                isLoadingWorkoutCompleted: false
            });
        });
    }

    handleBack = () => {
        this.props.navigation.goBack();
    }

    handleTimer = (item, selectedIndex, seconds, isWork, showSetInsideTimer = true) => {
        this.setState({
            isTimerModalVisible: true,
            item,
            selectedIndex,
            seconds,
            isWork,
            showSetInsideTimer
        });
    }

    showTimer = (item, selectedIndex, weights, showSetInsideTimer) => {
        if (this.state.isTimerModalVisible) {
            return;
        }

        let seconds = null;
        let isWork = null;

        if(
            item.final_type !== 'reps' &&
            item.final_type !== 'ramp' &&
            item.value &&
            item.value > 0
        ) {
            isWork = true;
            seconds = item.value;
        } else {
            isWork = false;
            seconds = item.restValueSeconds;
        }

        this.setState({
            weights
        });

        this.handleTimer(item, selectedIndex, seconds, isWork, showSetInsideTimer)
    }

    onFinish = () => {
        this.setState({
            isTimerModalVisible: false
        }, () => {
            if (this.state.isWork) {
                if (this.state.item.restValueSeconds && this.state.item.restValueSeconds > 0) {
                    this.handleTimer(
                        this.state.item,
                        this.state.selectedIndex,
                        this.state.item.restValueSeconds,
                        false
                    );
                } else if (
                    this.state.selectedIndex !== this.state.weights.length &&
                    this.state.weights[this.state.selectedIndex + 1] &&
                    this.state.weights[this.state.selectedIndex + 1].exercise.value > 0
                ){
                    this.handleTimer(
                        this.state.weights[this.state.selectedIndex + 1].exercise,
                        this.state.selectedIndex + 1,
                        this.state.weights[this.state.selectedIndex + 1].exercise.value,
                        true
                    );
                }
            } else if (
                this.state.weights[this.state.selectedIndex + 1] &&
                this.state.weights[this.state.selectedIndex + 1].exercise &&
                this.state.weights[this.state.selectedIndex + 1].exercise.final_type !== 'reps' &&
                this.state.weights[this.state.selectedIndex + 1].exercise.final_type !== 'ramp' &&
                this.state.selectedIndex !== this.state.weights.length
            ) {
                this.handleTimer(
                    this.state.weights[this.state.selectedIndex + 1].exercise,
                    this.state.selectedIndex + 1,
                    this.state.weights[this.state.selectedIndex + 1].exercise.value && this.state.weights[this.state.selectedIndex + 1].exercise.value > 0 ? this.state.weights[this.state.selectedIndex + 1].exercise.value : this.state.weights[this.state.selectedIndex + 1].exercise.restValueSeconds,
                    this.state.weights[this.state.selectedIndex + 1].exercise.value && this.state.weights[this.state.selectedIndex + 1].exercise.value > 0 ? true : false
                );
            }
        });
    }

    renderRefreshControl = () => {
        return <RefreshControl refreshing={false} onRefresh={this.loadWorkout} colors={[mainColor, mainColorDark]} />
    }

    handleWorkoutCompleted = () => {
        this.setState({
            showWorkoutCompleted: true
        }, () => {
            setTimeout(() => {
                this.setState({
                    showWorkoutCompleted: false
                });
            }, 1500);
        });
    }

    renderActionBtn = () => {
        if (this.state.workout.completed) {
            return null;
        }

        return (
            <View style={styles.containerActionBtn}>
                <CustomButton
                    onPress={this.handleWorkoutCompleted}
                    text={Strings.label_workout_done}
                    icon={'checkmark-outline'}
                />
            </View>
        )
    }

    renderExercise = ({ item, index }) => {
        return (
            <ExerciseCard
                key={index}
                index={index}
                exercise={item}
                workout={this.state.workout}
                showTimer={this.showTimer}
            />
        );
    }

    renderHeader = () => {
        return (
            <TitleComponent
                title={this.state.workout.name}
                handleBack={this.handleBack}
            />
        )
    };

    renderTimer = () => {
        if (
            !this.state.isTimerModalVisible
        ) {
            return null;
        }

        const currentSet = this.state.weights[this.state.selectedIndex].set || (this.state.selectedIndex + 1);

        return (
            <TimerModal
                onFinish={this.onFinish}
                isModalVisible={this.state.isTimerModalVisible}
                title={this.state.item.name}
                seconds={this.state.seconds}
                currentSet={currentSet}
                isWork={this.state.isWork}
                showSetInsideTimer={this.state.showSetInsideTimer}
            />
        )
    }

    renderWorkoutTime = () => {
        if (this.state.workout.completed) {
            return null;
        }

        return (
            <WorkoutTime
                workout={this.state.workout}
                showWorkoutCompleted={this.state.showWorkoutCompleted}
                isLoadingWorkoutCompleted={this.state.isLoadingWorkoutCompleted}
                handleSave={this.handleMarkWorkoutCompleted}
            />
        )
    }
    
    render() {
        if(this.state.workout === null) {
            return <Spinner />
        }

        return (
            <ComponentWithBackground safeAreaEnabled>
                <FlatList
                    scrollEventThrottle={16}
                    data={this.state.workout.exercises}
                    extraData={this.state.workout.exercises}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={this.renderExercise}
                    refreshControl={this.renderRefreshControl()}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderActionBtn}
                    contentContainerStyle={styles.containerList}
                />
                { this.renderTimer() }
                { this.renderWorkoutTime() }
            </ComponentWithBackground>
        );
    }
}

const styles = ScaledSheet.create({
    containerActionBtn: {
        flex: 1,
        marginHorizontal: '15@s',
        marginTop: '40@s'
    },
    actionBtn: {
        paddingHorizontal: '10@s',
        paddingVertical: '10@s',
        backgroundColor: mainColorDark
    },
    containerList: {
        paddingBottom: '150@s'
    }
});

export default function(props) {
    const navigation = useNavigation();
  
    return <WorkoutDetail {...props} navigation={navigation} />;
}