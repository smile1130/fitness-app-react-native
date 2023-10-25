import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScaledSheet, scale } from 'react-native-size-matters';
import {
    white,
    gray2,
    mainColor,
    black,
    applyOpacity,
    gray,
    gray3
} from '../../styles/colors';
import { CommonStyles } from '../../styles/CommonStyles';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import { openChatFile, truncateText } from '../../config/Util';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import CardWithIcon from '../common/CardWithIcon';
import { useNavigation } from '@react-navigation/native';

const MediaFile = (props) => {
    const {
        fileUrl,
        thumbUrl,
        fileName,
        fileType,
        link,
        title,
        subtitle,
        showTexts = false,
        aspectRatio = 1
    } = props;

    const navigation = useNavigation();
    const [progress, setProgress] = useState(null);

    const openFile = () => {
        if (['image', 'video'].includes(fileType)) {
            navigation.navigate('MediaFullScreen', {
                url: fileUrl,
                type: fileType
            });

            return;
        }

        if (fileType === 'link') {
            Linking.openURL(link);

            return;
        }

        openChatFile(fileUrl, fileName, (progress) => {
            setProgress(progress);
            if (progress === 100) {
                setTimeout(() => {
                    setProgress(null);
                }, 600);
            }
        });
    };

    const renderMediaStyle = () => {
        let mediaStyles = [styles.media];

        if (showTexts) {
            mediaStyles.push(styles.mediaOneColumn);
        }

        return mediaStyles;
    };

    const renderProgress = () => {
        if (!progress) {
            return null;
        }

        const { text9, whiteText } = CommonStyles;

        return (
            <View style={styles.containerProgress}>
                <AnimatedCircularProgress
                    size={scale(40)}
                    width={3}
                    fill={progress}
                    tintColor={white}
                    backgroundColor={mainColor}
                    childrenContainerStyle={{ backgroundColor: black }}
                >
                    {(fill) => (
                        <Text style={[text9, whiteText]}>{progress}%</Text>
                    )}
                </AnimatedCircularProgress>
            </View>
        );
    };

    const renderImage = () => {
        return (
            <FastImage
                source={{
                    uri: fileUrl,
                }}
                style={renderMediaStyle()}
            />
        );
    };

    const renderVideoPlaceholder = () => {
        return (
            <View style={renderMediaStyle()}>
                <View style={styles.videoPlaceholder} />
            </View>
        )
    };

    const renderVideo = () => {
        return (
            <View style={styles.flex1}>
                {
                    thumbUrl ?
                        <FastImage
                            source={{
                                uri: thumbUrl,
                            }}
                            style={renderMediaStyle()}
                        /> : renderVideoPlaceholder()
                }
                <View style={styles.videoIcon}>
                    <View style={styles.innerVideoIcon}>
                        <Icon
                            name={'play'}
                            size={scale(20)}
                            color={white}
                        />
                    </View>
                </View>
            </View>
        );
    };

    const renderLink = () => {
        const { text10, grayText, textCenter } = CommonStyles;

        return (
            <View style={[styles.containerLink, ...renderMediaStyle()]}>
                <Icon
                    name={'link-outline'}
                    size={scale(24)}
                    color={gray}
                    style={styles.fileIcon}
                />
                <Text style={[text10, textCenter, grayText]}>
                    {truncateText(title, 30)}
                </Text>
            </View>
        )
    }

    const renderFile = () => {
        const { text10, textCenter, grayText } = CommonStyles;

        return (
            <View style={[styles.containerFile, ...renderMediaStyle()]}>
                <Icon
                    name={'document-attach-outline'}
                    size={scale(22)}
                    color={gray}
                    style={styles.fileIcon}
                />
                <Text style={[text10, textCenter, grayText]}>
                    {truncateText(title)}
                </Text>
            </View>
        );
    };

    const renderMedia = () => {
        switch (fileType) {
            case 'image':
                return renderImage();
            case 'video':
                return renderVideo();
            case 'link':
                return renderLink();
            default:
                return renderFile();
        }
    };

    const renderCardWithIcon = () => {
        return (
            <CardWithIcon
                title={title}
                subtitle={subtitle}
                icon={'document-attach-outline'}
                handlePress={openFile}
            />
        );
    };

    if (showTexts) {
        return renderCardWithIcon();
    }

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[
                styles.containerMedia,
                showTexts ? styles.containerMediaWithBorder : null,
            ]}
            onPress={openFile}
        >
            <View style={[styles.innerMedia, {
                aspectRatio
            }]}>
                {renderMedia()}
                {renderProgress()}
            </View>
        </TouchableOpacity>
    );
};

const styles = ScaledSheet.create({
    flex1: {
        flex: 1,
    },
    media: {
        borderRadius: '7@s',
        flex: 1,
    },
    mediaOneColumn: {
        width: '50@s',
        height: '50@s',
        marginRight: '10@s',
    },
    containerLink: {
        backgroundColor: gray2,
        alignItems: 'center',
        padding: '5@s',
        justifyContent: 'center'
    },
    containerFile: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: gray2,
        paddingHorizontal: '5@s',
    },
    fileIcon: {
        marginBottom: '5@s',
    },
    videoIcon: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerVideoIcon: {
        width: '36@s',
        height: '36@s',
        borderRadius: '18@s',
        paddingLeft: '3@s',
        backgroundColor: applyOpacity(black, 0.4),
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoPlaceholder: {
        flex: 1,
        backgroundColor: gray3,
        borderRadius: '7@s'
    },
    innerMedia: {
        flex: 1,
        margin: '2@s',
    },
    containerMedia: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: '7@s',
    },
    containerMediaWithBorder: {
        paddingVertical: '5@s',
        paddingHorizontal: '5@s',
        borderColor: gray2,
        borderWidth: 1,
        marginHorizontal: '10@s',
        marginBottom: '10@s',
    },
    containerProgress: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default MediaFile;
