import React, { PureComponent } from 'react';
import {
    ScrollView
} from 'react-native';
import { setGlobal } from 'reactn';
import { useNavigation } from '@react-navigation/native';
import ComponentWithBackground from '../common/ComponentWithBackground';
import ReservationService from '../../services/ReservationService';
import { Spinner } from '../common/Spinner';
import { GLOBAL_REFRESH_RESERVATIONS } from '../../state/StateInitializer';
import ReservationItem from './ReservationItem';
import TitleComponent from '../common/TitleComponent';
import { Strings } from '../../config/Strings';

class Reservations extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            reservation: null,
        };
    }

    componentDidMount() {
        this.loadReservation();
    }

    loadReservation = () => {
        const date = this.props.route.params.date;

        ReservationService.workout({date})
        .then(data => {
            this.setState({reservation: data.reservation});
        }).catch();
    }

    handleBack = () => {
        this.props.navigation.goBack();
    }

    renderTitle = () => {
        return (
            <TitleComponent
                title={Strings.label_day_availability}
                handleBack={this.handleBack}
            />
        )
    }

    callbackElement = () => {
        this.loadReservation();
        setGlobal({
            [GLOBAL_REFRESH_RESERVATIONS]: true
        });
    }

    render() {
        if (!this.state.reservation) {
            return <Spinner />
        }

        return (
            <ComponentWithBackground safeAreaEnabled>
                <ScrollView>
                    {this.renderTitle()}
                    <ReservationItem
                        item={this.state.reservation}
                        callback={this.callbackElement}
                    />
                </ScrollView>
            </ComponentWithBackground>
        );
    }
}

export default function(props) {
    const navigation = useNavigation();
  
    return <Reservations {...props} navigation={navigation} />;
};