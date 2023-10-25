import { PureComponent } from 'react';
import { AppState } from 'react-native';

export const APP_STATE_FOREGROUND = 'foreground';
export const APP_STATE_BACKGROUND = 'background';

class AppStateAwareComponent extends PureComponent {
    constructor(props) {
        super(props);

        this.appState = APP_STATE_FOREGROUND;
        this.appStateHandler = null;
    }

    componentDidMount() {
        this.subscribeToAppStateEvents();
    }

    componentWillUnmount() {
        this.unsubscribeFromAppStateEvents();
    }

    subscribeToAppStateEvents = () => {
        if (this.appStateHandler) {
            console.warn('Trying to subscribe again to app state events');
            return;
        }

        this.appStateHandler = AppState.addEventListener('change', (newAppState) => {
            let newState;
            switch (newAppState) {
                case 'active':
                    newState = APP_STATE_FOREGROUND;
                    break;
                default:
                    newState = APP_STATE_BACKGROUND;
                    break;
            }

            if (newState !== this.appState) {
                this.onAppStateChanged(newState);
            }

            this.appState = newState;
        });
    }

    unsubscribeFromAppStateEvents = () => {
        if (this.appStateHandler) {
            this.appStateHandler.remove();
        }
    }

    onAppStateChanged = () => {
        throw new Error('AppStateAwareComponent must implement an onAppStateChanged method');
    }

    render() {
        throw new Error('Cannot render a AppStateAwareComponent by itself');
    }
}

export default AppStateAwareComponent;
