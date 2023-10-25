import React, { useState, useEffect } from 'react';
import { setGlobal, useGlobal } from 'reactn';
import {
    View,
    Text
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from '../common/CustomButton';
import { Strings } from '../../config/Strings';
import { CommonStyles } from '../../styles/CommonStyles';
import { black, mainColor, white } from '../../styles/colors';
import { getWorkoutStart, removeWorkoutStart, setWorkoutStart } from '../../config/Util';
import { Spinner } from '../common/Spinner';
import Slider from '@react-native-community/slider';
import CustomButtonIcon from '../common/CustomButtonIcon';
import InputBorder from '../common/InputBorder';
import { scale } from 'react-native-size-matters';

const WorkoutTime = ({
    workout,
    showWorkoutCompleted,
    handleSave
}) => {
    const [workoutStartDate, setWorkoutStartDate] = useState(null);
    const [finishHours, setFinishHours] = useState(null);
    const [finishMinutes, setFinishMinutes] = useState(null);
    const [finishEditable, setFinishEditable] = useState(false);
    const [isInit, setIsInit] = useState(false);
    const [isFinish, setIsFinish] = useState(false);
    const [feeedback, setFeedback] = useState(0);
    const [isWorkoutStartDateOpen, setIsWorkoutStartDateOpen] = useState(false);

    const feedbackArray = [
        {
            label: Strings.label_very_easy,
            key: 'VERY_EASY'
        },
        {
            label: Strings.label_easy,
            key: 'EASY'
        },
        {
            label: Strings.label_medium,
            key: 'MEDIUM'
        },
        {
            label: Strings.label_hard,
            key: 'HARD'
        },
        {
            label: Strings.label_very_hard,
            key: 'VERY_HARD'
        }
    ];

    const workoutStartDateId = 'WorkoutStartDate_' + workout.id + '_' + workout.program_user_id;

    // Function to retrieve the previous workout start value from AsyncStorage
    const getPreviousWorkoutStartValue = async () => {
        try {
            const value = await getWorkoutStart(workoutStartDateId);

            if (value !== null) {
                setWorkoutStartDate(value)
            }

            setIsInit(true);
        } catch (error) {
            console.log('Error retrieving workout start value: ', error);
        }
    };

    const resetWorkoutStartDate = () => {
        setWorkoutStartDate(null)
    }

    const resetWorkout = () => {
        removeWorkoutStart(workoutStartDateId);
        resetWorkoutStartDate();
    }

    // Function to update the workout start value in AsyncStorage
    const saveWorkoutStartValue = async (value) => {
        try {
            let valueToSave = value.toISOString();

            setWorkoutStart(workoutStartDateId, valueToSave);
            setWorkoutStartDate(valueToSave);
        } catch (error) {
            console.log('Error saving workout start value: ', error);
        }
    };

    const onCloseComponent = () => {
        resetWorkoutStartDate();
    }

    // Load the previous workout start value when the component mounts
    useEffect(() => {
        getPreviousWorkoutStartValue();

        return onCloseComponent;
    }, []);

    // Function to show view of finished workout
    useEffect(() => {
        if (showWorkoutCompleted) {
            handleFinish();
        }
    }, [showWorkoutCompleted]);

    // Function to handle the play button press
    const handleInitialStart = () => {
        setIsWorkoutStartDateOpen(false);
        saveWorkoutStartValue(new Date());
        //TODO
    };

    // Function to format the workout date value as 'mm:ss'
    const formatTime = () => {
        const dateObject = new Date(workoutStartDate);
        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}`;
    };

    const handleFinish = () => {
        if (workoutStartDate) {
            const dateStart = new Date(workoutStartDate);
            const dateNow = new Date();

            const milliseconds = dateNow - dateStart;

            if (milliseconds <= 0) {
                return "La data fornita è nel passato";
            }

            let hours = Math.floor(milliseconds / 3600000); // 1 hour = 3600000 milliseconds
            let minutes = Math.floor((milliseconds % 3600000) / 60000); // 1 minute = 60000 milliseconds

            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;

            setFinishHours(hours.toString());
            setFinishMinutes(minutes.toString());
        } else {
            setFinishHours('00');
            setFinishMinutes('00');
        }

        setIsFinish(true);
    }

    const handleFinishEditable = () => {
        if (finishEditable) {
            console.log('set');
            setFinishHours(finishHours === '' ? '00' : finishHours.padStart(2, '0'));
            setFinishMinutes(finishMinutes === '' ? '00' : finishMinutes.padStart(2, '0'));
        }

        setFinishEditable((prevValue) => !prevValue);
    }

    const handleBackFinish = () => {
        setIsFinish(false);
        setFeedback(0);
    }

    const handleFinalSave = () => {
        const hoursInSeconds = parseInt(finishHours, 10) * 3600;
        const minutesInSeconds = parseInt(finishMinutes, 10) * 60;

        const totalSeconds = hoursInSeconds + minutesInSeconds;

        handleSave(totalSeconds, feedbackArray[feeedback].key);
    }

    const renderWorkoutStartDate = () => {
        const {
            textBold,
            text16
        } = CommonStyles;

        return (
            <View style={styles.containerWorkoutStartDate}>
                <View style={styles.containerInitDate}>
                    <Icon
                        name={'time-outline'}
                        size={scale(20)}
                    />
                    <Text style={[text16, textBold]}>{' '}{formatTime()}</Text>
                </View>
                <View style={styles.containerButtons}>
                    {
                        isWorkoutStartDateOpen &&
                        <CustomButtonIcon
                            onPress={resetWorkout}
                            icon={'close'}
                            bgColor={black}
                            customStyle={styles.btnFinish}
                        />
                    }
                    <CustomButtonIcon
                        onPress={() => setIsWorkoutStartDateOpen(!isWorkoutStartDateOpen)}
                        icon={isWorkoutStartDateOpen ? 'chevron-back-outline' : 'chevron-forward-outline'}
                    />
                </View>
            </View>
        )
    }

    const renderLoader = () => {
        return (
            <Spinner style={styles.spinner} size='small' />
        )
    }

    const renderTime = () => {
        const {
            text14,
            text18,
            mainText,
            textBold
        } = CommonStyles;

        const extraStyleInput = finishEditable ? [styles.input] : [styles.inputNotEditable];
        const extraStyleInputMinutes = finishEditable ? styles.inputMinutes : null;

        return (
            <View style={styles.containerTime}>
                <Text style={text14}>{Strings.label_your_time}:</Text>
                <View style={styles.containerTimeInner}>
                    <View style={styles.containerInputs}>
                        <InputBorder
                            inputStyle={[text18, textBold, ...extraStyleInput]}
                            text={finishHours}
                            textColor={mainColor}
                            handleValue={(value) => setFinishHours(value)}
                            editable={finishEditable}
                        />
                        {
                            !finishEditable &&
                            <Text style={[text18, textBold, mainText]}>:</Text>
                        }
                        <InputBorder
                            inputStyle={[text18, textBold, extraStyleInputMinutes, extraStyleInput]}
                            text={finishMinutes}
                            textColor={mainColor}
                            handleValue={(value) => setFinishMinutes(value)}
                            editable={finishEditable}
                        />
                    </View>
                    <View style={{ width: 100 }}>

                    </View>
                    <CustomButtonIcon
                        onPress={handleFinishEditable}
                        icon={finishEditable ? 'checkmark-outline' : 'pencil-outline'}
                    />
                </View>
            </View>
        )
    }

    const renderSlider = () => {
        const {
            text14,
            text16,
            textBold
        } = CommonStyles;

        return (
            <View style={styles.containerSlider}>
                <Text style={text14}>{Strings.strings_how_did_you_find_the_workout}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={4}
                    minimumTrackTintColor={mainColor}
                    step={1}
                    onValueChange={value => setFeedback(value)}
                />
                <View style={styles.containerSteps}>
                    <Text style={[text16, textBold]}>{feedbackArray[feeedback].label}</Text>
                </View>
            </View>
        );
    }

    const renderFinish = () => {
        const {
            text18,
            textBold
        } = CommonStyles;

        return (
            <View style={styles.containerFinish}>
                <View>
                    <Text style={[text18, textBold]}>{Strings.label_workout_done}!</Text>
                    {renderTime()}
                    {renderSlider()}
                </View>
                <View>
                    <CustomButton
                        onPress={handleBackFinish}
                        text={Strings.label_undo}
                        icon={'close-outline'}
                        secondaryButton
                    />
                    <CustomButton
                        onPress={handleFinalSave}
                        text={Strings.label_save}
                        icon={'checkmark-outline'}
                        containerStyle={styles.saveButton}
                    />
                </View>
            </View>
        )
    }

    const renderContent = () => {
        if (isFinish) {
            return renderFinish();
        } else if (workoutStartDate == null) {
            return (
                <CustomButton
                    onPress={handleInitialStart}
                    text={Strings.label_start_workout}
                    icon={'play'}
                />
            )
        }

        return renderWorkoutStartDate();
    }

    const {
        boxShadowLight
    } = CommonStyles;

    let extraStyle = null;

    if (isFinish) {
        extraStyle = styles.containerWithFinish;
    } else if (workoutStartDate && !isWorkoutStartDateOpen) {
        extraStyle = styles.workoutStartDateCollapse;
    }

    return (
        <View style={[boxShadowLight, styles.container, extraStyle]}>
            {
                !isInit ? renderLoader() : renderContent()
            }
        </View>
    );
}

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: white,
        paddingVertical: '10@s',
        paddingHorizontal: '15@s'
    },
    workoutStartDateCollapse: {
        width: '130@s',
        bottom: -1,
        borderTopRightRadius: '5@s'
    },
    containerWithFinish: {
        height: '100%'
    },
    containerFinish: {
        flex: 1,
        justifyContent: 'space-between',
        padding: '10@s'
    },
    containerWorkoutStartDate: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    containerTime: {
        marginTop: '25@s'
    },
    containerInputs: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerTimeInner: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerInitDate: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerButtons: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    btnFinish: {
        marginLeft: '10@s',
        marginRight: '30@s'
    },
    spinner: {
        marginVertical: '5@s'
    },
    containerSlider: {
        marginTop: '25@s'
    },
    containerSteps: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    slider: {
        width: '100%',
        marginVertical: '10@s'
    },
    saveButton: {
        marginTop: '10@s'
    },
    inputNotEditable: {
        borderWidth: 0,
        paddingHorizontal: '1@s'
    },
    input: {
        width: '50@s'
    },
    inputMinutes: {
        marginLeft: '10@s'
    }
});

export default WorkoutTime;