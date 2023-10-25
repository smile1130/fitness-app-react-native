import React, { PureComponent } from 'reactn';
import {
	View,
	TextInput,
	KeyboardAvoidingView
} from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { white, black, gray2, gray3 } from '../../../styles/colors';
import { isAndroid, getUserData } from '../../../config/Util';
import { Strings } from '../../../config/Strings';
import UploadMedias from '../../common/UploadMedias';
import CustomButtonIcon from '../../common/CustomButtonIcon';

class Sender extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			height: 0,
			textMessage: null,
		};

		this.time = null;
		this.loggedUserId = getUserData().userId;
	}

	clearInput() {
		this.setState({
			height: scale(26),
			textMessage: null,
		});
	}

	sendTextMessage = () => {
		const params = {
			message: this.state.textMessage,
		};

		this.props.handleSend(params);
	};

	renderInnerSender = () => {
		if (
			!this.state.textMessage ||
			this.state.textMessage.length <= 0
		) {
			return null;
		}

		return (
			<View style={styles.senderIconContainer}>
				<CustomButtonIcon
					onPress={this.sendTextMessage}
					icon={'paper-plane-outline'}
					iconStyle={styles.iconSend}
				/>
			</View>
		)
	}
	handleFile = (params) => {
		this.props.handleSend(params, false);
	}

	render() {
		return (
			<KeyboardAvoidingView behavior={isAndroid ? "height" : "padding"} keyboardVerticalOffset={scale(0)}>
				<View style={styles.sender}>
					<UploadMedias
						handleFileChange={this.handleFile}
						showLabel={false}
						isCustomIcon
						icon={'attach-outline'}
					/>
					<View style={styles.inputContainer}>
						<TextInput
							ref={(input) => { this.refTextMessage = input; }}
							placeholder={Strings.label_message}
							style={[styles.input, {
								height: Math.min(scale(120), Math.max(scale(14), this.state.height))
							}]}
							multiline
							onContentSizeChange={(event) => { this.setState({ height: event.nativeEvent.contentSize.height }) }}
							value={this.state.textMessage}
							onChangeText={(textMessage) => { this.setState({ textMessage }) }}
						/>
					</View>
					{this.renderInnerSender()}
				</View>
			</KeyboardAvoidingView>
		)
	}
}

const styles = ScaledSheet.create({
	sender: {
		flexDirection: 'row',
		marginVertical: '0@s',
		paddingHorizontal: '15@s',
		paddingVertical: '10@s',
		alignItems: 'flex-end',
		backgroundColor: gray2
	},
	senderIconContainer: {
		flex: 0,
		paddingBottom: '5@s',
		marginLeft: '10@s'
	},
	inputContainer: {
		flex: 1,
		borderRadius: '13@s',
		backgroundColor: white,
		borderColor: gray3,
		borderWidth: '1@s',
		paddingHorizontal: '10@s',
		paddingVertical: isAndroid ? 0 : '10@s',
		marginLeft: '10@s'
	},
	input: {
		fontSize: '12@s',
		overflow: 'hidden',
		justifyContent: 'center',
		alignItems: 'center',
		flexWrap: 'wrap',
		paddingTop: isAndroid ? '8@s' : 0,
		paddingBottom: isAndroid ? '10@s' : 0,
		textAlign: 'left',
		color: black
	},
	iconSend: {
		marginRight: '2@s'
	}
});

export default Sender;