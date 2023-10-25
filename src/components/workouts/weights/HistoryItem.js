import React, { PureComponent } from 'reactn';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { scale, ScaledSheet } from 'react-native-size-matters';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { mainColor, mainColorDark, white, gray2, mainColorLight, black } from '../../../styles/colors';
import { CommonStyles } from '../../../styles/CommonStyles';
import { Strings } from '../../../config/Strings';
import { useNavigation } from '@react-navigation/native';
import ExerciseCardIconsBlock from '../ExerciseCardIconsBlock';
import { isAndroid } from '../../../config/Util';
import WeightsService from '../../../services/WeightsService';
import WeightAttachments from './WeightAttachments';
import { hideMessage } from 'react-native-flash-message';
import CustomButtonIcon from '../../common/CustomButtonIcon';

class HistoryItem extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            item: this.props.item,
            height: 0,
            textMessage: null
        };
    };

    componentDidUpdate(prevProps) {
        if (prevProps.item !== this.props.item) {
            this.setState({ item: this.props.item });
        }
    }

    clearInput() {
        this.setState({
            height: scale(26),
            textMessage: null
        });
    }

    sendTextMessage = () => {
        const params = {
            text: this.state.textMessage
        };

        WeightsService.storeWeightMessage(this.state.item.id, params)
            .then((data) => {
                let item = this.state.item;
                item.messages = [...item.messages, data.message];

                this.setState({
                    item: { ...item }
                });

                this.clearInput();
            }).catch(null);
    }

    renderTable = () => {
        const {
            text12,
            text14,
            textBold,
            blackText,
            whiteText
        } = CommonStyles;

        if (
            this.props.exercise.exerciseType === 'circuit' ||
            (
                this.state.item.data &&
                this.state.item.data.length === 0
            )
        ) {
            return;
        }

        const weights = this.state.item.data.map((value, index) => {
            return (
                <View style={styles.flexRow} key={index}>
                    <View style={[styles.columnTable, styles.bgmainColorLight, this.state.item.data.length - 1 === index ? styles.borderBottomLeftRadius : null]}>
                        <Text style={[text14, textBold, { color: mainColorDark }]}>{index + 1}</Text>
                    </View>
                    <View style={styles.columnTable}>
                        <Text style={[text14, textBold, blackText]}>{value.weight} Kg</Text>
                    </View>
                    <View style={[styles.columnTable, this.state.item.data.length - 1 === index ? styles.borderBottomRightRadius : null]}>
                        <Text style={[text14, textBold, blackText]}>{value.value}</Text>
                    </View>
                </View>
            )
        });

        const labelValue = (this.props.exercise.final_type === 'reps' || this.props.exercise.final_type === 'ramp') ? Strings.label_reps : Strings.label_time;

        return (
            <View style={styles.innerItem}>
                <View style={styles.flexRow}>
                    <View style={[styles.columnTable, styles.bgMainColor, styles.borderTopLeftRadius]}>
                        <Text style={[text12, textBold, whiteText]}>{Strings.label_set}</Text>
                    </View>
                    <View style={[styles.columnTable, styles.bgMainColor]}>
                        <Text style={[text12, textBold, whiteText]}>{Strings.label_weight_kg}</Text>
                    </View>
                    <View style={[styles.columnTable, styles.bgMainColor, styles.borderTopRightRadius]}>
                        <Text style={[text12, textBold, whiteText]}>{labelValue}</Text>
                    </View>
                </View>
                {weights}
            </View>
        )
    }

    renderExerciseIconBlock = () => {
        if (this.props.hideExerciseIconBlock) {
            return;
        }

        const exercise = {
            sets: this.state.item.sets,
            type: this.state.item.type,
            final_value: this.state.item.value,
        };

        return (
            <View style={styles.containerExerciseIconBlock}>
                <ExerciseCardIconsBlock
                    exercise={exercise}
                    hideRest
                    small
                />
            </View>
        )
    }

    renderSendMessage = () => {
        return (
            <View style={styles.sender}>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder={Strings.label_write_a_comment}
                        style={[styles.input, {
                            height: Math.min(scale(120), Math.max(scale(isAndroid ? 30: 18), this.state.height))
                        }]}
                        multiline
                        onContentSizeChange={(event) => { this.setState({ height: event.nativeEvent.contentSize.height }) }}
                        value={this.state.textMessage}
                        onChangeText={(textMessage) => { this.setState({ textMessage }) }}
                    />
                </View>
                <View style={styles.senderIconContainer}>
                    <CustomButtonIcon
                        disabled={!this.state.textMessage || this.state.textMessage.length <= 0}
                        onPress={this.sendTextMessage}
                        icon={'paper-plane-outline'}
                        iconStyle={styles.iconSend}
                    />
                </View>
            </View>
        )
    }

    renderMessagesItems = () => {
        const {
            text13,
            text10,
            textBold,
            gray3Text
        } = CommonStyles;

        return this.state.item.messages.map((message, index) => {
            return (
                <View style={styles.containerUser} key={index}>
                    <FastImage
                        source={{
                            uri: message.user.photo
                        }}
                        style={styles.userImage}
                    />
                    <View>
                        <Text style={[text13, textBold]}>{message.user.name}</Text>
                        <Text style={text13}>{message.text}</Text>
                        <Text style={[text10, gray3Text]}>{message.created_at}</Text>
                    </View>
                </View>
            )
        })
    }

    renderMessages = () => {
        // Only the coach can start a conversation
        if (
            !this.state.item.messages ||
            this.state.item.messages.length <= 0
        ) {
            return null;
        }

        const {
            text13,
            textBold
        } = CommonStyles;

        return (
            <View style={styles.containerMessages}>
                <Text style={[text13, textBold]}>
                    <Icon
                        name={'chatbubbles-outline'}
                        size={scale(14)}
                        color={mainColor}
                    />
                    {' '}{Strings.label_comments} ({this.state.item.messages.length})
                </Text>
                { this.renderMessagesItems() }
                { this.renderSendMessage() }
            </View>
        )
    }

    handleMedia = (media) => {
        const data = {
            file: media.file
        };

        WeightsService.storeWeightFile(this.state.item.id, data)
        .then((data) => {
            let item = this.state.item;
            item.files = [...item.files, data.file];

            this.setState({
                item: {...item}
            });
        }).finally(() => {
            hideMessage(); //Hide upload message
        });
    }

    renderFiles = () => {
        return (
            <WeightAttachments
                files={this.state.item.files}
                handleMedia={this.handleMedia}
            />
        )
    }

    render() {
        const {
            text14,
            text12,
            textBold,
            mainText,
            boxShadowLight
        } = CommonStyles;

        return (
            <View style={[styles.item, boxShadowLight]}>
                <View style={styles.itemHeader}>
                    <Text style={[text14, textBold, mainText]}>{this.state.item.date}</Text>
                    <View style={styles.itemInnerHeader}>
                        <CustomButtonIcon
                            onPress={this.props.handleEdit}
                            icon={'pencil-outline'}
                        />
                        {
                            !this.props.hideDelete &&
                                <CustomButtonIcon
                                    customStyle={styles.btnAction}
                                    onPress={this.props.handleConfirmDeleteModal}
                                />
                        }
                    </View>
                </View>
                {
                    this.renderExerciseIconBlock()
                }
                {
                    this.renderTable()
                }
                {
                    this.state.item.note &&
                    <View style={styles.containerNote}>
                        <Text style={[text14, textBold]}>
                            {Strings.label_notes}
                        </Text>
                        <View style={styles.containerNoteInner}>
                            <Text style={text12}>{this.state.item.note}</Text>
                        </View>
                    </View>
                }
                { this.renderFiles() }
                { this.renderMessages() }
            </View>
        )
    }
}

const styles = ScaledSheet.create({
    item: {
        borderRadius: '10@s',
        marginTop: '10@s',
        marginBottom: '15@s',
        backgroundColor: white,
        padding: '20@s',
        marginHorizontal: '15@s'
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    itemInnerHeader: {
        flexDirection: 'row'
    },
    flexRow: {
        flexDirection: 'row'
    },
    columnTable: {
        borderColor: gray2,
        borderWidth: '0.5@s',
        flex: 1,
        padding: '10@s'
    },
    bgMainColor: {
        backgroundColor: mainColor
    },
    bgmainColorLight: {
        backgroundColor: mainColorLight
    },
    borderTopLeftRadius: {
        borderTopLeftRadius: '10@s'
    },
    borderTopRightRadius: {
        borderTopRightRadius: '10@s'
    },
    borderBottomLeftRadius: {
        borderBottomLeftRadius: '10@s'
    },
    borderBottomRightRadius: {
        borderBottomRightRadius: '10@s'
    },
    innerItem: {
        marginTop: '15@s'
    },
    btnAction: {
        marginLeft: '5@s'
    },
    containerNote: {
        marginTop: '15@s'
    },
    containerNoteInner: {
        marginTop: '5@s'
    },
    containerMessages: {
        marginTop: '20@s'
    },
    containerExerciseIconBlock: {
        marginTop: '20@s'
    },
    userImage: {
        width: '24@s',
        height: '24@s',
        borderRadius: '12@s',
        marginRight: '8@s'
    },
    containerUser: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: '10@s'
    },
    inputContainer: {
        flex: 1,
        borderRadius: '7@s',
        backgroundColor: white,
        borderColor: '#EAECEF',
        borderWidth: '1@s',
        paddingHorizontal: '10@s',
        paddingVertical: isAndroid ? 0 : '6@s'
    },
    input: {
        fontSize: '13@s',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingTop: isAndroid ? '4@s' : '1@s',
        paddingBottom: isAndroid ? '6@s' : 0,
        textAlign: 'left',
        color: black
    },
    senderIconContainer: {
        flex: 0,
        paddingLeft: '5@s',
        marginBottom: '3@s'
    },
    sender: {
        flexDirection: 'row',
        marginTop: '15@s',
        alignItems: 'flex-end'
    },
    iconSend: {
        marginRight: '2@s'
    }
});

export default function(props) {
    const navigation = useNavigation();
  
    return <HistoryItem {...props} navigation={navigation} />;
};