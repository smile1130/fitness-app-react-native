import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { ScaledSheet, scale } from 'react-native-size-matters';
import FastImage from 'react-native-fast-image';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/Ionicons';
import ComponentWithBackground from '../common/ComponentWithBackground';
import { CommonStyles } from '../../styles/CommonStyles';
import InputBorder from '../common/InputBorder';
import ProfileService from '../../services/ProfileService';
import CustomSwitch from '../common/CustomSwitch';
import { Strings } from '../../config/Strings';
import { mainColor, red, white } from '../../styles/colors';
import { Spinner } from '../common/Spinner';
import { errorImagePicker, getFileNameFromUrl } from '../../config/Util';
import { useAuth } from '../../contexts/Auth';
import { InitialStateContext } from '../../contexts/InitialStateProvider';
import CustomButton from '../common/CustomButton';
import CustomSelectModal from '../common/CustomSelectModal';

const Profile = () => {
    const initialStateContext = useContext(InitialStateContext);
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const [avatar, setAvatar] = useState(null);
    const [language, setLanguage] = useState(null);

    const languages = [
        {
            label: 'Italian 🇮🇹',
            value: 'it'
        },
        {
            label: 'English 🇬🇧',
            value: 'en'
        }
    ];

    const auth = useAuth();

    useEffect(()=>{
        loadProfileInfo();
    },[]) //notice the empty array here

    const loadProfileInfo = () => {
        ProfileService.me()
        .then(response => {

            setUserData({
                first_name: response.user.firstName,
                last_name: response.user.lastName,
                email: response.user.email,
                locale: response.user.locale,
                notifications_enabled: response.user.notifications_enabled === 1,
                emails_enabled: response.user.emails_enabled === 1,
            });
            setAvatar(response.user.photo);
            setLanguage(response.user.locale);
            setLoading(false);
        })
        .catch(null);
    }

    const doLogout = () => {
        auth.signOut();
    }

    const saveProfile = () => {
        Keyboard.dismiss();

        const params = {
            first_name: userData.first_name,
            last_name: userData.last_name,
            photo: userData.photo || null,
            locale: language,
            notifications_enabled: userData.notifications_enabled ? 1 : 0,
            emails_enabled: userData.emails_enabled ? 1 : 0
        };

        ProfileService.edit(params)
        .then((data) => {
            showMessage({
                message: Strings.strings_profile_edit_success,
                type: "success",
            });
        
            setTimeout(() => {
                if (userData['locale'] !== language) {
                    initialStateContext.updateLanguage(language);
                }
                
            }, 1500);
            
        }).catch();
    }

    const openPicker = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            includeBase64: false
        })
        .then(image => {
            const filename = image.filename || getFileNameFromUrl(image.path);

            const params = {
                uri: image.path,
                filename,
                name: filename,
                type: image.mime,
                size: image.size
            };

            userData['photo'] = params;

            setAvatar(image.path);
        })
        .catch((error => {
            errorImagePicker(error.code);
        }));
    }

    const handleFirstName = (text) => {
        userData['first_name'] = text;
    }

    const handleLastName = (text) => {
        userData['last_name'] = text;
    }

    const handleNotifications = (value) => {
        userData['notifications_enabled'] = value;
    }

    const handleEmailEnabled = (value) => {
        userData['emails_enabled'] = value;
    }

    const renderHeader = () => {
        return (
            <CustomButton
                onPress={saveProfile}
                text={Strings.label_save}
                isAbsolute
                icon={'checkmark-outline'}
            />
        )
    }

    const renderImage = () => {
        return (
            <TouchableOpacity onPress={openPicker}>
                <FastImage
                    source={{
                        uri: avatar
                    }}
                    style={styles.avatar}
                />
                <View style={styles.containerCamera}>
                    <Icon
                        name={'camera-outline'}
                        size={scale(16)}
                        color={white}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    const {
        text12,
        text16,
        textBold,
        dangerText
    } = CommonStyles;

    if(loading) {
        return <Spinner />;
    }

    return (
        <ComponentWithBackground safeAreaEnabled>
            <ScrollView contentContainerStyle={styles.mainContainer}>
                <Text style={[text16, textBold]}>{Strings.label_personal_informations}</Text>
                <View style={styles.avatarContainer}>
                    {renderImage()}
                </View>
                <InputBorder
                    label={`${Strings.label_email} ${Strings.label_not_editable}`}
                    placeholder={Strings.label_email}
                    text={userData.email}
                    editable={false}
                    marginTopInput
                />
                <InputBorder
                    label={Strings.label_name}
                    placeholder={Strings.label_name}
                    handleValue={handleFirstName}
                    text={userData.first_name}
                    marginTopInput
                />
                <InputBorder
                    label={Strings.label_surname}
                    placeholder={Strings.label_surname}
                    handleValue={handleLastName}
                    text={userData.last_name}
                    marginTopInput
                />
                <CustomSelectModal
                    label={Strings.label_language}
                    defaultSelected={languages.find(item => item.value === language)}
                    onSelect={(selected) => setLanguage(selected)}
                    items={languages}
                    marginTopInput
                />
                <View style={styles.containerSettings}>
                    <Text style={[text16, textBold]}>{Strings.label_settings}</Text>
                    <CustomSwitch
                        label={Strings.label_notifications}
                        handleValue={handleNotifications}
                        value={userData.notifications_enabled}
                    />
                    <CustomSwitch
                        label={Strings.label_email}
                        handleValue={handleEmailEnabled}
                        value={userData.emails_enabled}
                    />
                    <TouchableOpacity style={styles.textWithIcon} onPress={doLogout}>
                        <Icon
                            name={'log-out-outline'}
                            size={scale(18)}
                            color={red}
                            style={styles.logoutIcon}
                        />
                        <Text style={[text12, dangerText]}>{Strings.label_logout}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {renderHeader()}
        </ComponentWithBackground>
    );
      
}

const styles = ScaledSheet.create({
    mainContainer: {
        paddingHorizontal: '15@s',
        paddingTop: '20@s',
        paddingBottom: '50@s'
    },
    avatarContainer: {
        marginTop: '20@s',
        marginBottom: '10@s',
        alignItems: 'center'
    },
    containerCamera: {
        position: 'absolute',
        backgroundColor: mainColor,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5@s',
        width: '30@s',
        height: '30@s',
        borderRadius: '15@s',
        bottom: 0,
        right: 0
    },
    avatar: {
        width: '100@s',
        height: '100@s',
        borderRadius: '50@s'
    },
    containerSettings: {
        marginVertical: '40@s'
    },
    textWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '30@s'
    },
    logoutIcon: {
        marginRight: '5@s'
    }
});

export default Profile;