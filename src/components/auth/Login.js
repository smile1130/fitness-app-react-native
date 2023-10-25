import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';

import { CommonStyles } from '../../styles/CommonStyles';
import CustomButton from '../common/CustomButton';
import { getLocaleFromDevice, screenHeight } from '../../config/Util';
import { white, mainColor, mainColorDark } from '../../styles/colors';
import { Strings } from '../../config/Strings';
import { OSAppId } from '../../config/OneSignal';
import { useAuth } from '../../contexts/Auth';
import { CoachId } from '../../config/Variables';
import AuthService from '../../services/AuthService';
import { showMessage } from 'react-native-flash-message';
import OneSignal from 'react-native-onesignal';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomModal from '../common/CustomModal';
import InputBorder from '../common/InputBorder';

const styles = ScaledSheet.create({
    mainContainer: {
        flex: 1
    },
    innerContainer: {
        flex: 1,
        paddingTop: screenHeight * 0.15,
        paddingHorizontal: '40@s'
    },
    buttonStyle: {
        marginTop: '50@s',
        borderRadius: '40@s'
    },
    containerInputs: {
        marginTop: '40@s'
    },
    textInputContainer: {
        borderBottomColor: white,
        borderBottomWidth: '1@s',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: '20@s'
    },
    forgotten_password: {
        marginTop: '20@s'
    }
});

const Login = () => {
    const [email, setEmail] = useState(null);
    const [emailForget, setEmailForget] = useState(null);
    const [password, setPassword] = useState(null);
    const [passwordShow, setPasswordShow] = useState(false);
    const auth = useAuth();
    const [visible, setVisible] = useState(false);

    const showDialog = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };
    
    const handleResetPassword = () => {
        doResetPassword();
        setVisible(false);
    };

    const handleLogin = async () => {
        const deviceState = await OneSignal.getDeviceState();

        const params = {
            email: email,
            password: password,
            mobile: true,
            player_id: deviceState ? deviceState.userId : null,
            os_app_id: OSAppId,
            coach_id: CoachId
        };
    
        auth.signIn(params);
    }

    const doResetPassword = () => {
        const user_locale = getLocaleFromDevice();

        const params = {
            email: emailForget,
            user_locale
        };

        AuthService.resetPassword(params)
        .then(data => {
            showMessage({
                message: Strings.strings_email_recovery_sent_succesfull,
                type: "success",
            });
        }).catch();
    }

    const renderDialogForgotten = () => {
        return (
            <CustomModal
                visible={visible}
                title={Strings.label_forgotten_password}
                subtitle={Strings.strings_forgotten_password_desc}
                onCancel={handleCancel}
                onConfirm={handleResetPassword}
                confirmText={Strings.label_confirm}
            >
                <InputBorder
                    placeholder={Strings.label_email}
                    text={emailForget}
                    handleValue={(email) => {setEmailForget(email)}}
                />
            </CustomModal>
        )
    }

    const {
        textExtraBold,
        text30,
        text22,
        textInput,
        whiteText
    } = CommonStyles;

    return (
        <LinearGradient colors={[mainColor, mainColor, mainColor, mainColorDark]} style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.innerContainer}>
                <Text style={[textExtraBold, text30, whiteText]}>{Strings.label_log_in}</Text>
                <View style={styles.containerInputs}>
                    <View style={styles.textInputContainer}>
                        <Icon
                            name={'person-outline'}
                            color={white}
                            size={scale(16)}
                        />
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor={white}
                            value={email}
                            onChangeText={(email) => {setEmail(email)}}
                            autoCapitalize='none'
                            style={textInput}
                        />
                    </View>
                    <View style={styles.textInputContainer}>
                        <Icon
                            name={'lock-closed-outline'}
                            color={white}
                            size={scale(16)}
                        />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor={white}
                            value={password}
                            onChangeText={(password) => {setPassword(password)}}
                            style={textInput}
                            autoCapitalize='none'
                            secureTextEntry={!passwordShow}
                        />
                        <TouchableOpacity
                            onPress={() => setPasswordShow(!passwordShow)}
                        >
                            <Icon
                                name={passwordShow ? 'eye-outline' : 'eye-off-outline'}
                                color={white}
                                size={scale(16)}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={showDialog}
                        style={styles.forgotten_password}
                    >
                        <Text style={whiteText}>{Strings.label_forgotten_password}</Text>
                    </TouchableOpacity>
                    { renderDialogForgotten() }
                    <CustomButton
                        onPress={handleLogin}
                        text={'Log In'}
                        whiteButton
                        containerStyle={styles.buttonStyle}
                        textStyle={[text22, textExtraBold]}
                    />
                </View> 
            </ScrollView>
        </LinearGradient>
    )
}

export default Login;