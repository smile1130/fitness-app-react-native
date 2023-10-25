import React, { PureComponent } from 'react';
import {
    ScrollView,
    View,
    Text,
    Keyboard,
    TouchableOpacity,
    TextInput
} from 'react-native';
import { setGlobal } from 'reactn';
import { showMessage } from 'react-native-flash-message';
import { ScaledSheet } from 'react-native-size-matters';
import ComponentWithBackground from '../../common/ComponentWithBackground';

import { mainColor, gray, darkGray, black, gray2 } from '../../../styles/colors';
import { CommonStyles } from '../../../styles/CommonStyles';
import InputBorder from '../../common/InputBorder';
import { Strings } from '../../../config/Strings';
import CustomButton from '../../common/CustomButton';
import MetricService from '../../../services/MetricService';
import { GLOBAL_REFRESH_METRICS_LIST } from '../../../state/StateInitializer';
import { formatYMDDateNoTZ, isAndroid } from '../../../config/Util';
import CustomDatePicker from '../../common/CustomDatePicker';
import { useNavigation } from '@react-navigation/native';
import TitleComponent from '../../common/TitleComponent';
import CustomSelectModal from '../../common/CustomSelectModal';

class NewResult extends PureComponent {
    constructor(props) {
        super(props);

        this.all_metrics = this.props.route.params.all_metrics;

        this.state = {
            mResult: null,
            mDate: new Date(),
            isDatePickerVisible: false,
            btnDisabled: false,
            selectedMetric: this.props.route.params.init_metric || null
        }
    }

    handleBack = () => {
        this.props.navigation.goBack();
    }

    formattedMetrics = () => {
        return this.all_metrics.map(function(metric) {
            return {
                label: `${metric.name_label} (${metric.unit})`,
                value: metric
            };
        });
    }

    checkDataBeforeSubmit = () => {
        if(!this.state.selectedMetric) {
            showMessage({
                message: Strings.exceptions_insert_metric,
                type: "danger",
            });
            return;
        } else if(
            !this.state.mResult
        ) {
            showMessage({
                message: Strings.exceptions_insert_result,
                type: "danger",
            });
            return;
        } else if(!this.state.mDate) {
            showMessage({
                message: Strings.exceptions_insert_date,
                type: "danger",
            });
            return;
        }

        this.addMResult();
    }

    addMResult = () => {
        Keyboard.dismiss();

        const params = {
            result: this.state.mResult,
            date: formatYMDDateNoTZ(this.state.mDate),
            name: this.state.selectedMetric.name,
            unit: this.state.selectedMetric.unit,
        };

        this.setState({
            btnDisabled: true
        });

        MetricService.addResult(params)
        .then(() => {
            // Refresh metrics list
            setGlobal({
                [GLOBAL_REFRESH_METRICS_LIST]: true
            });

            // Show success message
            showMessage({
                message: Strings.label_metric_result_added,
                type: "success",
            });

            // Go back
            setTimeout(() => {
                this.handleBack();
            }, 1500);
        }).catch(() => {
            this.setState({
                btnDisabled: false
            });    
        });
    }

    toggleDatePicker = () => {
        this.setState({isDatePickerVisible: !this.state.isDatePickerVisible});
    }

    formatDate = () => {
        return formatYMDDateNoTZ(this.state.mDate);
    }

    onChangeDate = (event, mDate) => {
        if(mDate !== undefined) {
            if(isAndroid) {
                this.setState({isDatePickerVisible: !this.state.isDatePickerVisible}, () => {
                    this.setState({ mDate });
                });
            } else {
                this.setState({ mDate });
            }
        } else {
            this.toggleDatePicker();
        }
    }

    renderDateModal = () => {
        return (
            <CustomDatePicker
                onChangeDate={this.onChangeDate}
                date={this.state.mDate}
                isDatePickerVisible={this.state.isDatePickerVisible}
                toggleModal={this.toggleDatePicker}
            />
        )
    }

    renderPickerSelect = () => {
        const formattedMetrics = this.formattedMetrics();

        const selected = this.state.selectedMetric ?
            formattedMetrics.find((item => {
                return JSON.stringify(item.value) === JSON.stringify(this.state.selectedMetric);
            })) : null;

        return (
            <CustomSelectModal
                label={Strings.label_metric}
                placeholder={Strings.label_insert_metric}
                defaultSelected={selected}
                onSelect={(selected) => this.setState({selectedMetric: selected})}
                items={formattedMetrics}
            />
        )
    }

    renderTitle = () => {
        return (
            <TitleComponent
                title={Strings.label_add_metric_result}
                handleBack={this.handleBack}
            />
        )
    }

    render() {
        return (
            <ComponentWithBackground safeAreaEnabled>
                <ScrollView contentContainerStyle={styles.list}>
                    {this.renderTitle()}
                    <View style={styles.container}>
                        {this.renderPickerSelect()}
                        <InputBorder
                            label={Strings.label_result}
                            placeholder={Strings.label_insert_result}
                            handleValue={(mResult) => this.setState({ mResult })}
                            text={this.state.mResult}
                            keyboardType={'numeric'}
                            marginTopInput
                        />
                        <TouchableOpacity activeOpacity={1} onPress={this.toggleDatePicker}>
                            <View style={styles.containerDate}>
                                <InputBorder
                                    label={Strings.label_date}
                                    placeholder={Strings.label_insert_date}
                                    text={this.formatDate()}
                                    editable={false}
                                />
                            </View>
                        </TouchableOpacity>
                        <CustomButton
                            onPress={this.checkDataBeforeSubmit}
                            text={Strings.label_save_metric_result}
                            disabled={this.state.btnDisabled}
                            icon={'checkmark-outline'}
                        />
                    </View>
                </ScrollView>
                {this.renderDateModal()}
            </ComponentWithBackground>
        );
    }
}

const styles = ScaledSheet.create({
    containerTitle: {
        marginTop: '10@s',
        marginBottom: '30@s'
    },
    container: {
        marginHorizontal: '15@s'
    },
    list: {
        marginBottom: '20@s'
    },
    mName: {
        marginBottom: '15@s'
    },
    saveBtn: {
        marginTop: '30@s',
        alignSelf: 'center',
        paddingHorizontal: '40@s',
        backgroundColor: mainColor
    },
    containerDate: {
        marginVertical: '20@s'
    },
	inputDate: {
        height: '40@s',
        fontSize: '14@s',
        fontWeight: '600',
        paddingHorizontal: '10@s',
        borderWidth: '1@s',
        borderRadius: '3@s',
        color: black,
        borderColor: gray2
    },
    labelDate: {
        color: darkGray,
        marginBottom: '7@s'
    }
});

export default function(props) {
    const navigation = useNavigation();
  
    return <NewResult {...props} navigation={navigation} />;
}