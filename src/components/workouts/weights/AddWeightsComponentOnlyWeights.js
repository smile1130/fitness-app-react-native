import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

import { mainColor, red, green, black, gray2 } from '../../../styles/colors';
import { CommonStyles } from '../../../styles/CommonStyles';
import { Strings } from '../../../config/Strings';
import CustomButton from '../../common/CustomButton';
import CustomButtonIcon from '../../common/CustomButtonIcon';

class AddWeightsComponentOnlyWeights extends Component {
    constructor(props) {
        super(props);

        let weights = this.props.weights || [
            {
                weight: null,
                value: null,
                exercise: this.props.exercise
            }
        ];

        if (
            !this.props.weights &&
            this.props.fromWorkoutDetail &&
            Array.isArray(this.props.exercise)
        ) {
            weights = [];

            for(let i = 0; i < this.getMaxSet(); i++) {
                for(let j = 0; j < this.props.exercise.length; j++) {
                    weights.push({
                        weight: null,
                        value: null,
                        exercise: this.props.exercise[j],
                        set: i + 1
                    });
                }
            }
        }

        if (
            !this.props.weights &&
            this.props.fromWorkoutDetail &&
            this.props.exercise.sets &&
            this.props.exercise.sets > 1
        ) {
            weights = [];

            for(let i = 0; i < this.getMaxSet(); i ++) {
                weights.push({
                    weight: null,
                    value: null,
                    exercise: this.props.exercise
                });
            }
        }

        this.state = {
            weights,
            weight: null,
            value: null,
            weightFocused: null,
            valueFocused: null
        }
    }

    getMaxSet = () => {
        return maxSet = Array.isArray(this.props.exercise) ? Math.max(...this.props.exercise.map(o => o.sets)) : this.props.exercise.sets;
    }

    isSuperSet = () => {
        return Array.isArray(this.props.exercise);
    }

    addNewSet = (cleanValue = false) => {
        let newWeights = this.state.weights;

        if (cleanValue) {
            const newSet = this.state.weights[this.state.weights.length - 1].set + 1;

            if (newSet) {
                for(let i = 0; i < this.props.exercise.length; i++) {
                    newWeights.push({
                        weight: null,
                        value: null,
                        exercise: this.props.exercise[i],
                        set: newSet
                    });
                }
            } else {
                newWeights.push({
                    weight: null,
                    value: null,
                    exercise: this.props.exercise
                });
            }
        } else {
            newWeights.push(Object.assign({}, this.state.weights[this.state.weights.length - 1]));
        }

        this.props.handleWeights(newWeights, null);

        this.setState({
            weights: newWeights
        });
    }

    deleteSet = (indexToDelete) => {
        let weights = this.state.weights.filter((item, index) => index !== indexToDelete);

        this.props.handleWeights(weights, this.state.weights[indexToDelete].exercise);

        this.setState({
            weights: Object.assign([], weights)
        });
    }

    deleteSetFromSet = (set) => {
        let weights = this.state.weights.filter((item) => item.set !== set);

        this.state.weights.filter((item) => item.set === set).forEach(item => {
            this.props.handleWeights(weights, item.exercise);
        });

        // Recalculate set number
        weights = weights.map((item, index) => {
            let newSet = Math.floor((index) / this.props.exercise.length) + 1;
            
            item.set = newSet;

            return item;
        });

        this.setState({
            weights: Object.assign([], weights)
        });
    }

    updateWeights = (index, key, value) => {
        let weights = this.state.weights;

        let newObj = weights[index];
        newObj[key] = value;

        weights[index] = newObj;
        
        this.props.handleWeights(weights, this.state.weights[index].exercise);

        this.setState({
            weights,
            [key]: value
        });
    }

    renderDeleteBtn = (index, set = null) => {
        return (
            <CustomButtonIcon
                onPress={() => set !== null ? this.deleteSetFromSet(set) : this.deleteSet(index)}
                icon='trash'
            />
        )
    }

    renderDeleteSetFromSuperSet = (index, set) => {
        if (
            set <= this.getMaxSet()
        ) {
            return null;
        }

        return this.renderDeleteBtn(index, set)
    }

    renderDeleteSet = (item, index) => {
        const currentSet = (index + 1);

        if (
            (
                this.props.fromWorkoutDetail &&
                !item.exercise.supersetPosition &&
                this.getMaxSet() < currentSet &&
                index !== 0
            ) ||
            (
                !this.props.fromWorkoutDetail &&
                (
                    this.state.weights.length > 1 ||
                    (
                        this.state.weights.length !== (index + 1)
                    )
                )
            )
        ) {
            return this.renderDeleteBtn(index);
        }

        return null;
    }

    renderStartTimer = (index, exercise) => {
        if (!this.props.fromWorkoutDetail) {
            return null;
        }

        const selectedExercise = exercise;

        const noPlay = 
        (
            (
                selectedExercise.final_type === 'reps' ||
                selectedExercise.final_type === 'ramp'
            ) &&
            (
                selectedExercise.restType === 'no_rest' ||
                selectedExercise.restValue === 0
            )
        ) ||
        (
            selectedExercise.final_type !== 'reps' &&
            selectedExercise.final_type !== 'ramp' &&
            (
                selectedExercise.restType === 'no_rest' ||
                selectedExercise.restValue === 0
            ) &&
            (
                selectedExercise.value === 0 ||
                selectedExercise.value === null
            )
        );

        const value = selectedExercise.final_value || '-';
        const valueLabel = (selectedExercise.final_type !== 'reps' && selectedExercise.final_type !== 'ramp') ? (selectedExercise.final_type === 'minutes' ? '\'' : '\'\'') : '';
        const time = selectedExercise.restType === 'no_rest' ? '0' : selectedExercise.restValue;
        const label = selectedExercise.restType !== 'no_rest' ? (selectedExercise.restType === 'minutes' ? '\'' : '\'\'') : '';

        let finalText = '';
        let showSetInsideTimer = false;

        if (
            selectedExercise.final_type !== 'reps' &&
            selectedExercise.final_type !== 'ramp'
        ) {
            finalText += `${Strings.label_exercise}: ${value + '' + valueLabel} + `;
            showSetInsideTimer = true; //Enable only when time exercise (go to the next exercise automatically)
        }

        finalText += `${Strings.label_rest_long}: ${time + '' + label}`;

        return (
            <CustomButton
                onPress={() => !noPlay ? this.props.showTimer(selectedExercise, index, this.state.weights, showSetInsideTimer) : null}
                text={finalText}
                icon={noPlay ? 'refresh-outline' : 'play'}
                grayButton={noPlay}
            />
        )
    }

    handleFocus = (item, index) => {
        this.setState({
            [item]: index
        });
    }

    renderWeight = ({item, index}) => {
        const set = item.set ? item.set : (index + 1);

        const {
            text11,
            text14,
            text16,
            textBold,
            darkGrayText,
            mainText
        } = CommonStyles;

        return (
            <View>
                {
                    item.exercise && item.exercise.supersetPosition && item.exercise.supersetPosition === 1 &&
                        <View style={[styles.numSet, set != 1 ? styles.numSetBorder : null]}>
                            <Text style={[text14, textBold, mainText]}>
                                {Strings.label_set} {set} {' '}
                            </Text>
                            {this.renderDeleteSetFromSuperSet(index, set)}
                        </View>
                }
                {
                    item.exercise && item.exercise.supersetPosition &&
                    <Text style={[text11, darkGrayText, styles.nameExercise]}>
                        {item.exercise.name}
                    </Text>
                }
                <View style={styles.containerWeight}>
                    <View style={{flex: 0.15}}>
                        <Text style={[mainText, text16, textBold]}>{set}</Text>
                    </View>
                    <View style={{flex: 0.3}}>
                        <TextInput
                            value={this.state.weights[index].weight}
                            onChangeText={(weight) => this.updateWeights(index, 'weight', weight)}
                            keyboardType={'numeric'}
                            style={[styles.input, {
                                borderColor: this.state.weights[index].weight ? green : (this.state.weightFocused !== null && this.state.weightFocused === index) ? red : gray2
                            }]}
                            onFocus={() => this.handleFocus('weightFocused', index)}
                            onBlur={() => this.handleFocus('weightFocused', null)}
                        />
                    </View>
                    <View style={{flex: 0.3}}>
                        <TextInput
                            value={this.state.weights[index].value}
                            onChangeText={(value) => this.updateWeights(index, 'value', value)}
                            keyboardType={'numeric'}
                            style={[styles.input, {
                                borderColor: this.state.weights[index].value ? green : (this.state.valueFocused !== null && this.state.valueFocused === index) ? red : gray2
                            }]}
                            onFocus={() => this.handleFocus('valueFocused', index)}
                            onBlur={() => this.handleFocus('valueFocused', null)}
                        />
                    </View>
                    <View style={{flex: 0.1}}>
                        { this.renderDeleteSet(item, index) }
                    </View>
                </View>
                { item.exercise && item.exercise.supersetPosition && this.renderStartTimer(index, item.exercise) }
            </View>
        )
    }

    renderHeader = (exercise) => {
        const {
            text12,
            textBold,
            text14,
            grayText
        } = CommonStyles;
        
        const labelValue = (exercise.final_type === 'reps' || exercise.final_type === 'ramp') ? Strings.label_reps : Strings.label_time;

        return (
            <View>
                <Text style={[text14, textBold]}>{Strings.label_set}</Text>
                <View style={styles.containerWeightHeader}>
                    <View style={{flex: 0.15}}>
                    </View>
                    <View style={{flex: 0.3}}>
                        <Text style={[text12, grayText]}>{Strings.label_weight_kg}</Text>
                    </View>
                    <View style={{flex: 0.3}}>
                        <Text style={[text12, grayText]}>{labelValue}</Text>
                    </View>
                    <View style={{ flex: 0.1 }} />
                </View>
            </View>
        )
    }

    renderFooter = () => {
        return (
            <View>
                {!this.isSuperSet() && this.renderStartTimer(0, this.state.weights[0].exercise)}
                <CustomButton
                    onPress={() => this.addNewSet(this.props.fromWorkoutDetail)}
                    icon='add'
                    secondaryButton
                    text={Strings.label_add_set}
                    containerStyle={styles.buttonAddSet}
                />
            </View>
        )
    }

    render() {
        if (this.props.exercise.exerciseType === 'circuit') {
            return null;
        }

        return (
            <View style={styles.mainContainer}>
                { this.renderHeader(this.props.exercise) }
                <FlatList
                    scrollEventThrottle={16}
                    data={this.state.weights}
                    extraData={this.state.weights}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={this.renderWeight}
                    scrollEnabled={false}
                    ListFooterComponent={this.renderFooter()}
                />
            </View>
        )
    }
}

const styles = ScaledSheet.create({
    mainContainer: {
        marginTop: '30@s'
    },
    buttonAddSet: {
        marginTop: '10@s',
        marginBottom: '20@s'
    },
    containerWeightHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '10@s',
        marginTop: '15@s'
    },
    mainContainerWeight: {
        borderLeftWidth: '2@s',
        borderLeftColor: mainColor,
        paddingLeft: '10@s'
    },
    numSet: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '12@s'
    },
    numSetBorder: {
        paddingTop: '10@s',
        borderTopWidth: 1,
        borderTopColor: gray2
    },
    containerWeight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10@s'
    },
    saveBtn: {
        marginVertical: '30@s',
        alignSelf: 'center',
        paddingHorizontal: '40@s',
        backgroundColor: mainColor
    },
    input: {
        height: '37@s',
        fontSize: '14@s',
        fontWeight: '600',
        paddingHorizontal: '10@s',
        borderWidth: '1@s',
        borderRadius: '10@s',
        color: black
    },
    mainContainerDate: {
        marginHorizontal: '15@s'
    },
    containerDate: {
        marginTop: '20@s'
    },
    labelInput: {
        marginBottom: '7@s'
    },
    actionFromWorkoutDetail: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerActionButtonStart: {
        alignItems: 'center',
        marginBottom: '25@s'
    },
    addSetBtn: {
        marginTop: '5@s',
        marginBottom: '10@s'
    },
    separatorSuperset: {
        flex: 1,
        marginVertical: '15@s',
    },
    nameExercise: {
        marginVertical: '10@s'
    },
    containerValueStyle: {
        flexDirection: 'row'
    },
    valueStyle: {
        marginLeft: '5@s'
    },
    mainContainerTimer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    containerIconDeleteSet: {
        position: 'absolute',
        zIndex: 1,
        right: '3@s',
        top: '12@s'
    }
});

export default AddWeightsComponentOnlyWeights;