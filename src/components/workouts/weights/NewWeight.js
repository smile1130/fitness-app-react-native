import React, { Component } from 'react';
import {
    ScrollView,
    Keyboard
} from 'react-native';
import { setGlobal } from 'reactn';
import { showMessage } from 'react-native-flash-message';
import ComponentWithBackground from '../../common/ComponentWithBackground';

import { Strings } from '../../../config/Strings';
import { GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL, GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL_FROM_WORKOUT_DETAIL, GLOBAL_REFRESH_WEIGHTS_HISTORY_SINGLE_DETAIL, GLOBAL_REFRESH_WEIGHTS_LIST } from '../../../state/StateInitializer';
import { useNavigation } from '@react-navigation/native';
import WeightsHeader from './WeightsHeader';
import WeightsService from '../../../services/WeightsService';
import { formatYMDDateNoTZ } from '../../../config/Util';
import AddWeightsComponent from './AddWeightsComponent';

class NewWeight extends Component {
    constructor(props) {
        super(props);

        this.state = {
            btnDisabled: false
        }

        this.exercise = this.props.route.params ? this.props.route.params.exercise : null;
        this.weights = this.props.route.params ? this.props.route.params.weights : null;
        this.note = this.props.route.params ? this.props.route.params.note : null;
        this.wDate = this.props.route.params ? this.props.route.params.wDate : null;
        this.weightId = this.props.route.params ? this.props.route.params.weightId : null;
    }

    handleBack = () => {
        this.props.navigation.goBack();
    }

    addWeightResult = (weights, note, wDate) => {
        Keyboard.dismiss();

        const weightsClean = weights.map(function(item) { 
            delete item.exercise; 
            return item; 
        });

        let params = {
            exercise_id: this.exercise.exercise_id,
            sets: this.exercise.sets,
            type: this.exercise.final_type,
            value: this.exercise.final_value,
            weights: JSON.stringify(weightsClean),
            note: note,
            date: formatYMDDateNoTZ(wDate)
        };

        if(this.weightId) {
            params = {
                ...params,
                weight_id: this.weightId
            };
        }

        this.setState({
            btnDisabled: true
        });

        WeightsService.storeWeight(params)
        .then(() => {
            // Refresh metrics list
            setGlobal({
                [GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL]: true,
                [GLOBAL_REFRESH_WEIGHTS_HISTORY_SINGLE_DETAIL]: true,
                [GLOBAL_REFRESH_WEIGHTS_HISTORY_DETAIL_FROM_WORKOUT_DETAIL]: true,
                [GLOBAL_REFRESH_WEIGHTS_LIST]: true
            });

            // Show success message
            showMessage({
                message: Strings.label_weight_result_added,
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

    renderTitle = () => {
        return (
            <WeightsHeader exercise={this.exercise} />
        )
    }

    render() {
        return (
            <ComponentWithBackground safeAreaEnabled>
                <ScrollView>
                    {this.renderTitle()}
                    <AddWeightsComponent
                        exercise={this.exercise}
                        handleAction={this.addWeightResult}
                        btnActionDisabled={this.state.btnDisabled}
                        weights={this.weights}
                        note={this.note}
                        wDate={this.wDate}
                    />
                </ScrollView>
            </ComponentWithBackground>
        );
    }
}

export default function(props) {
    const navigation = useNavigation();
  
    return <NewWeight {...props} navigation={navigation} />;
}