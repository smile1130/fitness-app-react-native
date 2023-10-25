import React from 'react';
import { ScaledSheet } from 'react-native-size-matters';
import { Spinner } from '../common/Spinner';
import ComponentWithBackground from '../common/ComponentWithBackground';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import TitleComponent from '../common/TitleComponent';
import { Strings } from '../../config/Strings';
import { CommonStyles } from '../../styles/CommonStyles';
import { red } from '../../styles/colors';

const ChatList = ({
	conversations,
	loadConversations,
	handleChat
}) => {
	const goToChat = (id) => {
		handleChat(id);
	}

	const renderLastMessage = (item) => {
		const {
			text11,
			grayText,
			textWrap
		} = CommonStyles;

		if (!item.lastMessage.type) {
			return (
				<Text style={[text11, grayText, textWrap]}>
					{Strings.label_no_message}
				</Text>
			)
		}

		return (
			<Text numberOfLines={2} ellipsizeMode="tail" style={[text11, grayText, textWrap]}>
				{item.lastMessage.type === 'text' ? item.lastMessage.message : `[${Strings.label_attachment}]`}
			</Text>
		)
	}

	const renderUnreadCount = (item) => {
		if (item.unreadCount === 0) {
			return;
		}

		const {
			whiteText,
			text10,
			textBold
		} = CommonStyles;

		return (
			<View style={styles.unreadCount}>
				<Text style={[text10,textBold, whiteText]}>{item.unreadCount}</Text>
			</View>
		)
	}

	const renderConversationItem = ({ item }) => {
		const {
			text14,
			text10,
			textBold,
			grayText,
			textWrap
		} = CommonStyles;

		return (
			<TouchableOpacity style={styles.conversationItem} onPress={() => goToChat(item.id)} activeOpacity={0.8}>
				<FastImage
					source={{
						uri: item.chatInfo.photo,
					}}
					style={styles.avatar}
				/>
				<View style={styles.conversationItemInner}>
					<View style={styles.conversationItemTitle}>
						<Text style={[text14, textBold, textWrap]}>{item.chatInfo.title}</Text>
						{
							item.lastMessage.type &&
								<Text style={[text10, grayText]}>{item.lastMessage.createdAtHumans}</Text>
						}
					</View>
					<View style={styles.conversationItemMessages}>
						{renderLastMessage(item)}
						{renderUnreadCount(item)}
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	const renderTitle = () => {
        return (
            <TitleComponent
                title={Strings.label_chat}
                hideBack
            />
        )
    }

	if (!conversations) {
		return <Spinner />
	}

	return (
		<ComponentWithBackground safeAreaEnabled>
			<FlatList
				data={conversations}
				renderItem={renderConversationItem}
				keyExtractor={(item) => item.id.toString()}
				refreshing={!conversations}
                onRefresh={loadConversations}
				ListHeaderComponent={renderTitle}
			/>
		</ComponentWithBackground>
	);
};

const styles = ScaledSheet.create({
	avatar: {
		width: '40@s',
		height: '40@s',
		borderRadius: '20@s'
	},
	conversationItem: {
		flexDirection: 'row',
		paddingHorizontal: '15@s',
		marginBottom: '30@s'
	},
	conversationItemInner: {
		flex: 1,
		marginLeft: '10@s'
	},
	conversationItemTitle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: '3@s'
	},
	conversationItemMessages: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end'
	},
	unreadCount: {
		backgroundColor: red,
		width: '16@s',
		height: '16@s',
		borderRadius: '8@s',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default ChatList;