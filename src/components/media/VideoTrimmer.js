import React, { useState, useRef, useEffect } from 'react';
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
import { debounce } from 'lodash';
import { scale } from 'react-native-size-matters';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const FRAME_WIDTH = 50;
const TILE_HEIGHT = 35;
const TILE_WIDTH = FRAME_WIDTH / 2;
const TIME_FRAME_WIDTH = SCREEN_WIDTH - 30;
const DURATION_WINDOW_BORDER_WIDTH = 15;

const VideoTrimmer = props => {
	const [duration, setDuration] = useState(0);
	const [isPlaying, setIsPlaying] = useState(true);
	const [frames, setFrames] = useState();
	const [leftValue, setLeftValue] = useState(0);
	const [rightValue, setRightValue] = useState(TIME_FRAME_WIDTH - 41 - DURATION_WINDOW_BORDER_WIDTH * 2);
	const [isShowStartTime, setShowStartTime] = useState(false);
	const [isShowEndTime, setShowEndStartTime] = useState(false);
	const [leftPopLine, setLeftPopLine] = useState(DURATION_WINDOW_BORDER_WIDTH);
	const [startTime, setStartTime] = useState(0);
	const player = useRef(null);

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
		const numberOfFrames = Math.floor(TIME_FRAME_WIDTH / TILE_WIDTH);
		const duration = props.source.duration / 1000;
		setDuration(duration)

		setFrames(
			Array(numberOfFrames).fill({
				status: FRAME_STATUS.LOADING.name.description,
			}),
		);

		FFmpegWrapper.getFrames(
			getFileNameFromPath(props.source.path),
			uri,
			duration,
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
			},
		);
	};

	const calculateVideoDuration = (durationInSeconds) => {
		// Convert duration of the video from seconds to hours, minutes, and seconds
		const hours = Math.floor(durationInSeconds / 3600);
		const minutes = Math.floor((durationInSeconds % 3600) / 60);
		const seconds = Math.floor(durationInSeconds % 60);

		const formattedTime =
			`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

		return formattedTime;
	}

	const handleVideoTrim = async () => {
		console.log('screen_width', SCREEN_WIDTH);
		console.log('left_value', leftValue);
		console.log('right_value', rightValue);
		let startPoint = leftValue * duration / (TIME_FRAME_WIDTH - DURATION_WINDOW_BORDER_WIDTH * 2 - 41)
		let endPoint = rightValue * duration / (TIME_FRAME_WIDTH - DURATION_WINDOW_BORDER_WIDTH * 2 - 41)

		let startSecond = calculateVideoDuration(startPoint);  // set your start second here
		let endSecond = calculateVideoDuration(endPoint);  // set your end second here

		console.log(duration)
		console.log('startPoint', startPoint)
		console.log('endPoint', endPoint)
		console.log('startSecond', startSecond)
		console.log('endSecond', endSecond)

		props.showFlashMessage();
		props.setIsOpenVideoTrimmer(false);

		let data = await FFmpegWrapper.trimVideo(
			uri,
			startSecond,
			endSecond
		)

		props.handleVideo(data);
	}

	const renderFrame = (frame, index) => {
		if (frame.status === FRAME_STATUS.LOADING.name.description) {
			return <View style={styles.loadingFrame} key={index} />;
		} else {
			return (
				<Image
					key={index}
					source={{ uri: 'file://' + frame.uri }}
					style={[
						styles.imageTile,
					]}
					onLoad={() => {
						console.log('Image loaded', frames.length);
					}}
				/>
			);
		}
	};

	const onBack = () => {
		props.setIsOpenVideoTrimmer(false);
	};

	const handlePlayPause = () => {
		setIsPlaying(!isPlaying);
	};

	const handleVideoProgress = (data) => {
		// tempPopLine = data.currentTime * (TIME_FRAME_WIDTH - 2 * DURATION_WINDOW_BORDER_WIDTH) / duration;
		// setLeftPopLine(DURATION_WINDOW_BORDER_WIDTH + tempPopLine);
		let startPoint = leftValue * duration / (TIME_FRAME_WIDTH - DURATION_WINDOW_BORDER_WIDTH * 2 - 41)
		let endPoint = rightValue * duration / (TIME_FRAME_WIDTH - DURATION_WINDOW_BORDER_WIDTH * 2 - 41)

		if (data.currentTime >= endPoint) {
			player.current.seek(startPoint)
		}
	}

	const CustomButton = ({ title, onPress }) => {
		return (
			<TouchableOpacity style={[styles.buttonStyle]} onPress={onPress}>
				<Text style={styles.buttonText}>{title}</Text>
			</TouchableOpacity>
		);
	};

	const IconButton = ({ icon, onPress }) => {
		console.log(onPress);
		return (
			<TouchableOpacity style={[styles.iconButtonStyle]} onPress={onPress}>
				<Icon name={icon} style={styles.buttonIcon} />
			</TouchableOpacity>
		);
	};

	const panLeft = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
	const panRight = useRef(new Animated.ValueXY({ x: TIME_FRAME_WIDTH - 41, y: 0 })).current;
	const widthAnimated = Animated.subtract(panRight.x, panLeft.x);

	const panResponderLeft = PanResponder.create({
		onStartShouldSetPanResponder: () => true, // return true to allow PanResponder to handle the gesture
		onMoveShouldSetPanResponder: () => true,
		onPanResponderGrant: (evt, gestureState) => {
			panLeft.extractOffset();
			setShowStartTime(true);
			// setLeftPopLine(leftValue + DURATION_WINDOW_BORDER_WIDTH)
		},
		onPanResponderMove: Animated.event([
			null,
			{ dx: panLeft.x },
		], {
			useNativeDriver: false,
		}),
		onPanResponderRelease: (e, gestureState) => {
			panLeft.flattenOffset();
			let tempLeft = leftValue + gestureState.dx;
			console.log('tempLeft', tempLeft);
			// Check boundaries
			if (tempLeft <= 0) {
				tempLeft = 0;
				Animated.timing(panLeft, {
					toValue: { x: 0, y: 0 },
					duration: 300,
					useNativeDriver: false
				}).start();
			}
			setLeftValue(tempLeft)
			setShowStartTime(false)
			console.log(leftValue)
			setLeftPopLine(tempLeft + DURATION_WINDOW_BORDER_WIDTH)
			console.log(leftPopLine)

			let startPoint = tempLeft * duration / (TIME_FRAME_WIDTH - DURATION_WINDOW_BORDER_WIDTH * 2 - 41)
			player.current.seek(startPoint)
		},
	});

	const panResponderRight = PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onPanResponderGrant: (evt, gestureState) => {
			panRight.extractOffset();
			setShowEndStartTime(true);
		},
		onPanResponderMove: Animated.event([
			null,
			{ dx: panRight.x },
		], {
			useNativeDriver: false,
		}),
		onPanResponderRelease: (e, gestureState) => {
			panRight.flattenOffset();
			let tempRight = rightValue + gestureState.dx;
			// Check boundaries
			console.log('tempRight', tempRight);
			if (tempRight >= (TIME_FRAME_WIDTH - DURATION_WINDOW_BORDER_WIDTH * 2 - 41)) {
				tempRight = TIME_FRAME_WIDTH - DURATION_WINDOW_BORDER_WIDTH * 2 - 41;
				Animated.timing(panRight, {
					toValue: { x: TIME_FRAME_WIDTH - 41, y: 0 },
					duration: 300,
					useNativeDriver: false
				}).start();
			}
			setRightValue(tempRight)
			setShowEndStartTime(false)
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
				/>
			</View>
			<View style={styles.timeSliderBar}>
				<IconButton
					icon={isPlaying ? 'pause' : 'play'}
					onPress={handlePlayPause}
				/>
				{frames && (
					<View style={styles.durationWindowAndFramesLineContainer}>
						{/* <Animated.View style={[styles.popLine, { left: leftPopLine }]}></Animated.View> */}
						<Animated.View style={[styles.durationWindow, { transform: [{ translateX: panLeft.x }], width: widthAnimated }]}></Animated.View>
						{isShowStartTime && <Animated.View style={[styles.startTime, { transform: [{ translateX: panLeft.x }] }]} {...panResponderLeft.panHandlers}>
							<View style={[styles.startTimeText]}><Text style={{ color: 'white' }}>00:00:00</Text></View>
							<View style={styles.timePoint}></View>
						</Animated.View>}
						{isShowEndTime && <Animated.View style={[styles.endTime, { transform: [{ translateX: panRight.x }] }]} {...panResponderLeft.panHandlers}>
							<View style={[styles.endTimeText]}><Text style={{ color: 'white' }}>00:00:00</Text></View>
							<View style={styles.timePoint}></View>
						</Animated.View>}
						<Animated.View style={[styles.durationWindowLeftBorder, { transform: [{ translateX: panLeft.x }] }]} {...panResponderLeft.panHandlers}><Icon size={scale(14)} name='chevron-back' style={{ marginTop: 'auto', marginBottom: 'auto' }} /></Animated.View>
						<Animated.View style={[styles.durationWindowRightBorder, { transform: [{ translateX: panRight.x }] }]} {...panResponderRight.panHandlers}><Icon size={scale(14)} name='chevron-forward' style={{ marginTop: 'auto', marginBottom: 'auto' }} /></Animated.View>
						<View style={styles.framesLine}>
							{frames.map((frame, index) => renderFrame(frame, index))}
						</View>
					</View>
				)
				}
			</View>

			{/* Buttons */}
			<View style={styles.buttonsContainer}>
				<CustomButton title="Cancel" onPress={onBack} />
				<CustomButton
					title="Done"
					onPress={handleVideoTrim}
				/>
			</View>
		</SafeAreaView >
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
	buttonsContainer: {
		position: 'absolute',
		bottom: '1%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
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
		padding: 7.5,
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
		borderRightWidth: 1,
		borderRightColor: 'rgba(0,0,0)'
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		textAlign: 'center',
	},
	buttonIcon: {
		fontSize: 28,
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
		width: TIME_FRAME_WIDTH - 41,
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
		left: TIME_FRAME_WIDTH / 2 - 50 + DURATION_WINDOW_BORDER_WIDTH,
		width: 3,
		height: TILE_HEIGHT,
		backgroundColor: 'white',
		zIndex: 26,
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
		height: TILE_HEIGHT + DURATION_WINDOW_BORDER_WIDTH * 2 / 3,
		zIndex: 30,
	},
	durationWindowLeftBorder: {
		position: 'absolute',
		left: 0,
		width: DURATION_WINDOW_BORDER_WIDTH,
		height: TILE_HEIGHT + DURATION_WINDOW_BORDER_WIDTH * 2 / 3,
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
		backgroundColor: 'orange',
		zIndex: 30,
	},
	durationWindowRightBorder: {
		position: 'absolute',
		left: 0 - DURATION_WINDOW_BORDER_WIDTH,
		width: DURATION_WINDOW_BORDER_WIDTH,
		height: TILE_HEIGHT + DURATION_WINDOW_BORDER_WIDTH * 2 / 3,
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5,
		backgroundColor: 'orange',
		zIndex: 30,
	},
	loadingFrame: {
		width: TILE_WIDTH,
		height: TILE_HEIGHT,
		backgroundColor: 'rgba(0,0,0,0.05)',
		borderColor: 'rgba(0,0,0,0.1)',
		borderWidth: 1,
	},
	imageTile: {
		width: TILE_WIDTH,
		height: TILE_HEIGHT,
	},
	startTime: {
		position: 'absolute',
		left: 0 - 19,
		top: -60,
		zIndex: 100
	},
	endTime: {
		position: 'absolute',
		left: 0 - 19 - DURATION_WINDOW_BORDER_WIDTH * 2,
		top: -60,
		zIndex: 100
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
		alignSelf: 'center'
	}
});
