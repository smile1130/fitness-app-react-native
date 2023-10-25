import React, { PureComponent } from 'react';
import {
    FlatList,
    View,
    Text
} from 'react-native';
import { setGlobal } from 'reactn';
import { ScaledSheet, scale } from 'react-native-size-matters';
import ComponentWithBackground from '../../common/ComponentWithBackground';
import { gray2 } from '../../../styles/colors';
import { CommonStyles } from '../../../styles/CommonStyles';
import { Strings } from '../../../config/Strings';
import CustomButton from '../../common/CustomButton';
import MetricService from '../../../services/MetricService';
import { GLOBAL_REFRESH_METRICS_LIST } from '../../../state/StateInitializer';
import EmptySection from '../../common/EmptySection';
import { Spinner } from '../../common/Spinner';
import { useNavigation } from '@react-navigation/native';
import TitleComponent from '../../common/TitleComponent';
import CustomButtonIcon from '../../common/CustomButtonIcon';
import ConfirmModal from '../../common/ConfirmModal';

class MetricHistory extends PureComponent {
    constructor(props) {
        super(props);

        this.metricId = this.props.route.params.metricId;
        this.selectedResultId = null;

        this.state = {
            isModalVisible: false,
            metric: null
        }
    }

    componentDidMount() {
        this.loadMetric();
    }

    handleBack = () => {
        this.props.navigation.goBack();
    }

    loadMetric = () => {
        MetricService.metric(this.metricId)
        .then(data => {
            let metric = data.metric;
            metric.values = metric.values.reverse();

            this.setState({
                metric: data.metric
            });
        }).catch(null);
    }

    deleteResult = () => {
        this.toggleModal();

        MetricService.deleteResult(this.selectedResultId)
        .then(data => {
            this.loadMetric();

            setGlobal({
                [GLOBAL_REFRESH_METRICS_LIST]: true
            });
        }).catch(null);
    }

    toggleModal = (resultId) => {        
        this.setState({isModalVisible: !this.state.isModalVisible});
    }

    handleDeleteResult = (resultId) => {
        this.selectedResultId = resultId;

        this.toggleModal();
    }

    renderModal = () => {
        const {
            text14
        } = CommonStyles;

        return (
            <ConfirmModal
                text={Strings.strings_confirm_delete_result}
                toggleModal={this.toggleModal}
                isModalVisible={this.state.isModalVisible}
                action={this.deleteResult}
            />
        )
    }

    renderEmptyValues = () => {
        return (
            <EmptySection text={Strings.strings_empty_metrics} icon={'bar-chart-outline'} />
        )
    }

    renderValue = ({item, index}) => {
        const {
            text13,
            textBold
        } = CommonStyles;

        return (
            <View style={styles.value}>
                <View style={styles.containerValue}>
                    <Text style={[text13, textBold]}>{item.value} {this.state.metric.unit}</Text>
                </View>
                <View style={styles.containerDate}>
                    <Text style={text13}>{item.dateFormatted}</Text>
                </View>
                <CustomButtonIcon
                    onPress={() => this.handleDeleteResult(item.id)}
                />
            </View>
        )
    }

    renderTitle = () => {
        return (
            <TitleComponent
                title={`${this.state.metric.name} (${this.state.metric.unit})`}
                handleBack={this.handleBack}
            />
        );
    }

    render() {
        if(!this.state.metric) {
            return <Spinner />
        }

        return (
            <ComponentWithBackground safeAreaEnabled>
                <FlatList
                    data={this.state.metric.values}
                    renderItem={this.renderValue}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={styles.list}
                    ListHeaderComponent={this.renderTitle}
                    ListEmptyComponent={this.renderEmptyValues}
                />
                {this.renderModal()}
            </ComponentWithBackground>
        );
    }
}

const styles = ScaledSheet.create({
    containerTitle: {
        marginTop: '10@s',
        marginBottom: '30@s'
    },
    list: {
        flexGrow: 1,
        marginBottom: '20@s'
    },
    value: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: '12@s',
        marginHorizontal: '15@s',
        borderBottomWidth: 1,
        borderBottomColor: gray2
    },
    containerDelete: {
        flex: 1,
        alignItems: 'flex-end'
    },
    containerDate: {
        flex: 3
    },
    containerValue: {
        flex: 2
    },
    modalContainer: {
        justifyContent: 'flex-end',
        margin: 0
    },
    innerModalContainer: {
        backgroundColor: 'white',
        padding: '20@s',
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerBtnModal: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginTop: '20@s',
        marginBottom: '10@s'
    }
});

export default function(props) {
    const navigation = useNavigation();
  
    return <MetricHistory {...props} navigation={navigation} />;
}