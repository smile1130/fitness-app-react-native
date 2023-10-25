import { useEffect, useState } from 'react';
import { useGlobal, setGlobal, getGlobal } from 'reactn';
import BackgroundTimer from 'react-native-background-timer';
import { GLOBAL_ACTIVE_COUNTER_TIMER_MODAL, GLOBAL_COUNTER_TIMER_MODAL } from '../../state/StateInitializer';

const CustomBackgroundTimer = () => {
    // Use the useGlobal hook to subscribe to changes in the global state
    const [activeCounterTimerModal] = useGlobal(GLOBAL_ACTIVE_COUNTER_TIMER_MODAL);
    const [timerStarted, setTimerStarted] = useState(false);

    const startTimer = () => {
        setTimerStarted(true);

        // BackgroundTimer.runBackgroundTimer(async () => { 
        //     // Update counter timer modal
        //     if (getGlobal()[GLOBAL_ACTIVE_COUNTER_TIMER_MODAL]) {
        //         const prevCounterTimer = getGlobal()[GLOBAL_COUNTER_TIMER_MODAL];
        //         const newCounterValueTimer = prevCounterTimer + 1;

        //         setGlobal({
        //             [GLOBAL_COUNTER_TIMER_MODAL]: newCounterValueTimer
        //         });
        //     }
        // }, 500);
    }

    const stopTimer = () => {
        setTimerStarted(false);
        // BackgroundTimer.stopBackgroundTimer();
    }

    useEffect(() => {
        // Start timer when workout time or timer modal counter is active and if timer is not already started
        if (activeCounterTimerModal && !timerStarted) {
            startTimer();
        }
        // Stop timer when both counter are inactive and a timer is started
        if (!activeCounterTimerModal && timerStarted) {
            stopTimer();
        }
    }, [activeCounterTimerModal]);

    return null
}

export default CustomBackgroundTimer;