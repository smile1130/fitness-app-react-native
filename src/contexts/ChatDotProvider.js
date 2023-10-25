import React, { PureComponent } from 'react';
import OneSignal from 'react-native-onesignal';

export const ChatDotContext = React.createContext({
    showDot: false,
    setUpdatable: () => {
        throw new Error('Trying to use ChatDotContext without its ChatDotProvider.');
    },
    setHideNotification: () => {
        throw new Error('Trying to use ChatDotContext without its ChatDotProvider.');
    },
    updateShowDot: () => {
        throw new Error('Trying to use ChatDotContext without its ChatDotProvider.');
    },
});

class ChatDotProvider extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showDot: !!this.props.showDot,
            updatable: true,
        };
    }

    componentDidMount() {
        this.initChatNotificationListener();
    }

    componentDidUpdate(prevProps, prevState) {
        // Update the notification dot from the showDot prop only if
        // the previous value is falsy and the current is truthy.
        if (!prevState.showDot && this.props.showDot && this.props.showDot !== prevProps.showDot) {
            this.setState({
                showDot: true,
            });
        }
    }

    initChatNotificationListener() {
        //Method for handling notifications received while app in foreground
        OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
            let notification = notificationReceivedEvent.getNotification();
            const data = notification.additionalData

            // Complete with null means don't show a notification.
            let notificationToShow = (this.state.hideNotification && data && data.data && data.data.routeName === 'Chat') ? null : notification;

            notificationReceivedEvent.complete(notificationToShow);

            // Update the notification dot from the showDot prop only if
            // the previous value is false and the current is true.
            if (!this.state.showDot && this.state.updatable) {
                this.setState((prev) => ({
                    ...prev,
                    showDot: true,
                }));
            }
        });
    }

    updateShowDot = (showDot) => {
        this.setState((prev) => ({
            ...prev,
            showDot: !!showDot,
        }));
    }   

    setUpdatable = (updatable) => {
        this.setState((prev) => ({
            ...prev,
            updatable: !!updatable,
        }));
    }

    setHideNotification = (hide) => {
        this.setState((prev) => ({
            ...prev,
            hideNotification: !!hide,
        }));
    }

    render() {
        const {showDot} = this.state;

        return (
            <ChatDotContext.Provider value={{
                showDot,
                setUpdatable: this.setUpdatable,
                setHideNotification: this.setHideNotification,
                updateShowDot: this.updateShowDot,
            }}>
                {this.props.children}
            </ChatDotContext.Provider>
        );
    }
}

export default ChatDotProvider;
