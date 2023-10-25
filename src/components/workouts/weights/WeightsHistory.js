import React, { PureComponent, withGlobal, setGlobal } from 'reactn';
import {
    FlatList,
    RefreshControl,
    View,
    Text
} from 'react-native';
import { scale, ScaledSheet } from 'react-native-size-matters';
import ComponentWithBackground from '../../common/ComponentWithBackground';
import { black, mainColor, mainColorDark, white } from '../../../styles/colors';
import { CommonStyles } from '../../../styles/CommonStyles';
import { Spinner } from '../../common/Spinner';
import { Strings } from '../../../config/Strings';
import { GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL, GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL_FROM_WORKOUT_DETAIL, GLOBAL_REFRESH_WEIGHTS_LIST } from '../../../state/StateInitializer';
import { useNavigation } from '@react-navigation/native';
import WeightsHeader from './WeightsHeader';
import WeightsService from '../../../services/WeightsService';
import EmptySection from '../../common/EmptySection';
import CustomButton from '../../common/CustomButton';
import { newWeightParamValue } from '../../../config/Util';
import HistoryItem from './HistoryItem';
import ConfirmModal from '../../common/ConfirmModal';
import ExerciseCardIconsBlock from '../ExerciseCardIconsBlock';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomFilters from '../../common/CustomFilters';

class WeightsHistory extends PureComponent {
    constructor(props) {
        super(props);

        this.exercise = this.props.route.params ? this.props.route.params.exercise : null;
        this.fromWorkoutDetail = this.props.route.params ? this.props.route.params.fromWorkoutDetail : null;

        this.state = {
            history: null,
            history_all: null,
            loadingSingleValue: true,
            loadingExercise: true,
            isModalVisible: false,
            filters: [
                {
                    key: 0,
                    title: Strings.label_complete_history
                },
                {
                    key: 1,
                    title: Strings.label_specific
                }
            ],
            currentIndex: this.fromWorkoutDetail ? 0 : 1 //When from workuot detail show complete history
        };

        this.idWeightsToDelete = null;
    };
    
    componentDidMount() {
        this.getAllData();

        if(
            this.fromWorkoutDetail &&
            this.props.refreshWeightsHistoryDetailFromWorkoutDetail
        ) {
            setGlobal({
                [GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL_FROM_WORKOUT_DETAIL]: false
            });
        }

        if(
            !this.fromWorkoutDetail &&
            this.props.refreshWeightsHistoryDetail
        ) {
            setGlobal({
                [GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL]: false
            });
        }
    }

    componentDidUpdate(prevProps) {
        if(
            this.fromWorkoutDetail &&
            this.props.refreshWeightsHistoryDetailFromWorkoutDetail !== prevProps.refreshWeightsHistoryDetailFromWorkoutDetail
            && this.props.refreshWeightsHistoryDetailFromWorkoutDetail
        ) {
            setGlobal({
                [GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL_FROM_WORKOUT_DETAIL]: false
            });

            this.getAllData();
        }

        if(
            !this.fromWorkoutDetail &&
            this.props.refreshWeightsHistoryDetail !== prevProps.refreshWeightsHistoryDetail
            && this.props.refreshWeightsHistoryDetail
        ) {
            setGlobal({
                [GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL]: false
            });

            this.getAllData();
        }
    }

    isCircuit = () => {
        return this.exercise.exerciseType === 'circuit';
    }

    isLoading = () => {
        if (this.isCircuit()) {
            return this.state.loadingExercise;
        }

        return this.state.loadingSingleValue || this.state.loadingExercise;
    }

    getAllData = () => {
        if (this.isCircuit()) {
            this.getWeightsFromExercise();
        } else {
            this.getWeightsFromSingleValues();
            this.getWeightsFromExercise();
        }
    }

    getWeightsFromSingleValues = () => {
        WeightsService.getWeightsFromSingleValues(this.exercise)
        .then(data => {
            this.setState({
                history: data.weights,
                loadingSingleValue: false
            });
        }).catch(null);
    }

    getWeightsFromExercise = () => {
        WeightsService.getWeightsFromExercise(this.exercise)
        .then(data => {
            this.setState({
                history_all: data.weights,
                loadingExercise: false
            });
        }).catch(null);
    }

    deleteWeights = () => {
        WeightsService.deleteWeights(this.idWeightsToDelete)
        .then(() => {
            this.toggleModal();

            this.getAllData()

            setGlobal({
                [GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL]: true,
                [GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL_FROM_WORKOUT_DETAIL]: true,
                [GLOBAL_REFRESH_WEIGHTS_LIST]: true
            });
            
        }).catch(null);
    }

    goToAddWeight = () => {
        this.props.navigation.navigate('NewWeight', {
            exercise: newWeightParamValue(this.exercise)
        });
    }

    goToEditWeight = (item) => {
        this.props.navigation.navigate('NewWeight', {
            exercise: newWeightParamValue(this.exercise),
            weights: item.data,
            note: item.note,
            wDate: item.fullDate,
            weightId: item.id
        });
    }

    toggleConfirmDeleteModal = (id) => {
        this.idWeightsToDelete = id;
        this.toggleModal();
    }

    toggleModal = () => {
        this.setState({isModalVisible: !this.state.isModalVisible});
    }

    renderRefreshControl = () => {
        return <RefreshControl refreshing={false} onRefresh={this.getAllData} colors={[mainColor, mainColorDark]} />
    }

    renderItem = (item, index, hideExerciseIconBlock = true) => {
        return (
            <HistoryItem
                item={item}
                index={index}
                exercise={this.exercise}
                handleEdit={() => this.goToEditWeight(item)}
                handleConfirmDeleteModal={() => this.toggleConfirmDeleteModal(item.id)}
                hideExerciseIconBlock={hideExerciseIconBlock}
            />
        );
    }

    renderModalConfirmDelete = () => {
        return (
            <ConfirmModal
                text={Strings.strings_confirm_delete_weights}
                toggleModal={this.toggleModal}
                isModalVisible={this.state.isModalVisible}
                action={this.deleteWeights}
            />
        )
    }

    renderHeader = () => {
        return (
            <WeightsHeader
                exercise={this.exercise}
            />
        );
    };

    renderEmptyHistory = (isSpecific) => {
        const {
            textBold,
            blackText
        } = CommonStyles;

        const textLabel = isSpecific ?
            (
                <Text>
                    {
                        Strings.formatString(
                            this.isCircuit() ? Strings.strings_empty_note_look_history : Strings.strings_empty_weight_look_history,
                            <Text style={[textBold, blackText]}>
                                {Strings.label_complete_history}{' '}
                                <Icon
                                    name={'analytics-outline'}
                                    size={scale(12)}
                                    color={black}
                                />
                            </Text>
                        )
                    }
                </Text>
            )
            : this.isCircuit() ? Strings.strings_empty_note : Strings.strings_empty_weight;

        return (
            <EmptySection text={textLabel} icon={'barbell-outline'} style={styles.emptySection} />
        )
    }

    renderSpecificHistory = () => {
        return (
            <FlatList
                scrollEventThrottle={16}
                data={this.state.history}
                extraData={this.state.history}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({item, index}) => this.renderItem(item, index)}
                ListEmptyComponent={() => this.renderEmptyHistory(true)}
                ListHeaderComponent={this.renderTitle}
                contentContainerStyle={styles.containerList}
                refreshControl={this.renderRefreshControl()}
            />
        )
    }

    renderAllHistory = () => {
        return (
            <FlatList
                scrollEventThrottle={16}
                data={this.state.history_all}
                extraData={this.state.history_all}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({item, index}) => this.renderItem(item, index, this.isCircuit())}
                ListEmptyComponent={() => this.renderEmptyHistory(false)}
                ListHeaderComponent={this.renderTitle}
                contentContainerStyle={styles.containerList}
                refreshControl={this.renderRefreshControl()}
            />
        )
    }

    renderSpecificTabHeader = () => {
        const {
            boxShadowLight
        } = CommonStyles;
        return (
            <View style={[boxShadowLight, styles.containerSpecificInfo]}>
                <ExerciseCardIconsBlock
                    exercise={this.exercise}
                    hideRest
                    small
                />
            </View>
        )
    }

    renderTitle = () => {
        return (
            <View>
                {this.renderHeader()}
                {this.renderFilters()}
                {this.state.currentIndex === 1 ? this.renderSpecificTabHeader() : null}
            </View>
        )
    }

    renderFilters = () => {
        return (
            <CustomFilters
                filters={this.state.filters}
                onPress={(selected) => this.setState({ currentIndex: selected })}
                currentKey={this.state.currentIndex}
            />
        )
    }

    renderHistory = () => {
        if(this.isLoading()) {
            return <Spinner style={styles.spinner}/>
        }

        return this.state.currentIndex === 0 ? this.renderAllHistory() : this.renderSpecificHistory();
    }

    renderAddWeight = () => {
        return (
            <CustomButton
                onPress={() => this.goToAddWeight(null)}
                text={this.isCircuit() ? Strings.label_add_note : Strings.label_add_weight_result}
                isAbsolute
                icon={'barbell-outline'}
            />
        )
    }

    render() {
        return (
            <ComponentWithBackground safeAreaEnabled>
                { this.isCircuit() ? this.renderAllHistory() : this.renderHistory() }
                { this.renderModalConfirmDelete() }
                { this.renderAddWeight() }
            </ComponentWithBackground>
        );
    }
}

const styles = ScaledSheet.create({
    containerList: {
        paddingBottom: '220@s'
    },
    spinner: {
        marginTop: '60@s'
    },
    emptySection: {
        marginTop: '50@s'
    },
    containerSpecificInfo: {
        backgroundColor: white,
        padding: '10@s',
        marginTop: '10@s',
        marginBottom: '15@s',
        marginHorizontal: '15@s',
        borderRadius: '8@s'
    }
});

export default withGlobal(
    (global) => ({
        refreshWeightsHistoryDetail: global[GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL],
        refreshWeightsHistoryDetailFromWorkoutDetail: global[GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL_FROM_WORKOUT_DETAIL]
    })
)(function(props) {
    const navigation = useNavigation();
  
    return <WeightsHistory {...props} navigation={navigation} />;
});