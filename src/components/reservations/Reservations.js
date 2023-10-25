import React, { PureComponent } from 'react';
import { withGlobal, setGlobal } from 'reactn';
import {
    FlatList,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import ComponentWithBackground from '../common/ComponentWithBackground';
import { CommonStyles } from '../../styles/CommonStyles';
import { white } from '../../styles/colors';
import { Strings } from '../../config/Strings';
import ReservationService from '../../services/ReservationService';
import EmptySection from '../common/EmptySection';
import { Spinner } from '../common/Spinner';
import { showMessage } from 'react-native-flash-message';
import { GLOBAL_REFRESH_RESERVATIONS } from '../../state/StateInitializer';
import ReservationItem from './ReservationItem';
import TitleComponent from '../common/TitleComponent';
import CustomFilters from '../common/CustomFilters';

class Reservations extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            reservations: null,
            myReservations: null,
            days: null,
            filters: [
                {
                    key: 0,
                    title: Strings.label_reserve
                },
                {
                    key: 1,
                    title: Strings.label_reserved_plural
                }
            ],
            currentIndex: 0
        };
    }

    componentDidMount() {
        this.getReservations();
    }

    componentDidUpdate(prevProps) {
        if(
            this.props.refreshReservations !== prevProps.refreshReservations
            && this.props.refreshReservations
        ) {
            setGlobal({
                [GLOBAL_REFRESH_RESERVATIONS]: false
            });

            this.getReservations();
        }
    }

    handleBack = () => {
        this.props.navigation.goBack();
    }

    getReservations = () => {
        ReservationService.reservations()
            .then((data) => {
                this.setState({
                    reservations: data.reservations,
                    myReservations: data.myReservations,
                    days: data.days
                })
            });
    }

    callbackElement = () => {
        this.getReservations();
    }

    renderElement = ({ item, index }) => {
        return (
            <ReservationItem
                item={item}
                reservations={this.state.reservations}
                callback={this.callbackElement}
            />
        )
    }

    renderEmptyReservations = () => {
        return (
            <EmptySection style={styles.emptySection} text={Strings.strings_empty_reservations} icon={'calendar'} />
        )
    }

    goToDate = (date) => {
        const index = this.state.reservations.findIndex(object => {
            return object.real_start_date === date;
        });

        if(index === -1) {
            showMessage({
                message: Strings.strings_no_reservations_available_on_date,
                type: "danger",
            });
            return;
        }

        this.props.navigation.navigate('ReservationDetail', {
            date
        });
    }

    renderCalendarDay = ({ item, index }) => {
        const {
            mainText,
            textBold,
            text11,
            textUppercase,
            boxShadowLight
        } = CommonStyles;

        return (
            <TouchableOpacity
                onPress={() => this.goToDate(item.date)}
                style={[boxShadowLight, styles.containerDay]}
                activeOpacity={0.8}
            >
                <Text style={[text11, textBold, mainText]}>{item.day} {item.month}</Text>
                <Text style={[textBold, textUppercase]}>{item.week_name}</Text>
            </TouchableOpacity>
        )
    }

    renderHeader = () => {
        return (
            <TitleComponent
                title={Strings.label_reservations}
                handleBack={this.handleBack}
            />
        )
    }

    renderReservations = () => {
        if (!this.state.reservations) {
            return <Spinner />
        }

        return (
            <FlatList
                data={this.state.reservations}
                extraData={this.state.reservations}
                renderItem={this.renderElement}
                keyExtractor={(_, index) => index.toString()}
                refreshing={!this.state.reservations}
                onRefresh={this.getReservations}
                ListHeaderComponent={this.renderTitle}
                ListEmptyComponent={this.renderEmptyReservations}
            />
        )
    }

    renderMyReservations = () => {
        return (
            <FlatList
                data={this.state.myReservations}
                extraData={this.state.myReservations}
                renderItem={this.renderElement}
                keyExtractor={(_, index) => index.toString()}
                refreshing={!this.state.reservations}
                onRefresh={this.getReservations}
                ListHeaderComponent={this.renderTitle}
                ListEmptyComponent={this.renderEmptyReservations}
            />
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

    renderDays = () => {
        return (
            <FlatList
                data={this.state.days}
                renderItem={this.renderCalendarDay}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                style={styles.calendarDays}
            />
        )
    }

    renderTitle = () => {
        return (
            <View>
                {this.renderHeader()}
                {this.renderFilters()}
                {this.state.currentIndex === 0 ? this.renderDays() : null}
            </View>
        )
    }

    renderContent = () => {
        return this.state.currentIndex === 0 ? this.renderReservations() : this.renderMyReservations();
    }

    render() {
        return (
            <ComponentWithBackground safeAreaEnabled>
                { this.renderContent() }
            </ComponentWithBackground>
        );
    }
}

const styles = ScaledSheet.create({
    emptySection: {
        marginTop: '30@s'
    },
    containerDay: {
        paddingVertical: '18@s',
        paddingHorizontal: '18@s',
        backgroundColor: white,
        margin: '5@s',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10@s',
    },
    calendarDays: {
        paddingHorizontal: '10@s',
        marginTop: '5@s'
    }
});

export default withGlobal(
    (global) => ({
        refreshReservations: global[GLOBAL_REFRESH_RESERVATIONS]
    })
)(function(props) {
    const navigation = useNavigation();
  
    return <Reservations {...props} navigation={navigation} />;
});