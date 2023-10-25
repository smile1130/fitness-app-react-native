import React, { PureComponent, withGlobal, setGlobal } from 'reactn';
import {
    View,
    Text
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { newWeightParamValue } from '../../../config/Util';
import ComponentWithBackground from '../../common/ComponentWithBackground';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { mainColor, mainColorLight } from '../../../styles/colors';
import { CommonStyles } from '../../../styles/CommonStyles';
import EmptySection from '../../common/EmptySection';
import { Strings } from '../../../config/Strings';
import { Spinner } from '../../common/Spinner';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../common/CustomButton';
import WeightsService from '../../../services/WeightsService';
import { GLOBAL_REFRESH_WEIGHTS_LIST } from '../../../state/StateInitializer';
import TitleComponent from '../../common/TitleComponent';
import CardsList from '../../common/CardsList';
import SearchBar from '../../common/SearchBar';

class Weights extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            exercises: null,
            search: null
        };
    }

    componentDidMount() {
        this.loadWeights();
    }

    componentDidUpdate(prevProps) {
        if(
            this.props.refreshWeightsList !== prevProps.refreshWeightsList
            && this.props.refreshWeightsList
        ) {
            setGlobal({
                [GLOBAL_REFRESH_WEIGHTS_LIST]: false
            });

            this.loadWeights();
        }
    }

    handleBack = () => {
        this.props.navigation.goBack();
    }
    
    formattedExercises = (exercises) => {
        return exercises.map((item) => {
            let newItem = {};

            newItem.label = item.exercise_name;
            newItem.items = item.weights.map(weight => {
                return this.renderItem(item, weight);
            });

            return newItem;
        });
    }

    filteredExercises = () => {
        return this.state.exercises.filter(exercise => {
            if (!this.state.search) {
                return exercise;
            }

            return exercise.label.toLowerCase().includes(this.state.search.toLowerCase());
        });
    }

    loadWeights = () => {
        WeightsService.getWeights()
        .then(data => {
            this.setState({
                exercises: this.formattedExercises(data.exercises)
            });
        }).catch(null);
    }

    goToWeightsHistory(weight, item) {
        this.props.navigation.navigate('WeightsHistory', {
            exercise: newWeightParamValue(
            {
                ...weight,
                exercise_id: item.exercise_id,
                exerciseType: item.exercise_muscle_group,
                name: item.exercise_name
            })
        });
    }

    isEmpty = () => {
        return this.state.exercises && this.state.exercises.length === 0;
    }
    
    renderItem = (exercise, weight) => {
        const {
            text11,
            text16,
            text14,
            textBold,
            darkGrayText
        } = CommonStyles;

        return (
            <View style={styles.flex1}>
                { exercise.exercise_muscle_group !== 'circuit' &&
                    <View>
                        <View style={styles.innerInfoBlock}>
                            <View style={styles.circleElement}>
                                <Icon
                                    name={'refresh-outline'}
                                    size={scale(18)}
                                    color={mainColor}
                                />
                            </View>
                            <Text style={[darkGrayText, text11]}><Text style={[text16, textBold]}>{weight.sets || '-'}</Text> {Strings.label_set}</Text>
                        </View>

                        <View style={styles.innerInfoBlock}>
                            <View style={styles.circleElement}>
                                <Icon
                                    name={(weight.type === 'reps' || weight.type === 'ramp') ? 'barbell-outline' : 'time-outline'}
                                    size={scale(18)}
                                    color={mainColor}
                                />
                            </View>
                            <Text style={[darkGrayText, text11]}>
                                <Text style={[text16, textBold]}>
                                    {weight.value || '-'}
                                </Text>
                                {(weight.type !== 'reps' && weight.type !== 'ramp') ?
                                    (weight.type === 'minutes' ? ' ' + Strings.label_min : ' ' + Strings.label_sec)
                                    : ' ' + Strings.label_reps_short
                                }
                            </Text>
                        </View>
                    </View>
                }
                <CustomButton
                    onPress={() => this.goToWeightsHistory(weight, exercise)}
                    text={Strings.label_show_detail_history}
                    containerStyle={styles.buttonHistory}
                    icon={'analytics-outline'}
                />
            </View>
        )
    }

    renderEmptyWeights = () => {
        return (
            <EmptySection text={Strings.strings_empty_weight} icon={'analytics-outline'} />
        )
    }

    renderContent = () => {
        if(this.isEmpty()) {
            return this.renderEmptyWeights();
        }

        const {
            text16
        } = CommonStyles;

        return (
            <CardsList
                items={this.filteredExercises()}
                labelStyle={text16}
                itemStyle={styles.item}
                onRefresh={this.loadWeights}
            />
        )
    }

    handleSearch = (search) => {
        this.setState({search});
    }

    renderSeach = () => {
        return (
            <SearchBar
                style={styles.search}
                placeholder={Strings.label_search_exercise}
                handleSearch={this.handleSearch}
            />
        )
    }

    renderTitle = () => {
        return (
            <TitleComponent
                title={Strings.label_weights_history}
                handleBack={this.handleBack}
            />
        )
    }

    render() {
        if(!this.state.exercises) {
            return <Spinner />
        }

        return (
            <ComponentWithBackground safeAreaEnabled>
                {this.renderTitle()}
                {this.renderSeach()}
                {this.renderContent()}
            </ComponentWithBackground>
        );
    }
}

const styles = ScaledSheet.create({
    flex1: {
        flex: 1
    },
    innerBodyNotLast: {
        marginBottom: '15@s',
    },
    innerInfoBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: '25@s',
        marginBottom: '15@s'
    },
    circleElement: {
        width: '30@s',
        height: '30@s',
        borderRadius: '15@s',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '7@s',
        backgroundColor: mainColorLight
    },
    buttonHistory: {
        marginTop: '5@s'
    },
    item: {
        paddingVertical: '13@s'
    },
    search: {
        marginHorizontal: '15@s'
    }
});

export default withGlobal(
    (global) => ({
        refreshWeightsList: global[GLOBAL_REFRESH_WEIGHTS_LIST]
    })
)(function(props) {
    const navigation = useNavigation();
  
    return <Weights {...props} navigation={navigation} />;
});