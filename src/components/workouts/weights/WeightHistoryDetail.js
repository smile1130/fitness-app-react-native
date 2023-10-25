import React, { PureComponent, withGlobal, setGlobal } from 'reactn';
import {
    RefreshControl,
    ScrollView
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import ComponentWithBackground from '../../common/ComponentWithBackground';
import { mainColor, mainColorDark } from '../../../styles/colors';
import { Spinner } from '../../common/Spinner';
import { GLOBAL_REFRESH_WEIGHTS_HISTORY_SINGLE_DETAIL } from '../../../state/StateInitializer';
import WeightsHeader from './WeightsHeader';
import WeightsService from '../../../services/WeightsService';
import { newWeightParamValue, screenHeight } from '../../../config/Util';
import HistoryItem from './HistoryItem';

class WeightHistoryDetail extends PureComponent {
    constructor(props) {
        super(props);

        this.weightId = this.props.route.params.id;

        this.state = {
            weight: null,
            loadingWeight: true,
            isModalVisible: false,
        };

        this.preRenderRefreshControl = this.renderRefreshControl();
        this.scrollViewRef = React.createRef();
    };
    
    componentDidMount() {
        this.getWeightHistoryDetail();
    }

    componentDidUpdate(prevProps) {
        if(
            this.props.refreshWeightsHistorySingleDetail !== prevProps.refreshWeightsHistorySingleDetail
            && this.props.refreshWeightsHistorySingleDetail
        ) {
            setGlobal({
                [GLOBAL_REFRESH_WEIGHTS_HISTORY_SINGLE_DETAIL]: false
            });

            this.getWeightHistoryDetail();
        }
    }

    scrollToOffset = (y) => {
        const delta = screenHeight / 3;
        this.scrollViewRef.current.scrollTo({ y: y - delta, animated: true });
    }

    getWeightHistoryDetail = () => {
        WeightsService.getWeightdetail(this.weightId)
        .then(data => {
            this.setState({
                weight: data.weight,
                loadingWeight: false
            });
        }).catch(null);
    }

    weightParamValue = () => {
        return newWeightParamValue({
            exercise_id: this.state.weight.exercise.id,
            exerciseType: this.state.weight.exercise.muscle_group,
            name: this.state.weight.exercise.name,
            sets: this.state.weight.sets,
            type: this.state.weight.type,
            value: this.state.weight.value,
        });
    }

    goToEditWeight = () => {
        this.props.navigation.navigate('NewWeight', {
            exercise: this.weightParamValue(),
            weights: this.state.weight.data,
            note: this.state.weight.note,
            wDate: this.state.weight.fullDate,
            weightId: this.state.weight.id
        });
    }

    toggleModal = () => {
        this.setState({isModalVisible: !this.state.isModalVisible});
    }

    renderRefreshControl = () => {
        return <RefreshControl refreshing={false} onRefresh={this.getWeightHistoryDetail} colors={[mainColor, mainColorDark]} />
    }

    renderItem = () => {
        return (
            <HistoryItem
                item={this.state.weight}
                exercise={this.weightParamValue()}
                handleEdit={this.goToEditWeight}
                hideExerciseIconBlock={this.state.weight.exercise.muscle_group === 'circuit'}
                hideDelete={true}
                parentRef={this.scrollViewRef}
                scrollToOffset={this.scrollToOffset}
            />
        );
    }

    renderHeader = () => {
        return (
            <WeightsHeader
                exercise={this.state.weight.exercise}
            />
        );
    };

    render() {
        if (this.state.loadingWeight) {
            return <Spinner style={styles.spinner} />
        }
        
        return (
            <ComponentWithBackground safeAreaEnabled>
                <ScrollView
                    contentContainerStyle={styles.containerList}
                    refreshControl={this.renderRefreshControl()}
                    ref={this.scrollViewRef}
                >
                    { this.renderHeader() }
                    { this.renderItem() }
                </ScrollView>
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
    }
});

export default withGlobal(
    (global) => ({
        refreshWeightsHistorySingleDetail: global[GLOBAL_REFRESH_WEIGHTS_HISTORY_SINGLE_DETAIL]
    })
)
(function(props) {
    const navigation = useNavigation();
  
    return <WeightHistoryDetail {...props} navigation={navigation} />;
});