import React, { PureComponent } from 'react';
import {
    View,
    Text
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

import { white, gray, gray2 } from '../../../styles/colors';
import { CommonStyles } from '../../../styles/CommonStyles';
import { screenWidth, formatChatDate, formatDateHuman } from '../../../config/Util';
import { useNavigation } from '@react-navigation/native';
import Autolink from 'react-native-autolink';
import MediasList from '../../common/MediasList';

class ChatBalloon extends PureComponent {
    constructor(props) {
        super(props);
    };

    checkDifferentDate = () => {
        if(
            this.props.beforeData &&
            (
                moment(this.props.beforeData.createdAt).day() !== moment(this.props.data.createdAt).day() 
            )
        ) {
            return true;
        }
        
        return false;
    }

    nextItemIsSameType = () => {
        return this.props.nextData && this.props.nextData.sender.id === this.props.data.sender.id;
    }

    isLoggedUser = () => {
        return this.props.data.sender.id === this.props.loggedUserId;
    }

    renderOtherUserImage = () => {
        if(
            this.isLoggedUser()
        ) {
            return;
        }
        
        if(
            this.nextItemIsSameType()
        ) {
            return (
                <View style={styles.otherImage} />
            )
        }

        return (
            <FastImage
                source={{
                    uri: this.props.otherImage
                }}
                style={styles.otherImage}
                resizeMode={'cover'}
            />
        )
    }

    renderTime = (textColor = gray) => {
        const {
            text10
        } = CommonStyles;

        return (
            <View style={styles.containerTime}>
                <Text style={[text10, {color: textColor}]}>{formatChatDate(this.props.data.createdAt)}</Text>
            </View>
        )
    }

    renderText = () => {
        const {
            text11
        } = CommonStyles;

        const containerStyle = this.isLoggedUser() ? styles.containerLoggedUserText : styles.containerCoachText;

        return (
            <View style={styles.containerText}>
                {this.renderOtherUserImage()}
                <View style={[styles.innerContainerText, containerStyle]}>
                    <Autolink
                        text={this.props.data.message}
                        style={[text11, styles.autoLinkText]}
                    />
                    {this.renderTime()}
                </View>
            </View>
            
        )
    }

    renderFile = () => {
        const containerStyle = this.isLoggedUser() ? styles.containerLoggedUserImage : styles.containerOtherUserImage;

        return (
            <View style={styles.containerMedia}>
                {this.renderOtherUserImage()}
                <View
                    style={[styles.innerContainerMedia, containerStyle]}
                >
                    <View style={styles.chatFile}>
                        <MediasList
                            medias={{
                                file_url: this.props.data.fileUrl,
                                thumb_url: this.props.data.thumbUrl,
                                filename: this.props.data.filename,
                                type: this.props.data.type
                            }}
                            aspectRatio={null}
                        />
                    </View>
                    {this.renderTime()}
                </View>
            </View>
        )
    }

    renderItem = () => {
        switch (this.props.data.type) {
            case 'text':
                return this.renderText();
            case 'image':
            case 'video':
            case 'other':
                return this.renderFile();
        }
    }

    renderDate = () => {
        if(!this.checkDifferentDate()) {
            return null;
        }

        return (
            <View style={styles.containerDate}>
                <Text>{formatDateHuman(this.props.data.createdAt)}</Text>
            </View>
        )
    }

    render() {
        return (
            <View style={[styles.mainContainer, {
                alignItems: this.isLoggedUser() ? 'flex-end' : 'flex-start'
            }]}>
                {this.renderDate()}
                {this.renderItem()}
            </View>
            
        );
    }
}

const styles = ScaledSheet.create({
    mainContainer: {
        flex: 1,
        marginBottom: '5@s'
    },
    otherImage: {
        width: '30@s',
        height: '30@s',
        borderRadius: '15@s',
        marginRight: '10@s'
    },
    containerText: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        maxWidth: screenWidth * 0.65
    },
    innerContainerText: {
        minWidth: '60@s',
        borderRadius: '8@s',
        paddingTop: '7@s',
        paddingHorizontal: '10@s'
    },
    autoLinkText: {
        marginBottom: '5@s'
    },
    containerMedia: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        maxWidth: screenWidth * 0.65
    },
    innerContainerMedia: {
        borderRadius: '10@s',
        paddingTop: '7@s',
        paddingBottom: '25@s',
        paddingHorizontal: '7@s'
    },
    containerLoggedUserText: {
        backgroundColor: gray2,
        paddingBottom: '15@s',
        alignItems: 'flex-end'
    },
    containerLoggedUserImage: {
        backgroundColor: gray2,
        alignItems: 'flex-start'
    },
    containerCoachText: {
        backgroundColor: white,
        borderColor: gray2,
        borderWidth: 1,
        paddingBottom: '15@s'
    },
    containerOtherUserImage: {
        backgroundColor: white,
        borderColor: gray2,
        borderWidth: 1
    },
    containerTime: {
        position: 'absolute',
        bottom: '4@s',
        right: '6@s'
    },
    containerDate: {
        alignSelf: 'center',
        backgroundColor: gray2,
        paddingVertical: '5@s',
        paddingHorizontal: '10@s',
        borderRadius: '20@s',
        marginTop: '15@s',
        marginBottom: '22@s'
    },
    chatFile: {
        width: '180@s',
        height: '130@s',
        borderRadius: '5@s'
    }
});

export default function(props) {
    const navigation = useNavigation();
  
    return <ChatBalloon {...props} navigation={navigation} />;
}