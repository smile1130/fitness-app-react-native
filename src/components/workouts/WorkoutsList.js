import React, { PureComponent } from 'react';
import {
    FlatList,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { setGlobal, withGlobal } from 'reactn';
import { ScaledSheet, scale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import ComponentWithBackground from '../common/ComponentWithBackground';
import { mainColor } from '../../styles/colors';
import WorkoutDayCard from './WorkoutDayCard';
import { CommonStyles } from '../../styles/CommonStyles';
import { Strings } from '../../config/Strings';
import WorkoutService from '../../services/WorkoutService';
import { Spinner } from '../common/Spinner';
import EmptySection from '../common/EmptySection';
import { GLOBAL_INITIAL_STATE, GLOBAL_REFRESH_WORKOUTS_LIST } from '../../state/StateInitializer';
import { showMessage } from 'react-native-flash-message';
import { InitialStateContext } from '../../contexts/InitialStateProvider';
import TitleComponent from '../common/TitleComponent';
import CustomFilters from '../common/CustomFilters';

class WorkoutsList extends PureComponent {
    static contextType = InitialStateContext;

    constructor(props) {
        super(props);

        this.state = {
            coach: null,
            programs_todo: null,
            programs_completed: null,
            otherWorkouts: null,
            filters: [
                {
                    key: 0,
                    title: Strings.label_to_complete
                },
                {
                    key: 1,
                    title: Strings.label_done
                }
            ],
            currentIndex: 0
        };

        this.programs_info = [];
    };

    componentDidMount() {
        this.loadPrograms();
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.refreshWorkoutsList !== prevProps.refreshWorkoutsList
            && this.props.refreshWorkoutsList
        ) {
            setGlobal({
                [GLOBAL_REFRESH_WORKOUTS_LIST]: false
            });

            this.loadPrograms();
        }
    }

    setProgramsState = (data) => {
        let programs_todo = [];
        let programs_completed = [];
        this.programs_info = [];
        let otherWorkouts = 0;

        data.programs.map((program) => {

            if (!program.isCompleted) {
                this.programs_info.push({
                    'description': program.description,
                    'message': program.message,
                });
            }

            otherWorkouts += program.otherWorkouts;

            program.weeks.map((week) => {
                week.days.map((day) => {
                    if (day.workouts) {
                        programs_todo = programs_todo.concat(day.workouts.todo);
                        programs_completed = programs_completed.concat(day.workouts.completed);
                    }
                })
            })
        });

        const sorted_programs_todo = programs_todo.sort((a, b) => new Date(a.date_long) - new Date(b.date_long));
        const sorted_programs_completed = programs_completed.sort((a, b) => new Date(b.date_long) - new Date(a.date_long));

        this.setState({
            programs_todo: sorted_programs_todo,
            programs_completed: sorted_programs_completed,
            otherWorkouts,
            coach: data.coach
        });
    }

    handleBack = () => {
        this.props.navigation.goBack();
    }

    loadPrograms = () => {
        WorkoutService.programs()
            .then(data => {
                this.setProgramsState(data);
            }).catch();
    }

    goToPrograms = () => {
        this.props.navigation.navigate('Programs', {
            'programs': this.programs_info
        });
    }

    infoOtherWorkouts = () => {
        showMessage({
            message: Strings.strings_other_workouts_info,
            backgroundColor: mainColor,
            duration: 3000
        });
    }

    renderWorkout = ({ item, index }) => {
        const hideWorkoutDate = this.props.initialState && this.props.initialState.hideWorkoutDate;

        return (
            <WorkoutDayCard
                key={index}
                index={index}
                workout={item}
                hideWorkoutDate={hideWorkoutDate}
            />
        )
    }

    renderEmptyToDo = () => {
        if (this.state.otherWorkouts > 0) {
            return null;
        }

        return (
            <EmptySection style={styles.emptySection} text={Strings.strings_empty_to_do_workouts} icon={'barbell-outline'} />
        )
    }

    renderEmptyCompleted = () => {
        return (
            <EmptySection style={styles.emptySection} text={Strings.strings_empty_completed_workouts} icon={'barbell-outline'} />
        )
    }

    renderFooterTodo = () => {
        if (!this.state.otherWorkouts || this.state.otherWorkouts <= 0) {
            return null;
        }

        const {
            text14,
            text13,
            textBold
        } = CommonStyles;

        return (
            <TouchableOpacity
                style={styles.containerFooterTodo}
                onPress={this.infoOtherWorkouts}
            >
                <Text style={text13}>{Strings.formatString(Strings.strings_other_workouts, <Text style={[text14, textBold]}>{this.state.otherWorkouts}</Text>)}</Text>
                <Icon
                    name={'information-circle'}
                    size={scale(20)}
                    style={styles.infoIcon}
                />
            </TouchableOpacity>
        )
    }

    ToDo = () => {
        if (this.state.programs_todo === null) {
            return <Spinner style={styles.loader} />
        }

        return (
            <FlatList
                data={this.state.programs_todo}
                extraData={this.state.programs_todo}
                ListEmptyComponent={this.renderEmptyToDo}
                keyExtractor={(_, index) => index.toString()}
                renderItem={this.renderWorkout}
                refreshing={!this.state.programs_todo}
                onRefresh={this.loadPrograms}
                contentContainerStyle={styles.listContainerStyle}
                ListHeaderComponent={this.renderHeader}
                ListFooterComponent={this.renderFooterTodo}
            />
        );
    }

    Done = () => {
        if (this.state.programs_completed === null) {
            return <Spinner />
        }

        return (
            <FlatList
                data={this.state.programs_completed}
                extraData={this.state.programs_completed}
                ListEmptyComponent={this.renderEmptyCompleted}
                keyExtractor={(_, index) => index.toString()}
                renderItem={this.renderWorkout}
                refreshing={!this.state.programs_completed}
                onRefresh={this.loadPrograms}
                ListHeaderComponent={this.renderHeader}
                contentContainerStyle={styles.listContainerStyle}
            />
        );
    }

    renderTitle = () => {
        return (
            <TitleComponent
                title={Strings.label_workouts}
                handleBack={this.handleBack}
                isButton
                buttonText={Strings.label_notes}
                icon={'document-text-outline'}
                actionPress={this.goToPrograms}
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

    renderHeader = () => {
        return (
            <View>
                {this.renderTitle()}
                {this.renderFilters()}
            </View>
        )
    }

    renderContent = () => {
        return this.state.currentIndex === 0 ? this.ToDo() : this.Done();
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
    listContainerStyle: {
        flexGrow: 1,
        paddingBottom: '90@s'
    },
    containerFooterTodo: {
        marginTop: '20@s',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    infoIcon: {
        marginLeft: '5@s'
    },
    loader: {
        marginTop: '40@s'
    },
    emptySection: {
        marginTop: '30@s'
    }
});

export default withGlobal(
    (global) => ({
        refreshWorkoutsList: global[GLOBAL_REFRESH_WORKOUTS_LIST],
        initialState: global[GLOBAL_INITIAL_STATE]
    })
)(WorkoutsList);