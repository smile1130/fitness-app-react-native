import moment from 'moment';
import React, { PureComponent } from 'react';
import ResponseMessage from '../components/common/ResponseMessage';
import { Spinner } from '../components/common/Spinner';
import { Strings } from '../config/Strings';
import { getLastWorkoutId, getLocaleFromDevice, getUserData, setInitialState, setUserData } from '../config/Util';
import InitialStateService from '../services/InitialStateService';
import { AuthContext } from './Auth';
import Dialog from "react-native-dialog";
import * as RootNavigation from '../../src/config/RootNavigation';
import FlashMessage from 'react-native-flash-message';

// This should be the same structure as the returned object from InitialStateController.php
export const InitialStateContext = React.createContext({
    hasUnreadMessages: false,
    unreadNotifications: 0,
    updateLanguage: () => {
        throw new Error('Trying to use InitialStateContext without its InitialStateProvider.');
    },
    updateUnreadNotifications: () => {
        throw new Error('Trying to use InitialStateContext without its InitialStateProvider.');
    },
    updateIsActiveModalVisible: () => {
        throw new Error('Trying to use InitialStateContext without its InitialStateProvider.');
    },
    forceLogout: () => {
        throw new Error('Trying to use InitialStateContext without its InitialStateProvider.');
    },
});

class InitialStateProvider extends PureComponent {
    static contextType = AuthContext;

    constructor(props) {
        super(props);

        this.state = {
            error: false,
            loading: true,

            // This should be the same structure as the returned object from InitialStateController.php
            hasUnreadMessages: false,
            unreadNotifications: 0,
            isActiveModalVisible: false
        };

        this.isLoggedIn = false;
    }

    componentDidMount() {
        this.setupInitialState();
        this.isLoggedIn = !!this.context.authData;
    }

    componentDidUpdate() {
        const isNowLoggedIn = !!this.context.authData;

        if (this.isLoggedIn !== isNowLoggedIn) {
            this.isLoggedIn = isNowLoggedIn;
            this.setupInitialState();
        }
    }

    changeLanguage = (language, reloadApp = false) => {
        Strings.setLanguage(language);
                
        //Set locale it
        moment.locale(language);

        // Set locale UserData
        const userData = getUserData();

        if (userData) {
            userData.locale = language;
            setUserData(userData);
        }

        if (reloadApp) {
            //Trick to reload app
            this.setState({
                loading: true
            });
        } else {
            this.setState({
                loading: false
            });
        }
    }

    updateLanguage = (language) => {
        this.changeLanguage(language, true);
    }

    updateUnreadNotifications = (unreadNotifications) => {
        this.setState({
            unreadNotifications
        });
    }

    updateIsActiveModalVisible = (isActive) => {
        if (!isActive) {
            this.setState({ isActiveModalVisible: true });
        }
    }

    forceLogout = () => {
        this.context.signOut();
    }

    setupInitialState = () => {
        if (!this.state.loading) {
            this.setState({
                error: false,
                loading: true,
            });
        }

        InitialStateService.getInitialState()
        .then((initialState) => {
            if(initialState && initialState.locale) {
                this.changeLanguage(initialState.locale);
            } else {
                const languageFromDevice = getLocaleFromDevice();
                this.changeLanguage(languageFromDevice);
            }

            setInitialState(initialState);

            this.setState({
                loading: false,
                ...initialState,
            }, async () => {
                if (initialState && !initialState.isActive) {
                    this.setState({ isActiveModalVisible: true });
                }

                if (initialState && initialState.showSurvey) {
                    this.openWelcomeSurveys();
                }

                const lastWorkoutId = await getLastWorkoutId();

                if (lastWorkoutId) {
                    this.openWorkoutDetail(lastWorkoutId);
                }
            });
        })
        .catch((error) => {
            console.warn(error);

            this.setState({ error: true, loading: false });
        });
    }

    openWelcomeSurveys = () => {
        RootNavigation.navigate('SurveyForm', {
            type: 'WELCOME',
            notCompleted: 1
        });
    }

    openWorkoutDetail = (id) => {
        RootNavigation.navigate('WorkoutDetail', {
            id
        });
    }

    openChat = () => {
        this.setState({
            isActiveModalVisible: false
        }, () => {
            RootNavigation.navigate('Chat');
        });
    }

    renderClientNotActive = () => {
        return (
            <Dialog.Container visible={this.state.isActiveModalVisible}>
                <Dialog.Title>{Strings.strings_disabled_user}</Dialog.Title>
                <Dialog.Button label={Strings.label_contact} onPress={() => this.openChat()} />
            </Dialog.Container>
        )
    }

    render() {
        const {error, loading, ...initialState} = this.state;

        if (loading) {
            return <Spinner />;
        }

        if (error) {
            return (
                <ResponseMessage 
                    title={Strings.exceptions_generic}
                    description={Strings.strings_initial_state_error_desc}
                    buttonText={Strings.label_retry}
                    onButtonPress={this.setupInitialState}
                    hasButton
                />
            );
        }

        return (
            <InitialStateContext.Provider value={{
                ...initialState,
                updateLanguage: this.updateLanguage,
                updateIsActiveModalVisible: this.updateIsActiveModalVisible,
                updateUnreadNotifications: this.updateUnreadNotifications,
                forceLogout: this.forceLogout,
            }}>
                {this.props.children}
                {this.renderClientNotActive()}
                <FlashMessage
					position="bottom"
					icon="auto"
				/>
            </InitialStateContext.Provider>
        );
    }
}

export default InitialStateProvider;
