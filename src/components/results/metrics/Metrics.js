import React, { PureComponent } from 'react';
import {
    FlatList,
    View,
    Text,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import {
    LineChart
} from "react-native-chart-kit";
import { setGlobal, withGlobal } from 'reactn';
import MetricService from '../../../services/MetricService';
import { screenWidth, formatMetriGraphDate } from '../../../config/Util';
import ComponentWithBackground from '../../common/ComponentWithBackground';
import { showMessage } from 'react-native-flash-message';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { mainColor, mainColorDark, white } from '../../../styles/colors';
import { CommonStyles } from '../../../styles/CommonStyles';
import { GLOBAL_REFRESH_METRICS_LIST } from '../../../state/StateInitializer';
import EmptySection from '../../common/EmptySection';
import { Strings } from '../../../config/Strings';
import { Spinner } from '../../common/Spinner';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../common/CustomButton';
import TitleComponent from '../../common/TitleComponent';

const chartConfig = {
    backgroundColor: white,
    backgroundGradientFrom: white,
    backgroundGradientTo: white,
    color: () => mainColor,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
};

class Metrics extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            all_metrics: null,
            metrics: null
        };

        this.preRenderRefreshControl = this.renderRefreshControl();
    }

    componentDidMount() {
        this.loadMetrics();
    }

    componentDidUpdate(prevProps) {
        if(
            this.props.refreshMetricsList !== prevProps.refreshMetricsList
            && this.props.refreshMetricsList
        ) {
            setGlobal({
                [GLOBAL_REFRESH_METRICS_LIST]: false
            });

            this.loadMetrics();
        }
    }

    renderRefreshControl = () => {
        return <RefreshControl refreshing={false} onRefresh={this.loadMetrics} colors={[mainColor, mainColorDark]} />
    }

    loadMetrics = () => {
        MetricService.metrics()
        .then(data => {
            this.setState({
                all_metrics: data.all_metrics,
                metrics: [...data.metrics, ...data.visits.map(v => ({...v, visit: true}))].sort((a, b) => (a.name_label > b.name_label) ? 1 : -1),
            });
        }).catch(null);
    }

    handleBack = () => {
        this.props.navigation.goBack();
    }

    goToAddMetric = (metric = null) => {
        this.props.navigation.navigate('NewResult', {
            all_metrics: this.state.all_metrics,
            init_metric: metric
        });
    }

    goToMetricHistory = (metricId) => {
        this.props.navigation.navigate('MetricHistory', {
            metricId
        });
    }

    goToVisitHistory = (name) => {
        this.props.navigation.navigate('VisitHistory', {
            name
        });
    }

    renderEmptyMetric = () => {
        return (
            <EmptySection text={Strings.strings_empty_metrics} icon={'bar-chart-outline'} />
        )
    }

    renderChart = (metric) => {
        const {
            text12,
            boxShadowLight
        } = CommonStyles;

        if(metric.values.length === 0) {
            return (
                <Text style={[text12, styles.label_no_results]}>{Strings.label_no_result}</Text>
            )
        }

        const slicedValues = metric.values.slice(Math.max(metric.values.length - 8, 0));

        const labels = slicedValues.map(item => formatMetriGraphDate(item.date));
        const values = slicedValues.map(item => item.value);

        const data = {
            labels,
            datasets: [
              {
                data: values,
                labels,
                color: (opacity = 1) => mainColor,
                strokeWidth: 2,
                unit: metric.unit
              }
            ],
        };

        return (
            <TouchableOpacity
                activeOpacity={metric.visit ? 1 : 0.9}
                onPress={() => metric.visit ? this.goToVisitHistory(metric.name) : this.goToMetricHistory(metric.id)}
            >
                <LineChart
                    data={data}
                    width={screenWidth - scale(30)}
                    height={scale(210)}
                    chartConfig={chartConfig}
                    onDataPointClick={({ index, value, dataset, getColor }) =>
                        showMessage({
                            message: `${value} ${dataset.unit}`,
                            description: dataset.labels[index],
                            backgroundColor: mainColor
                        })
                    }
                    style={{
                        ...boxShadowLight,
                        ...styles.graph
                    }}
                    withInnerLines={false}
                    withOuterLines={false}
                />
            </TouchableOpacity>
        )
    }

    renderRightMetric = (item) => {
        if (item.visit) {
            return (
                <CustomButton
                    text={Strings.label_from_visit}
                    smallButton
                    grayButton
                    disabled
                />
            )
        }

        const metricObj = {
            name: item.name,
            name_label: item.name_label,
            unit: item.unit
        };

        return (
            <CustomButton
                text={Strings.label_add}
                smallButton
                onPress={() => this.goToAddMetric(metricObj)}
            />
        )
    }
    
    renderMetric = ({item, index}) => {
        const {
            text16,
            textBold,
            textWrap
        } = CommonStyles;

        const metricName = `${item.name_label} (${item.unit})`;

        return (
            <View>
                <View style={[styles.containerTitleGraph, { marginTop: index === 0 ? scale(10) : scale(30) }]}>
                    <Text style={[text16, textBold, textWrap]}>{metricName}</Text>
                    { this.renderRightMetric(item) }
                </View>
                <View style={styles.containerGraph}>
                    { this.renderChart(item) }
                </View> 
            </View>
        )
    }

    renderAddMetric = () => {
        return (
            <CustomButton
                onPress={() => this.goToAddMetric(null)}
                text={Strings.label_add_metric_result}
                isAbsolute
                icon={'body-outline'}
            />
        )
    }

    renderTitle = () => {
        return (
            <TitleComponent
                title={Strings.label_metrics}
                handleBack={this.handleBack}
            />
        )
    }

    render() {
        if(!this.state.metrics) {
            return <Spinner />
        }

        return (
            <ComponentWithBackground safeAreaEnabled>
                <FlatList
                    data={this.state.metrics}
                    renderItem={this.renderMetric}
                    keyExtractor={(_, index) => index.toString()}
                    refreshing={false}
                    refreshControl={this.preRenderRefreshControl}
                    contentContainerStyle={styles.list}
                    ListHeaderComponent={this.renderTitle}
                    ListEmptyComponent={this.renderEmptyMetric}
                />
                {this.renderAddMetric()}
            </ComponentWithBackground>
        );
    }
}

const styles = ScaledSheet.create({
    list: {
        flexGrow: 1,
        paddingBottom: '100@s'
    },
    graph: {
        borderRadius: '15@s',
        marginTop: '20@s'
    },
    containerTitleGraph: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: '15@s'
    },
    containerGraph: {
        marginHorizontal: '15@s'
    },
    label_no_results: {
        marginTop: '20@s',
        marginBottom: '30@s'
    }
});

export default withGlobal(
    (global) => ({
        refreshMetricsList: global[GLOBAL_REFRESH_METRICS_LIST]
    })
)(function(props) {
    const navigation = useNavigation();
  
    return <Metrics {...props} navigation={navigation} />;
});