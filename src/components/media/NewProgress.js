import React, { PureComponent } from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    ScrollView
} from 'react-native';
import { setGlobal } from 'reactn';
import { formatYMDDateNoTZ, isAndroid } from '../../config/Util';
import ComponentWithBackground from '../common/ComponentWithBackground';
import { showMessage } from 'react-native-flash-message';
import { ScaledSheet } from 'react-native-size-matters';
import { CommonStyles } from '../../styles/CommonStyles';
import { GLOBAL_REFRESH_PROGRESS_LIST } from '../../state/StateInitializer';
import { Strings } from '../../config/Strings';
import CustomButton from '../common/CustomButton';
import ProgressService from '../../services/ProgressService';
import CustomDatePicker from '../common/CustomDatePicker';
import { useNavigation } from '@react-navigation/native';
import UploadMedias from '../common/UploadMedias';
import TitleComponent from '../common/TitleComponent';
import MediasList from '../common/MediasList';
import InputBorder from '../common/InputBorder';

class NewProgress extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            progressData: new Date(),
            isDatePickerVisible: false,
            loadingProgress: false,
            frontImage: null,
            sideImage: null,
            backImage: null,
        };
    }

    handleBack = () => {
        this.props.navigation.goBack();
    }

    addProgress = () => {
        const params = {
            taken_on: formatYMDDateNoTZ(this.state.progressData),
            front_file: this.state.frontImage || null,
            side_file: this.state.sideImage || null,
            back_file: this.state.backImage || null,
        };

        // Check params
        if(
            !params.taken_on ||
            (
                !params.front_file &&
                !params.side_file &&
                !params.back_file
            )
        ) {
            showMessage({
                message: Strings.exceptions_no_data_or_image,
                type: "danger",
            });

            return;
        }

        this.setState({
            loadingProgress: true
        });

        ProgressService.addProgress(params)
        .then(() => {
            // Refresh metrics list
            setGlobal({
                [GLOBAL_REFRESH_PROGRESS_LIST]: true
            });

            // Show success message
            showMessage({
                message: Strings.label_progress_added,
                type: "success",
            });

            // Go back
            setTimeout(() => {
                this.props.navigation.goBack();
            }, 1500);
        }).catch(() => {
            this.setState({
                loadingProgress: false
            });
        });
    }

    handleFile = (type, file) => {
        this.setState({
            [type]: file
        });
    }

    handleRemove = (type) => {
        this.setState({
            [type]: null
        });
    }

    formatDate = () => {
        return formatYMDDateNoTZ(this.state.progressData);
    }

    toggleDatePicker = () => {
        this.setState({isDatePickerVisible: !this.state.isDatePickerVisible});
    }

    onChangeDate = (event, progressData) => {
        if(progressData !== undefined) {
            if(isAndroid) {
                this.setState({isDatePickerVisible: !this.state.isDatePickerVisible}, () => {
                    this.setState({ progressData });
                });
            } else {
                this.setState({ progressData });
            }
        } else {
            this.toggleDatePicker();
        }
    }

    renderDateModal = () => {
        return (
            <CustomDatePicker
                onChangeDate={this.onChangeDate}
                date={this.state.progressData}
                isDatePickerVisible={this.state.isDatePickerVisible}
                toggleModal={this.toggleDatePicker}
            />
        )
    }

    renderEmptyImage = (type, text) => {
        const {
            text12
        } = CommonStyles;

        return (
            <View style={styles.addProgressContainer}>
                <UploadMedias
                    handleFileChange={(file) => this.handleFile(type, file.file)}
                    showLabel={false}
                    hideUploadingMessage
                    hideDocument
                    mediaType='photo'
                />
                <Text style={[text12, styles.addProgressText]}>{text}</Text>
            </View>
        )
    }

    renderImage = (type, text) => {
        const url = this.state[type] ? this.state[type].uri : null;

        if(!url) {
            return this.renderEmptyImage(type, text)
        }

        return (
            
            <View
                style={styles.progressContainer}
            >
                <MediasList
                    medias={{
                        file_url:  url,
                        type: 'image'
                    }}
                    showIcon
                    handlePressIcon={() => this.handleRemove(type)}
                />
            </View>
        )
    }

    renderProgressImages = () => {
        return (
            <View style={styles.innerProgress}>
                {this.renderImage('frontImage', Strings.label_load_front_photo)}
                {this.renderImage('sideImage', Strings.label_load_side_photo)}
                {this.renderImage('backImage', Strings.label_load_back_photo)}
            </View>
        )
    }

    renderTitle = () => {
        return (
            <TitleComponent
                title={Strings.label_add_progress}
                handleBack={this.handleBack}
            />
        )
    }

    render() {
        return (
            <ComponentWithBackground safeAreaEnabled>
                <ScrollView contentContainerStyle={styles.list}>
                    {this.renderTitle()}
                    <View style={styles.container}>
                        <TouchableOpacity activeOpacity={1} onPress={this.toggleDatePicker}>
                            <InputBorder
                                label={Strings.label_date}
                                placeholder={Strings.label_insert_date}
                                text={this.formatDate()}
                                editable={false}
                            />
                        </TouchableOpacity>
                        <View style={styles.containerLoadedProgress}>
                            {this.renderProgressImages()}
                        </View>
                        <CustomButton
                            onPress={this.addProgress}
                            text={Strings.label_load_progress}
                            containerStyle={styles.saveBtn}
                            showSpinner={this.state.loadingProgress}
                        />
                    </View>
                </ScrollView>
                {this.renderDateModal()}
            </ComponentWithBackground>
        );
    }
}

const styles = ScaledSheet.create({
    list: {
        marginBottom: '20@s'
    },
    container: {
        marginHorizontal: '15@s'
    },
    addProgressContainer: {
        flex: 0.325,
        aspectRatio: 1/1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '8@s'
    },
    addProgressText: {
        textAlign: 'center',
        marginTop: '10@s'
    },
    progressContainer: {
        flex: 0.325,
        aspectRatio: 1/1,
        borderRadius: '8@s'
    },
    innerProgress: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '3@s'
    },
    containerLoadedProgress: {
        marginTop: '20@s'
    },
    saveBtn: {
        marginTop: '30@s'
    }
});

export default function(props) {
    const navigation = useNavigation();
  
    return <NewProgress {...props} navigation={navigation} />;
}