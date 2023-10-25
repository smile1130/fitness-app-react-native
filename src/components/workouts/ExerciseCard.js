import React, { Component, setGlobal } from 'reactn';
import {
    View,
    Text
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { CommonStyles } from '../../styles/CommonStyles';
import { white } from '../../styles/colors';
import { Strings } from '../../config/Strings';
import WorkoutMedia from './WorkoutMedia';
import CustomButton from '../common/CustomButton';
import { useNavigation } from '@react-navigation/native';
import ExerciseCardIconsBlock from './ExerciseCardIconsBlock';
import { formatYMDDateNoTZ, getKeyFromExercise, getWorkoutWeightsDataAsync, newWeightParamValue, setWorkoutWeightsDataAsync } from '../../config/Util';
import Autolink from 'react-native-autolink';
import AddWeightsComponentOnlyWeights from './weights/AddWeightsComponentOnlyWeights';
import WeightsService from '../../services/WeightsService';
import { GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL, GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL_FROM_WORKOUT_DETAIL, GLOBAL_REFRESH_WEIGHTS_LIST } from '../../state/StateInitializer';
import { hideMessage, showMessage } from 'react-native-flash-message';
import HtmlCustom from '../common/HtmlCustom';
import WeightAttachments from './weights/WeightAttachments';
import InputBorder from '../common/InputBorder';

class ExerciseCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            weights: null,
            note: {},
            files: {},
            loadingData: true, 
            showExecutions: false
        };

        this.timerSaveWeights = [];
    };

    async componentDidMount() {
        const weightsKey = this.getKey();

        const weights = await getWorkoutWeightsDataAsync(weightsKey);

        if (weights) {
            this.setState({
                weights: weights.weights,
                note: weights.note,
                files: weights.files || {},
                loadingData: false
            });
        } else {
            this.setState({
                loadingData: false
            });
        }
    }

    goToWeightsHistory = (item) => {
        this.props.navigation.navigate('WeightsHistory', {
            fromWorkoutDetail: true,
            exercise: newWeightParamValue(item)
        });
    }

    handleShowExecution = () => {
        this.setState({
            showExecutions: !this.state.showExecutions
        });
    }

    getKey = () => {
        return getKeyFromExercise(this.props.exercise);
    }

    startTimeoutToSave = (weights, exerciseUpdated, file = null) => {
        clearTimeout(this.timerSaveWeights[exerciseUpdated.id]);

        this.timerSaveWeights[exerciseUpdated.id] = setTimeout(() => {
            let weightsToSave = [{ weight: null, value: null }];

            if (exerciseUpdated.exerciseType !== 'circuit') {
                weightsToSave = Object.assign([], this.state.weights);

                //Remove element with no value or weight setted
                weightsToSave = weightsToSave.filter((item2) => {
                    return item2.value !== null &&
                        item2.value !== "" &&
                        item2.weight !== null &&
                        item2.weight !== "" &&
                        item2.exercise.id === exerciseUpdated.id
                });

                weightsToSave = weightsToSave.map(({exercise, set, ...rest}) => {
                    return rest;
                });
            }
            
            let params = {
                workout_id: this.props.workout.id,
                program_user_id :this.props.workout.program_user_id,
                exercise_id: exerciseUpdated.exercise_id,
                sets: exerciseUpdated.sets,
                type: exerciseUpdated.final_type,
                value: exerciseUpdated.final_value,
                key: exerciseUpdated.key,
                position: exerciseUpdated.position,
                superset_position: exerciseUpdated.supersetPosition,
                weights: JSON.stringify(weightsToSave),
                note: this.state.note[exerciseUpdated.id] || null,
                date: formatYMDDateNoTZ(new Date())
            };

            if (file) {
                params.file = file;
            }

            WeightsService.storeWeightFromWorkoutDetail(params)
            .then((data) => {
                // Refresh metrics list
                setGlobal({
                    [GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL]: true,
                    [GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL_FROM_WORKOUT_DETAIL]: true,
                    [GLOBAL_REFRESH_WEIGHTS_LIST]: true
                });

                if(data.file) {
                    this.onChangeFile(data.file, exerciseUpdated);
                }

                if (
                    exerciseUpdated.exerciseType === 'circuit' ||
                    this.checkAllWeightsInserted(weights, exerciseUpdated)
                ) {
                    // Show success message
                    showMessage({
                        message: data.message,
                        type: "success",
                        position: "top"
                    });
                }
            }).finally(() => {
                if (file) {
                    hideMessage(); //Hide upload message
                }
            });

        }, 2000)
    }

    checkAllWeightsInserted = (weights, exerciseUpdated) => {
        let allValuesInserted = true;

        if (
            !weights
        ) {
            return false;
        }

        const filteredWeights = weights.filter((item) => { return item.exercise.id === exerciseUpdated.id });

        filteredWeights.forEach(item => {
            if (
                item.weight === null ||
                item.weight === '' ||
                item.value === null ||
                item.value === ''
            ) {
                allValuesInserted = false;
            }
        });

        return allValuesInserted;
    }

    handleWeights = (weights, exerciseUpdated) => {
        this.setState({weights});
        
        if (exerciseUpdated) {
            this.startTimeoutToSave(weights, exerciseUpdated);
        }

        const weightsKey = this.getKey();

        let dataToSet = {
            weights,
            note: this.state.note,
            files: this.state.files
        };

        setWorkoutWeightsDataAsync(weightsKey, dataToSet);
    }

    onChangeNote = (note, elementUpdated) => {
        let newNote = Object.assign(this.state.note, {});
        newNote[elementUpdated.id] = note;

        this.setState({
            note: newNote
        });

        this.startTimeoutToSave(this.state.weights, elementUpdated);

        const weightsKey = this.getKey();

        let dataToSet = {
            weights: this.state.weights,
            note: newNote,
            files: this.state.files
        };

        setWorkoutWeightsDataAsync(weightsKey, dataToSet);
    }

    onChangeFile = (file, exerciseUpdated) => {
        let newFiles = Object.assign(this.state.files, {});
        let oldFiles = newFiles[exerciseUpdated.id] || [];
        newFiles[exerciseUpdated.id] = [...oldFiles, file];

        this.setState({
            files: newFiles
        });

        const weightsKey = this.getKey();

        let dataToSet = {
            weights: this.state.weights,
            note: this.state.note,
            files: newFiles
        };

        setWorkoutWeightsDataAsync(weightsKey, dataToSet);
    }

    renderExerciseCardIconsBlock = (item) => {
        if(item.exerciseType === 'circuit') {
            return null;
        }

        return (
            <ExerciseCardIconsBlock exercise={item} />
        )
    }

    renderNote = (item) => {
        if(!item.info) {
            return null;
        }

        const {
            text11,
            text14,
            textBold,
            textWrap,
            mainText,
            textUnderline
        } = CommonStyles;

        return (
            <View style={styles.containerNotes}>
                <Text style={[text14, textBold]}>
                    {Strings.label_notes}{'\n'}
                </Text>
                <Autolink
                    text={item.info}
                    style={[text11, textWrap]}
                    linkStyle={[mainText, textUnderline]}
                />
            </View>
        )
    }

    renderCircuitInfo = (item) => {
        const {
            text11,
            text14,
            textBold,
            textWrap,
            mainText,
            textUnderline
        } = CommonStyles;

        return (
            <View style={styles.containerCircuit}>
                {
                    item.description &&
                    item.description !== '<p><br></p>' &&
                    <View>
                        <Text style={[text14, textBold]}>
                            {Strings.label_execution}{'\n'}
                        </Text>
                        <HtmlCustom
                            html={item.description}
                            baseFontStyle={{ ...text11 }}
                        />
                    </View>
                }
                {
                    item.info &&
                        <View style={styles.containerAdditionalNote}>
                            <Text style={[text14, textBold]}>
                                {Strings.label_additional_note}{'\n'}
                            </Text>
                            <Autolink
                                text={item.info}
                                style={[text11, textWrap]}
                                linkStyle={[mainText, textUnderline]}
                            />
                        </View>
                }
            </View>
        )
    }

    renderInfo = (item) => {
        return (
            <View>
                { this.renderExerciseCardIconsBlock(item) }
                { this.renderActions(item) }
                {
                    item.exerciseType === 'circuit' ? this.renderCircuitInfo(item) : this.renderNote(item)
                }
            </View>
        )
    }

    renderBtnExecutions = () => {
        return (
            <CustomButton
                onPress={this.handleShowExecution}
                text={Strings.label_execution}
                containerStyle={styles.actionBtn}
                icon={this.state.showExecutions ? 'close-circle-outline' : 'play-circle-outline'}
            />
        )
    }

    renderActions = (item) => {
        const hideExecutionsBtn = (
            !item.exercise ||
            !item.exercise.assets || 
            item.exercise.assets.length <= 0
        );

        return (
            <View style={styles.containerButtons}>
                <View style={[
                    styles.containerInnerButtons,
                    {
                        justifyContent: hideExecutionsBtn ? 'center' : 'space-between'
                    }
                ]}>
                    {
                        !hideExecutionsBtn && this.renderBtnExecutions()
                    }
                    {this.renderAddWeights(item)}
                </View>
                {
                    this.state.showExecutions &&
                        <WorkoutMedia
                            exercise={item}
                            linkedExercises={item.exercise}
                        />
                }
            </View>
        )
    }

    renderAddWeights = (item) => {
        return (
            <CustomButton
                onPress={() => this.goToWeightsHistory(item)}
                secondaryButton
                text={Strings.label_weights_history}
                containerStyle={styles.actionBtn}
                icon={'analytics-outline'}
            />
        )
    }

    renderHeader = (item) => {
        const {
            text16,
            text14,
            mainText,
            textBold
        } = CommonStyles;
        
        const exerciseNum = item.key + '.' + (item.supersetPosition || '') + '  ';
        const superSetStyle = item.supersetPosition && item.supersetPosition > 1 ? styles.containerHeaderSuperset : null

        return (
            <View style={superSetStyle}>
                <Text style={[text14, textBold]}>
                    <Text style={[text16, mainText, textBold]}>{exerciseNum}</Text>{item.name}
                </Text>
            </View>
        )
    }

    renderWeightAdditionalInfo = () => {
        const {
            text14,
            textBold,
            blackText
        } = CommonStyles;

        if (!Array.isArray(this.props.exercise)) {
            return (
                <View style={styles.containerAdditionalInfo}>
                    <InputBorder
                        label={`${Strings.label_notes} ${this.props.exercise.name}`}
                        labelStyle={[text14, textBold, blackText]}
                        placeholder={Strings.label_insert_general_note}
                        text={this.state.note[this.props.exercise.id]}
                        handleValue={(value) => this.onChangeNote(value, this.props.exercise)}
                        multiline
                    />
                    <WeightAttachments
                        files={this.state.files[this.props.exercise.id] || []}
                        exerciseName={this.props.exercise.name}
                        handleMedia={(file) => this.handleMedia(file, this.props.exercise)}
                    />
                </View>
            )    
        }

        let items = [];

        this.props.exercise.forEach((element, index) => {
            items.push(
                <View key={index} style={[styles.containerAdditionalInfo, styles.containerAdditionalInfoMultiExercise]}>
                    <InputBorder
                        label={`${Strings.label_notes} ${element.name}`}
                        labelStyle={[text14, textBold, blackText]}
                        placeholder={Strings.label_insert_general_note}
                        text={this.state.note[this.props.exercise.id]}
                        handleValue={(value) => this.onChangeNote(value, element)}
                        multiline
                    />
                    <WeightAttachments
                        files={this.state.files[element.id] || []}
                        exerciseName={element.name}
                        handleMedia={(file) => this.handleMedia(file, element)}
                    />
                </View>
            );
        });

        return (
            <View>
                {items}
            </View>
        )
    }

    handleMedia = (file, elementUpdated) => {
        this.startTimeoutToSave(this.state.weights, elementUpdated, file.file);
    }

    renderSets = () => {
        if (
            this.state.loadingData ||
            this.props.workout.completed
        ) {
            return null;
        }

        return (
            <View>
                <AddWeightsComponentOnlyWeights
                    weights={this.state.weights}
                    exercise={this.props.exercise}
                    fromWorkoutDetail={true}
                    handleWeights={this.handleWeights}
                    showTimer={(exercise, selectedIndex, weights, showSetInsideTimer) => this.props.showTimer(exercise, selectedIndex, weights, showSetInsideTimer)}
                />
                { this.renderWeightAdditionalInfo() }
            </View>
        )
    }

    renderContent = () => {
        if (Array.isArray(this.props.exercise)) {
            const {
                text22,
                textBold,
                textCenter,
                mainText
            } = CommonStyles;

            const items = this.props.exercise.map((item, index) => {
                return (
                    <View key={index}>
                        {
                            item.supersetPosition === 1 &&
                            <Text style={[text22, textBold, mainText, textCenter, styles.labelSuperset]}>{Strings.label_superset}</Text>
                        }
                        { this.renderHeader(item) }
                        { this.renderInfo(item) }
                    </View>
                )
            });

            return (
                <View>
                    {items}
                </View>
            );
        }

        return (
            <View>
                { this.renderHeader(this.props.exercise) }
                { this.renderInfo(this.props.exercise) }
            </View>
        )
    }
    
    render() {
        const {
            boxShadowLight
        } = CommonStyles;

        return (
            <View style={[styles.exerciseContainer, boxShadowLight]}>
                { this.renderContent() }
                { this.renderSets() }
            </View>
        );
    }
}

const styles = ScaledSheet.create({
    exerciseContainer: {
        borderRadius: '15@s',
        marginTop: '10@s',
        marginBottom: '15@s',
        backgroundColor: white,
        padding: '20@s',
        marginHorizontal: '15@s'
    },
    actionBtn: {
        marginBottom: '10@s'
    },
    containerNotes: {
        marginTop: '15@s'
    },
    containerCircuit: {
        marginTop: '20@s',
        paddingTop: '6@s'
    },
    containerAdditionalNote: {
        marginTop: '30@s',
        marginBottom: '10@s'
    },
    containerButtons: {
        marginTop: '20@s'
    },
    containerInnerButtons: {
        flexDirection: 'row'
    },
    containerHeaderSuperset: {
        marginTop: '20@s'
    },
    labelSuperset: {
        marginBottom: '20@s'
    },
    containerAdditionalInfo: {
        marginTop: '15@s'
    },
    containerAdditionalInfoMultiExercise: {
        marginBottom: '15@s'
    }
});

export default function(props) {
    const navigation = useNavigation();
  
    return <ExerciseCard {...props} navigation={navigation} />;
}