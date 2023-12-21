import React, { useEffect, useState } from 'react';
import { setGlobal, useGlobal } from 'reactn';
import { View, Text } from 'react-native';
import { scale, ScaledSheet } from 'react-native-size-matters';
import { mainColor, white } from '../../styles/colors';
import { CommonStyles } from '../../styles/CommonStyles';
import CustomButton from './CustomButton';
import Sound from 'react-native-sound';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import AudioDucking from 'react-native-audio-ducking';
import { differenceInSeconds } from 'date-fns';
import {
    getAudioOnTimer,
    getExpandedTimer,
    screenWidth,
    setAudioOnTimer,
    setExpandedTimer,
} from '../../config/Util';
import { GLOBAL_ACTIVE_COUNTER_TIMER_MODAL, GLOBAL_COUNTER_TIMER_MODAL } from '../../state/StateInitializer';
import { Strings } from '../../config/Strings';

const TimerModal = (props) => {
    const [timerValue, setTimerValue] = useState(props.seconds);
    const [expanded, setExpanded] = useState(true);
    const [audioOn, setAudioOn] = useState(true);
    const [canRender, setCanRender] = useState(false);

    // const [counterTimerModal] = useGlobal(GLOBAL_COUNTER_TIMER_MODAL);
    const [extraSeconds, setExtraSeconds] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [sound, setSound] = useState(null);

    // Update countdown
    // useEffect(() => {
    //     if (!startTime) {
    //         return;
    //     }

    //     const countdown = props.seconds - differenceInSeconds(new Date(), Date.parse(startTime)) - extraSeconds;

    //     // Start sound when audioOn
    //     if (countdown === 3 && audioOn) {
    //         initSound();
    //     }
    // }, [counterTimerModal]);

    // Called on init
    useEffect(() => {
        setStartTime(new Date().toISOString());

        // Enable counter for timer
        setGlobal({
            [GLOBAL_ACTIVE_COUNTER_TIMER_MODAL]: true
        });

        // Initial config: size and audio
        const fetchExpandedAndAudioOnTimer = async () => {
            const expanded = await getExpandedTimer();
            const audioOnTimer = await getAudioOnTimer();

            setExpanded(expanded === '0' ? false : true);
            setAudioOn(audioOnTimer === '0' ? false : true);

            setCanRender(true);
        };

        fetchExpandedAndAudioOnTimer();

        // When unmount stop timer and release sound if setted
        return () => {
            setGlobal({
                [GLOBAL_ACTIVE_COUNTER_TIMER_MODAL]: false
            });

            if (sound) {
                sound.release();
            }
        };
    }, []);

    const initSound = () => {
        if (sound) {
            return;
        }

        Sound.setCategory('Playback', true);

        const newSound = new Sound('timer.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }

            AudioDucking.duckAudio();

            newSound.play((success) => {
                if (success) {
                    AudioDucking.removeAudioDucking();
                    newSound.release();
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        });

        setSound(newSound);
    };

    const onFinish = () => {
        props.onFinish();
    };

    const onSkip = () => {
        if (sound) {
            sound.release();
        }
        onFinish();
    };

    const less10Sec = () => {
        if (timerValue <= 10) {
            if (sound) {
                sound.release();
            }
            onFinish();
            return;
        }

        setExtraSeconds(extraSeconds + 10);
        setTimerValue(timerValue - 10);
    };

    const more10Sec = () => {
        if (sound) {
            return;
        }

        setExtraSeconds(extraSeconds - 10);
        setTimerValue(parseInt(timerValue) + 10);
    };

    const handleExpanded = () => {
        setExpandedTimer(!expanded ? '1' : '0');
        setExpanded(!expanded);
    };

    const handleAudioOn = () => {
        setAudioOnTimer(!audioOn ? '1' : '0');
        setAudioOn(!audioOn);
    };

    const children = ({ remainingTime }) => {
        let formattedTime = remainingTime;

        if (!expanded) {
            let minutes = Math.floor(remainingTime / 60);
            let seconds = remainingTime % 60;

            minutes = String(minutes).padStart(2, '0');
            seconds = String(seconds).padStart(2, '0');

            formattedTime = `${minutes}:${seconds}`;
        }

        if(remainingTime == 3 && audioOn){
            initSound();
        }

        return (
            <Text style={[expanded ? CommonStyles.text150 : CommonStyles.text30, CommonStyles.textBold, CommonStyles.whiteText]}>
                {formattedTime}
            </Text>
        );
    };

    if (!canRender) {
        return null;
    }

    return (
        <View style={[styles.modalContainer, expanded ? styles.modalContainerExpanded : null]}>
            <View style={styles.containerHeader}>
                <Text style={[CommonStyles.text14, CommonStyles.whiteText, CommonStyles.textBold, CommonStyles.textWrap, styles.mainTitle]}>
                    {props.isWork ? Strings.label_work : Strings.label_rest_two_points}{props.title}
                </Text>
                <CustomButton
                    onPress={handleExpanded}
                    containerStyle={styles.buttonNoMargin}
                    icon={'expand-outline'}
                    iconSize={scale(28)}
                    hitSlop={{
                        top: 15,
                        right: 15,
                        bottom: 15,
                        left: 15,
                    }}
                />
            </View>
            {props.showSetInsideTimer && (
                <Text style={[expanded ? CommonStyles.text20 : CommonStyles.text11, CommonStyles.whiteText, CommonStyles.textBold]}>
                    {Strings.label_set}: {props.currentSet}
                </Text>
            )}
            <View style={[styles.innerModalContainer, expanded ? styles.innerModalContainerExpanded : null]}>
                <CustomButton
                    onPress={handleAudioOn}
                    containerStyle={[styles.buttonNoMargin, { marginTop: expanded ? scale(20) : 0 }]}
                    icon={audioOn ? 'volume-high-outline' : 'volume-mute-outline'}
                    iconSize={scale(36)}
                    hitSlop={{
                        top: 15,
                        right: 15,
                        bottom: 15,
                        left: 15,
                    }}
                />
                <CountdownCircleTimer
                    isPlaying
                    duration={timerValue}
                    colors={white}
                    onComplete={onFinish}
                    size={expanded ? screenWidth : 120}
                    strokeWidth={expanded ? 0 : 5}
                >
                    {children}
                </CountdownCircleTimer>
                <View style={[styles.containerButtons, { flexDirection: expanded ? 'row' : 'column' }]}>
                    <CustomButton
                        onPress={less10Sec}
                        text={'- 10 s'}
                        smallButton={!expanded}
                        whiteButton
                        containerStyle={styles.buttonStyle}
                    />
                    <CustomButton
                        onPress={more10Sec}
                        text={'+ 10 s'}
                        smallButton={!expanded}
                        whiteButton
                        containerStyle={[styles.buttonStyle, expanded ? styles.buttonSecondStyle : null]}
                    />
                    <CustomButton
                        onPress={onSkip}
                        text={Strings.label_close}
                        smallButton={!expanded}
                        blackButton
                        containerStyle={styles.buttonStyle}
                        icon={'close-outline'}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        zIndex: 1,
        left: '-15@s',
        right: '-15@s',
        backgroundColor: mainColor,
        padding: '10@s',
        marginHorizontal: '15@s',
    },
    modalContainerExpanded: {
        top: 0,
        paddingTop: '70@s',
    },
    containerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttonNoMargin: {
        backgroundColor: 'transparent',
        padding: 0,
    },
    innerModalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '10@s',
    },
    innerModalContainerExpanded: {
        flexDirection: 'column',
    },
    containerButtons: {
        justifyContent: 'center',
    },
    buttonStyle: {
        marginBottom: '10@s',
    },
    buttonSecondStyle: {
        marginHorizontal: '10@s',
    },
    mainTitle: {
        marginBottom: '5@s',
    },
});

export default TimerModal;
