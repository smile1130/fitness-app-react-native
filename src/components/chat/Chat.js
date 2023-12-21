import React, { withGlobal } from 'reactn';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Pusher from 'pusher-js/react-native';
import { ScaledSheet } from 'react-native-size-matters';

import ComponentWithBackground from '../common/ComponentWithBackground';
import { white, gray2 } from '../../styles/colors';
import { CommonStyles } from '../../styles/CommonStyles';
import ChatBalloon from './common/ChatBalloon';
import { pusherConfig } from '../../config/Pusher';
import ChatService from '../../services/ChatService';
import { getCurrentDate, getUserData } from '../../config/Util';
import { Spinner } from '../common/Spinner';
import { Strings } from '../../config/Strings';
import Sender from './common/Sender';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AppStateAwareComponent, { APP_STATE_FOREGROUND } from '../common/AppStateAwareComponent';
import { ChatDotContext } from '../../contexts/ChatDotProvider';
import { hideMessage } from 'react-native-flash-message';
import TitleComponent from '../common/TitleComponent';
import ChatList from './ChatList';
import { GLOBAL_INITIAL_STATE } from '../../state/StateInitializer';
import EmptySection from '../common/EmptySection';

class Chat extends AppStateAwareComponent {
	static contextType = ChatDotContext;

	constructor(props) {
		super(props);
		this.state = {
			messages: [],
			loadingConversation: true,
			loadingPagination: false,
			conversation: null,
			textMessage: null,
			totalMessages: null,
			conversationId: this.props.route.params?.conversationId ?? null,
			loadingConversations: true,
			conversations: null,
			hasOneChat: false
		};

		this.time = null;
		this.page = 1;
		this.senderRef = React.createRef();

		const { userId } = getUserData();

		this.loggedUserId = userId;
		this.chatChannelName = `Chat.User.${this.loggedUserId}`;

		this.navigationBlurUnsubscribe = undefined;
		this.navigationFocusUnsubscribe = undefined;

		this.initPusherCoach();
	}

	componentDidMount() {
		super.componentDidMount();

		// Prevent all initial call if chat is disabled
		if (this.props.initialState && !this.props.initialState.chatEnabled) {
			return;
		}

		this.setInitTime();

		if (this.state.conversationId) {
			this.loadConversation();
		} else {
			this.loadConversations();
		}

		this.subscribeToChatEvents();
		this.subscribeToNavigationEvents();
	}

	componentWillUnmount() {
		super.componentWillUnmount();

		this.doCleanup();
		this.unsubscribeToNavigationEvents();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.isFocused !== prevProps.isFocused) {
			this.handleOnFocus(this.props.isFocused);
		}

		if (this.state.conversationId !== prevState.conversationId) {
			this.context.setUpdatable(true);
			this.markAsRead();
			this.context.setUpdatable(false);
		}
	}

	doCleanup = () => {
		this.context.setHideNotification(false);
		this.unsubscribeFromChatEvents();
	};

	navigateToMedias = () => {
		this.props.navigation.navigate('Medias', {
			conversationId: this.state.conversationId
		});
	};

	initPusherCoach = () => {
		this.pusher = new Pusher(pusherConfig.key, pusherConfig);
	};

	subscribeToNavigationEvents = () => {
		this.navigationBlurUnsubscribe = this.props.navigation.addListener(
			'blur',
			this.onNavigationBlur,
		);
		this.navigationFocusUnsubscribe = this.props.navigation.addListener(
			'focus',
			this.onNavigationFocus,
		);
	};

	unsubscribeToNavigationEvents = () => {
		if (typeof this.navigationBlurUnsubscribe === 'function') {
			this.navigationBlurUnsubscribe();
		}

		if (typeof this.navigationFocusUnsubscribe === 'function') {
			this.navigationFocusUnsubscribe();
		}
	};

	subscribeToChatEvents = () => {
		if (this.chatChannel) {
			console.warn('Trying to subscribe again to chat events');
			return;
		}

		this.chatChannel = this.pusher.subscribe(this.chatChannelName);
		this.chatChannel.bind(
			'pusher:subscription_succeeded',
			this.handleChatSubscription,
		);
	};

	unsubscribeFromChatEvents = () => {
		if (!this.chatChannel) {
			return;
		}

		this.chatChannel.unbind('incoming.message', this.handleIncomingMessage);
		this.chatChannel.unbind(
			'pusher:subscription_succeeded',
			this.handleChatSubscription,
		);
		this.pusher.unsubscribe(this.chatChannelName);

		this.chatChannel = null;
	};

	handleChatSubscription = () => {
		this.chatChannel.bind('incoming.message', this.handleIncomingMessage);
	};

	handleIncomingMessage = data => {
		if (!this.state.conversationId) {
			this.loadConversations();
		}

		if (this.state.conversationId && data.conversationId === this.state.conversationId) {
			console.log('INCOMING MESSAGE');
			this.handleNewMessage(data);
		}
	};

	handleOnFocus = (onFocus) => {
		if (onFocus) {
			if (this.state.conversationId) {
				this.loadMessagesFromLastMessageLoaded();
			} else {
				this.loadConversations();
			}

			this.subscribeToChatEvents();
		} else {
			this.unsubscribeFromChatEvents();
		}
	}

	onAppStateChanged = newState => {
		this.handleOnFocus(newState === APP_STATE_FOREGROUND);
	};

	onNavigationBlur = () => {
		this.doCleanup();
		this.context.setUpdatable(true);
	};

	onNavigationFocus = () => {
		this.context.setHideNotification(true);
		this.markAsRead();
		this.context.setUpdatable(false);
	};

	handleChat = (id, hasOneChat = false) => {
		// Reset all values
		this.page = 1;
		this.setInitTime();

		this.setState({
			conversationId: id,
			conversation: null,
			loadingConversation: true,
			messages: [],
			totalMessages: null,
			hasOneChat
		}, () => {
			this.loadConversation();
		});
	}

	markAsRead = (reloadConversations = false) => {
		// Hide chat dot
		this.context.updateShowDot(false);

		if (this.state.conversationId) {
			console.log('MARK AS READ ', this.state.conversationId);

			ChatService.markAsRead({
				id: this.state.conversationId,
			}).finally(() => {
				if (reloadConversations) {
					this.loadConversations();
				}
			});
		}
	};

	handleBack = () => {
		this.markAsRead(true);

		this.setState({
			conversationId: null,
			conversation: null,
			loadingConversation: true
		});
	}

	setInitTime = () => {
		this.time = getCurrentDate();
	};

	loadMessagesFromLastMessageLoaded = () => {
		console.log('LOAD MESSAGES FROM LAST MESSAGE LOADED');
		let lastMessageId = null;

		if (!this.state.messages || this.state.messages.length === 0) {
			return null;
		}

		lastMessageId = this.state.messages[0].id;

		const params = {
			conversationId: this.state.conversationId,
			lastMessage: lastMessageId,
		};

		ChatService.loadMessagesFromLastMessageLoaded(params).then(data => {
			this.setState({
				messages: [...data.messages, ...this.state.messages],
			});

			this.page += 1;
		});
	};

	loadConversations = () => {
		console.log('LOAD CONVERSATIONS');

		ChatService.conversations().then(data => {
			// Render Chat if one
			if (data.conversations.length === 1) {
				this.handleChat(data.conversations[0].id, true);

				return;
			}

			this.setState({
				conversations: data.conversations,
				loadingConversations: false
			});
		});
	}

	loadConversation = () => {
		console.log('LOAD SINGLE CONVERSATION');

		const params = {
			time: this.time,
			page: this.page,
			conversationId: this.state.conversationId
		};

		this.setState({
			loadingPagination: true,
		});

		ChatService.conversation(params).then(data => {
			this.setState({
				conversationId: data.conversation.id,
				conversation: data.conversation,
				messages:
					this.page === 1
						? data.messages
						: [...this.state.messages, ...data.messages],
				totalMessages: data.totalMessages,
				loadingConversation: false,
				loadingPagination: false,
			});

			this.page += 1;
		});
	};

	handleNewMessage = message => {
		var messages = [message].concat(this.state.messages);

		this.setState({ messages });
	};

	handleSend = (params, isText = true) => {
		let new_params = {
			...params,
			conversationId: this.state.conversationId
		};

		if (isText) {
			this.senderRef.current.clearInput();
		}

		ChatService.sendMessage(new_params)
			.then(data => {
				this.handleNewMessage(data.message);
			})
			.catch(error => {
				console.log('catch', error);
			})
			.finally(() => {
				if (!isText) {
					hideMessage(); // Hide uploading message
				}
			});
	};

	loadMoreMessage = () => {
		const {
			text14,
			textRegular,
			mainText
		} = CommonStyles;

		if (this.state.loadingPagination) {
			return <Spinner size={'small'} />
		}

		if (
			this.state.messages &&
			this.state.messages.length > 0 &&
			this.state.messages.length < this.state.totalMessages
		) {
			return (
				<TouchableOpacity
					style={styles.loadMoreContainer}
					onPress={this.loadConversation}
					hitSlop={{
						top: 15,
						bottom: 15
					}}
				>
					<Text style={[text14, mainText, textRegular]}>{Strings.label_load_more_messages}</Text>
				</TouchableOpacity>
			)
		}

		return null;
	}

	renderItem = ({ item, index }) => {
		const beforeData = this.state.messages[index + 1]; // Inverse because inverted list
		const nextData = this.state.messages[index - 1]; // Inverse because inverted list

		return (
			<ChatBalloon
				data={item}
				beforeData={beforeData}
				nextData={nextData}
				otherImage={item.sender.photo}
				loggedUserId={this.loggedUserId}
			/>
		)
	}

	renderContent = () => {
		return (
			<View style={styles.mainContainer}>
				<FlatList
					data={this.state.messages}
					extraData={this.state.messages}
					renderItem={this.renderItem}
					keyExtractor={(item, index) => index.toString()}
					showsVerticalScrollIndicator={false}
					inverted={true}
					ListFooterComponent={this.loadMoreMessage}
					removeClippedSubviews={true}
				/>
			</View>
		)
	}

	renderSender = () => {
		return (
			<Sender
				ref={this.senderRef}
				handleSend={this.handleSend}
				textMessage={this.state.textMessage}
			/>
		)
	}

	renderHeader = () => {
		const { text14, textBold, textWrap, blackText } = CommonStyles;

		return (
			<TitleComponent
				title={this.state.conversation.chatInfo.title}
				titleStyle={{ ...text14, ...textBold, ...textWrap, ...blackText }}
				image={this.state.conversation.chatInfo.photo}
				icon={'document-attach-outline'}
				actionPress={this.navigateToMedias}
				hideBack={this.state.hasOneChat}
				handleBack={this.handleBack}
			/>
		)
	};

	renderConversation = () => {
		if (this.state.loadingConversation) {
			return <Spinner />
		}

		return (
			<ComponentWithBackground safeAreaEnabled>
				{this.renderHeader()}
				{this.renderContent()}
				{this.renderSender()}
			</ComponentWithBackground>
		);
	}

	renderConversations = () => {
		if (this.state.loadingConversations) {
			return <Spinner />
		}

		return (
			<ChatList
				conversations={this.state.conversations}
				loadConversations={this.loadConversations}
				handleChat={this.handleChat}
			/>
		);
	}

	rendereChatDisabled = () => {
		return (
			<ComponentWithBackground safeAreaEnabled>
				<EmptySection text={Strings.strings_unavailable_chat} icon={'chatbubbles-outline'} />
			</ComponentWithBackground>
		)
	}

	render() {
		if (this.props.initialState && !this.props.initialState.chatEnabled) {
			return this.rendereChatDisabled();
		}

		if (this.state.conversationId) {
			return this.renderConversation();
		}

		return this.renderConversations();
	}
}

const styles = ScaledSheet.create({
	mainContainer: {
		flex: 1,
		backgroundColor: white,
		paddingHorizontal: '12@s'
	},
	loadMoreContainer: {
		alignItems: 'center',
		marginVertical: '10@s'
	}
});



export default withGlobal(
	(global) => ({
		initialState: global[GLOBAL_INITIAL_STATE]
	})
)(function (props) {
	const navigation = useNavigation();
	const isFocused = useIsFocused();

	return <Chat {...props} navigation={navigation} isFocused={isFocused} />;
});