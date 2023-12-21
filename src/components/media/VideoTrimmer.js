import React, { useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
    Image,
    Animated,
    PanResponder,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import FFmpegWrapper from '../../../lib/ffmpeg';
import { scale } from 'react-native-size-matters';
import FadingCircleAlt from 'react-native-spinkit';
import { Platform } from 'react-native';
import { Strings } from '../../config/Strings';
import { CommonStyles } from '../../styles/CommonStyles';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const FRAME_WIDTH = 50;
const TILE_HEIGHT = 35;
const TILE_WIDTH = FRAME_WIDTH / 2;
const TIME_FRAME_WIDTH = SCREEN_WIDTH - 30;
const DURATION_WINDOW_BORDER_WIDTH = 15;
const TRIMMED_VIDEO_MAX_LENGTH = 60; //60 seconds

const VideoTrimmer = props => {
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [frames, setFrames] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [leftValue, setLeftValue] = useState(0);
    const [rightValue, setRightValue] = useState(
        TIME_FRAME_WIDTH - 44 - DURATION_WINDOW_BORDER_WIDTH * 2,
    );
    const [leftPopLine, setLeftPopLine] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [trimmedDuration, setTrimmedDuration] = useState(0);
    const [isWarning, setIsWarning] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const player = useRef(null);

    const panLeft = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const panRight = useRef(
        new Animated.ValueXY({ x: TIME_FRAME_WIDTH - 44, y: 0 }),
    ).current;
    const panWhiteLine = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const widthAnimated = Animated.subtract(panRight.x, panLeft.x);

    const getFileNameFromPath = path => {
        const fragments = path.split('/');
        let fileName = fragments[fragments.length - 1];
        fileName = fileName.split('.')[0];
        return fileName;
    };

    const uri =
        Platform.OS === 'ios'
            ? props.source.path
            : props.source.path.replace('file://', '');

    const FRAME_STATUS = Object.freeze({
        LOADING: { name: Symbol('LOADING') },
        READY: { name: Symbol('READY') },
    });

    const handleVideoLoad = () => {
        const playPauseButtonSize = 59;
        const numberOfFrames = Math.ceil(
            (TIME_FRAME_WIDTH - playPauseButtonSize) / TILE_WIDTH,
        );
        setTrimmedDuration(props.source.duration / 1000);
        setDuration(props.source.duration / 1000);

        setFrames(
            Array(numberOfFrames).fill({
                status: FRAME_STATUS.LOADING.name.description,
            }),
        );

        FFmpegWrapper.getFrames(
            getFileNameFromPath(props.source.path),
            uri,
            props.source.duration / 1000,
            numberOfFrames,
            filePath => {
                const _framesURI = [];
                for (let i = 0; i < numberOfFrames; i++) {
                    _framesURI.push(
                        `${filePath.replace('%4d', String(i + 1).padStart(4, 0))}`,
                    );
                }
                const _frames = _framesURI.map(_frameURI => ({
                    uri: _frameURI,
                    status: FRAME_STATUS.READY.name.description,
                }));
                setFrames(_frames);
                setIsLoading(false);
            },
        );
    };

    const calculateVideoDuration = durationInSeconds => {
        // Convert duration of the video from seconds to hours, minutes, and seconds
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = Math.floor(durationInSeconds % 60);

        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        return formattedTime;
    };

    const handleVideoTrim = async () => {
        setIsPlaying(false);
        let startPoint =
            (leftValue * duration) /
            (TIME_FRAME_WIDTH - DURATION_WINDOW_BORDER_WIDTH * 2 - 44);
        let endPoint =
            (rightValue * duration) /
            (TIME_FRAME_WIDTH - DURATION_WINDOW_BORDER_WIDTH * 2 - 44);

        if (endPoint - startPoint > TRIMMED_VIDEO_MAX_LENGTH) {
            setIsWarning(true);
            // After 5 seconds, set isVisible back to false
            const timeout = setTimeout(() => {
                setIsWarning(false);
            }, 4000);

            // Clean up the timeout when the component unmounts or isVisible changes
            return () => clearTimeout(timeout);
        }

        let startSecond = calculateVideoDuration(startPoint); // set your start second here
        let endSecond = calculateVideoDuration(endPoint); // set your end second here

        props.showFlashMessage();
        props.setIsOpenVideoTrimmer(false);

        let data = await FFmpegWrapper.trimVideo(
            uri,
            startSecond,
            endSecond,
            isMuted,
        );

        props.handleVideo(data);
    };

    const renderFrame = (frame, index) => {
        if (frame.status === FRAME_STATUS.LOADING.name.description) {
            return <View style={styles.loadingFrame} key={index} />;
        } else {
            return (
                <Image
                    key={index}
                    source={{ uri: 'file://' + frame.uri }}
                    style={[styles.imageTile]}
                    onLoad={() => {
                        console.log('Image loaded', frames.length);
                    }}
                />
            );
        }
    };

    const onBack = () => {
        setIsPlaying(false);
        setIsWarning(false);
        props.setIsOpenVideoTrimmer(false);
        FFmpegWrapper.clearTrimVideosFolder();
    };

    const handlePlayPause = () => {
        setIsWarning(false);
        setIsPlaying(!isPlaying);
    };

    const handleVideoProgress = data => {
        setCurrentTime(data.currentTime);
        let tempPopLine =
            (data.currentTime *
                (TIME_FRAME_WIDTH - 2 * DURATION_WINDOW_BORDER_WIDTH - 44)) /
            duration;
        setLeftPopLine(tempPopLine);
        Animated.timing(panWhiteLine.x, {
            toValue: tempPopLine,
            duration: 0, // let's say we want this to happen immediately
            useNativeDriver: false,
        }).start();

        let startPoint =
            (leftValue * duration) /
            (TIME_FRAME_WIDTH - DURATION_WINDOW_BORDER_WIDTH * 2 - 44);
        let endPoint =
            (rightValue * duration) /
            (TIME_FRAME_WIDTH - DURATION_WINDOW_BORDER_WIDTH * 2 - 44);
        if (data.currentTime >= endPoint) {
            player.current.seek(startPoint);
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const CustomButton = ({ title, onPress, styleText = null }) => {
        return (
            <TouchableOpacity style={[styles.buttonStyle]} onPress={onPress}>
                <Text style={[CommonStyles.text13, styles.buttonText, styleText]}>{title}</Text>
            </TouchableOpacity>
        );
    };

    const IconButton = ({ icon, onPress }) => {
        return (
            <TouchableOpacity style={[styles.iconButtonStyle]} onPress={onPress}>
                <Icon name={icon} style={styles.buttonIcon} />
            </TouchableOpacity>
        );
    };

    const panResponderWhiteLine = PanResponder.create({
        onStartShouldSetPanResponder: () => true, // return true to allow PanResponder to handle the gesture
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt, gestureState) => {
            panWhiteLine.extractOffset();
            setIsWarning(false);
            setIsPlaying(false);
        },
        onPanResponderMove: Animated.event([null, { dx: panWhiteLine.x }], {
            useNativeDriver: false,
        }),
        onPanResponderRelease: (e, gestureState) => {
            panWhiteLine.flattenOffset();
            let tempWhiteLine = leftPopLine + gestureState.dx;
            console.log('tempWhiteLine', tempWhiteLine);

            // Check boundaries
            if (tempWhiteLine <= leftValue) {
                tempWhiteLine = leftValue;
                Animated.timing(panWhiteLine, {
                    toValue: { x: leftValue, y: 0 },
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            } else if (tempWhiteLine >= rightValue) {
                tempWhiteLine = rightValue - 3;
                Animated.timing(panWhiteLine, {
                    toValue: { x: rightValue - 3, y: 0 },
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            }

            setLeftPopLine(tempWhiteLine);

            console.log(leftValue, 'leftvalue');
            console.log(tempWhiteLine, 'tempWhiteLine');
            let startPoint =
                (tempWhiteLine * duration) /
                (TIME_FRAME_WIDTH - DURATION_WINDOW_BORDER_WIDTH * 2 - 44);
            setCurrentTime(startPoint);
            player.current.seek(startPoint);
        },
    });

    const panResponderLeft = PanResponder.create({
        onStartShouldSetPanResponder: () => true, // return true to allow PanResponder to handle the gesture
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt, gestureState) => {
            panLeft.extractOffset();
            setIsPlaying(false);
            setIsWarning(false);
        },
        onPanResponderMove: Animated.event([null, { dx: panLeft.x }], {
            useNativeDriver: false,
        }),
        onPanResponderRelease: (e, gestureState) => {
            panLeft.flattenOffset();
            let tempLeft = leftValue + gestureState.dx;
            // Check boundaries
            if (tempLeft <= 0) {
                tempLeft = 0;
                Animated.timing(panLeft, {
                    toValue: { x: 0, y: 0 },
                    duration: 300,
                    useNativeDriver: false,
                }).start();
                Animated.timing(panWhiteLine, {
                    toValue: { x: 0, y: 0 },
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            }
            if (tempLeft >= rightValue) {
                tempLeft = leftValue;
                Animated.timing(panLeft, {
                    toValue: { x: leftValue, y: 0 },
                    duration: 300,
                    useNativeDriver: false,
                }).start();
                Animated.timing(panWhiteLine, {
                    toValue: { x: leftValue, y: 0 },
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            }
            setLeftValue(tempLeft);
            setLeftPopLine(tempLeft);
            Animated.timing(panWhiteLine, {
                toValue: { x: tempLeft, y: 0 },
                duration: 300,
                useNativeDriver: false,
            }).start();
            console.log(leftPopLine);

            let startPoint =
                (tempLeft * duration) /
                (TIME_FRAME_WIDTH - DURATION_WINDOW_BORDER_WIDTH * 2 - 44);
            let endPoint =
                (rightValue * duration) /
                (TIME_FRAME_WIDTH - DURATION_WINDOW_BORDER_WIDTH * 2 - 44);
            setTrimmedDuration(endPoint - startPoint);
            player.current.seek(startPoint);
            setCurrentTime(startPoint);
        },
    });

    const panResponderRight = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt, gestureState) => {
            panRight.extractOffset();
            setIsPlaying(false);
            setIsWarning(false);
        },
        onPanResponderMove: Animated.event([null, { dx: panRight.x }], {
            useNativeDriver: false,
        }),
        onPanResponderRelease: (e, gestureState) => {
            panRight.flattenOffset();
            let tempRight = rightValue + gestureState.dx;
            // Check boundaries
            console.log('tempRight', tempRight);
            if (
                tempRight >=
                TIME_FRAME_WIDTH - DURATION_WINDOW_BORDER_WIDTH * 2 - 44
            ) {
                tempRight = TIME_FRAME_WIDTH - DURATION_WINDOW_BORDER_WIDTH * 2 - 44;
                Animated.timing(panRight, {
                    toValue: { x: TIME_FRAME_WIDTH - 44, y: 0 },
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            }
            if (tempRight <= leftValue + DURATION_WINDOW_BORDER_WIDTH) {
                tempRight = rightValue;
                Animated.timing(panRight, {
                    toValue: { x: rightValue + 2 * DURATION_WINDOW_BORDER_WIDTH, y: 0 },
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            }
            console.log('tempRight', rightValue);
            setRightValue(tempRight);
            setLeftPopLine(leftValue);
            Animated.timing(panWhiteLine, {
                toValue: { x: leftValue, y: 0 },
                duration: 300,
                useNativeDriver: false,
            }).start();

            let startPoint =
                (leftValue * duration) /
                (TIME_FRAME_WIDTH - DURATION_WINDOW_BORDER_WIDTH * 2 - 44);
            let endPoint =
                (tempRight * duration) /
                (TIME_FRAME_WIDTH - DURATION_WINDOW_BORDER_WIDTH * 2 - 44);
            setTrimmedDuration(endPoint - startPoint);
            player.current.seek(startPoint);
            setCurrentTime(startPoint);
        },
    });

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.videoContainer}>
                <Video
                    ref={player}
                    style={styles.video}
                    resizeMode="contain"
                    source={{ uri: uri }}
                    repeat={true}
                    onLoad={handleVideoLoad}
                    paused={!isPlaying}
                    onProgress={handleVideoProgress}
                    muted={isMuted} // Set the muted property to true to mute the video
                />
            </View>
            <View style={styles.timeShow}>
                <View style={{ flex: 1 }}>
                    <Text style={[CommonStyles.text12, { color: 'white', zIndex: 100 }]}>
                        {calculateVideoDuration(currentTime)}
                    </Text>
                </View>
                <View>
                    <Text style={[CommonStyles.text12, { color: 'white', zIndex: 100 }]}>
                        {calculateVideoDuration(trimmedDuration)}
                    </Text>
                </View>
            </View>
            <View style={styles.timeSliderBar}>
                <IconButton
                    icon={isPlaying ? 'pause' : 'play'}
                    onPress={handlePlayPause}
                />
                <View style={styles.durationWindowAndFramesLineContainer}>
                    <Animated.View
                        {...panResponderWhiteLine.panHandlers}
                        style={[
                            styles.popLine,
                            { transform: [{ translateX: panWhiteLine.x }] },
                        ]}>
                        <View style={styles.whiteLine} />
                    </Animated.View>
                    <Animated.View
                        style={[
                            styles.durationWindow,
                            { transform: [{ translateX: panLeft.x }], width: widthAnimated },
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.durationWindowLeftBorder,
                            { transform: [{ translateX: panLeft.x }] },
                        ]}
                        {...panResponderLeft.panHandlers}>
                        <Icon
                            size={scale(14)}
                            name="chevron-back"
                            style={{ marginTop: 'auto', marginBottom: 'auto' }}
                        />
                    </Animated.View>
                    <Animated.View
                        style={[
                            styles.durationWindowRightBorder,
                            { transform: [{ translateX: panRight.x }] },
                        ]}
                        {...panResponderRight.panHandlers}>
                        <Icon
                            size={scale(14)}
                            name="chevron-forward"
                            style={{ marginTop: 'auto', marginBottom: 'auto' }}
                        />
                    </Animated.View>
                    {isLoading ? (
                        <FadingCircleAlt
                            type="Wave"
                            size={30}
                            color="#FFFFFF"
                            style={styles.loading}
                        />
                    ) : (
                        <View style={styles.framesLine}>
                            {frames.map((frame, index) => renderFrame(frame, index))}
                        </View>
                    )}
                </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
                <CustomButton title={Strings.label_undo} onPress={onBack} />
                <TouchableOpacity onPress={toggleMute}>
                    {isMuted ? (
                        <Icon name="volume-mute-outline" size={20} color="white" />
                    ) : (
                        <Icon name="volume-high-outline" size={20} color="white" />
                    )}
                </TouchableOpacity>
                <CustomButton title={Strings.btn_done} onPress={handleVideoTrim} styleText={{ ...CommonStyles.textBold, color: 'orange' }} />
            </View>

            {isWarning && (
                <View style={styles.flashMessage}>
                    <Icon
                        name="warning"
                        size={20}
                        color="rgba(255,255,255,1)"
                        style={{ marginRight: 5, marginTop: 2 }}
                    />
                    <Text style={styles.warningText}>
                        {Strings.strings_trim_video_error}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default VideoTrimmer;

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'black',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loading: {
        marginLeft: TIME_FRAME_WIDTH / 2 - 30,
        opacity: 0.5,
    },
    videoContainer: {
        width: '100%',
        height: SCREEN_HEIGHT * 0.7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        flex: 1,
        width: '100%',
    },
    timeShow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 3,
        marginBottom: -12,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    buttonStyle: {
        backgroundColor: 'black',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    iconButtonStyle: {
        backgroundColor: 'rgba(50,50,50,1)',
        alignSelf: 'center',
        marginTop: 10,
        padding: 10.5,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        borderRightWidth: 1,
        borderRightColor: 'rgba(0,0,0)',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center'
    },
    buttonIcon: {
        fontSize: 22,
        color: 'white',
    },
    framesLine: {
        position: 'absolute',
        flexDirection: 'row',
        alignSelf: 'center',
        width: '100%',
        borderLeftWidth: DURATION_WINDOW_BORDER_WIDTH,
        borderRightWidth: DURATION_WINDOW_BORDER_WIDTH,
        borderTopWidth: DURATION_WINDOW_BORDER_WIDTH / 3,
        borderBottomWidth: DURATION_WINDOW_BORDER_WIDTH / 3,
        borderColor: 'rgba(50,50,50,1)',
        backgroundColor: 'rgba(30,30,30,1)',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        overflow: 'hidden',
    },
    loadingFrame: {
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
    },
    timeSliderBar: {
        flexDirection: 'row',
        width: TIME_FRAME_WIDTH,
    },
    durationWindowAndFramesLineContainer: {
        width: TIME_FRAME_WIDTH - 44,
        height: TILE_HEIGHT,
        justifyContent: 'center',
        textAlign: 'center',
        zIndex: 10,
        marginTop: 15,
    },
    durationLabelContainer: {
        backgroundColor: 'orange',
        alignSelf: 'center',
        top: -26,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    durationLabel: {
        color: 'rgba(0,0,0,0.6)',
        fontWeight: '700',
    },
    popLine: {
        position: 'absolute',
        left: DURATION_WINDOW_BORDER_WIDTH,
        width: 20,
        height: TILE_HEIGHT,
        backgroundColor: 'transparent',
        marginLeft: -10,
        zIndex: 35,
    },
    whiteLine: {
        height: TILE_HEIGHT,
        width: 3,
        backgroundColor: 'white',
        left: 10,
    },
    timeSlider: {
        position: 'absolute',
        zIndex: 26,
    },
    durationWindow: {
        position: 'absolute',
        left: 0,
        borderColor: 'orange',
        borderWidth: DURATION_WINDOW_BORDER_WIDTH / 3,
        borderRadius: 5,
        height: TILE_HEIGHT + (DURATION_WINDOW_BORDER_WIDTH * 2) / 3,
        zIndex: 30,
    },
    durationWindowLeftBorder: {
        position: 'absolute',
        left: 0,
        width: DURATION_WINDOW_BORDER_WIDTH,
        height: TILE_HEIGHT + (DURATION_WINDOW_BORDER_WIDTH * 2) / 3,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        backgroundColor: 'orange',
        zIndex: 36,
    },
    durationWindowRightBorder: {
        position: 'absolute',
        left: 0 - DURATION_WINDOW_BORDER_WIDTH,
        width: DURATION_WINDOW_BORDER_WIDTH,
        height: TILE_HEIGHT + (DURATION_WINDOW_BORDER_WIDTH * 2) / 3,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: 'orange',
        zIndex: 36,
    },
    imageTile: {
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
    },
    startTime: {
        position: 'absolute',
        left: 0 - 19,
        top: -60,
        zIndex: 100,
    },
    endTime: {
        position: 'absolute',
        left: 0 - 19 - DURATION_WINDOW_BORDER_WIDTH * 2,
        top: -60,
        zIndex: 100,
    },
    startTimeText: {
        backgroundColor: 'rgba(10,10,10,0.8)',
        borderRadius: 5,
        padding: 3,
    },
    endTimeText: {
        backgroundColor: 'rgba(10,10,10,0.8)',
        borderRadius: 5,
        padding: 3,
    },
    timePoint: {
        backgroundColor: 'white',
        height: 20,
        width: 1,
        marginTop: 5,
        alignSelf: 'center',
    },
    flashMessage: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'rgba(255,178,102,1)',
        paddingTop: 15,
        paddingBottom: 25,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    warningText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '400',
    },
});
