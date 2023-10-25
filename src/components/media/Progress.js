import React, { PureComponent } from 'react';
import {
    FlatList,
    View,
    Text,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import { setGlobal, withGlobal } from 'reactn';
import { ScaledSheet } from 'react-native-size-matters';
import { mainColor, mainColorDark, white, applyOpacity } from '../../styles/colors';
import { CommonStyles } from '../../styles/CommonStyles';
import { GLOBAL_REFRESH_PROGRESS_LIST } from '../../state/StateInitializer';
import EmptySection from '../common/EmptySection';
import { Strings } from '../../config/Strings';
import { Spinner } from '../common/Spinner';
import FastImage from 'react-native-fast-image';
import ProgressService from '../../services/ProgressService';
import { showMessage } from 'react-native-flash-message';
import ConfirmModal from '../common/ConfirmModal';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../common/CustomButton';
import { FloatingActionCustom } from '../common/FloatingActionCustom';
import ComponentWithBackground from '../common/ComponentWithBackground';
import TitleComponent from '../common/TitleComponent';


class Progress extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            progress: null,
            isModalVisible: false,
            comparing: null,
            imagesToCompares: []
        };

        this.selectedProgressId = null;

        this.preRenderRefreshControl = this.renderRefreshControl();

        this.floatingActionsItems = [
            {
              text: Strings.label_add_progress,
              icon: 'add-outline',
              name: "new_progress"
            },
            {
              text: Strings.label_compare_images,
              icon: 'images-outline',
              name: "compare",
            },
            {
              text: Strings.label_compare_images_slider,
              icon: 'swap-horizontal-outline',
              name: "compare_slider"
            }
        ];
    }

    componentDidMount() {
        this.loadProgress();
    }

    componentDidUpdate(prevProps) {
        if(
            this.props.refreshProgressList !== prevProps.refreshProgressList
            && this.props.refreshProgressList
        ) {

            // Scroll list on top
            if(this.state.progress && this.state.progress.length > 0) {
                this.flatListProgressRef.scrollToOffset({ animated: false, offset: 0 });
            }

            setGlobal({
                [GLOBAL_REFRESH_PROGRESS_LIST]: false
            });

            this.loadProgress();
        }
    }

    renderRefreshControl = () => {
        return <RefreshControl refreshing={false} onRefresh={this.loadProgress} colors={[mainColor, mainColorDark]} />
    }

    loadProgress = () => {
        ProgressService.progress()
        .then(data => {
            this.setState({
                progress: data.progress
            });
        }).catch(null);
    }

    handleBack = () => {
        this.props.navigation.goBack();
    }

    handleRemove = () => {
        this.toggleModal();

        ProgressService.deleteProgress(this.selectedProgressId)
        .then(() => {
            this.loadProgress();
            // Show success message
            showMessage({
                message: Strings.label_progress_deleted,
                type: "success",
            });
        }).catch(null);
    }

    handleRemoveButton = (id) => {
        this.selectedProgressId = id;
        this.toggleModal();
    }

    goToCompareImages = () => {
        this.props.navigation.navigate('CompareImagesModal', {
            images: this.state.imagesToCompares,
            type: this.state.comparing
        });
    }

    goToAddProgress = () => {
        this.props.navigation.navigate('NewProgress');
    }

    handleClickImageToCompare = (url) => {
        const found = this.state.imagesToCompares.find(item => item === url);

        if (found) {
            this.setState({
                imagesToCompares: this.state.imagesToCompares.filter(item => item !== url)
            });
        } else {

            if (this.state.comparing === 'compare_slider' && this.state.imagesToCompares.length === 2) {
                return;
            }

            this.setState({
                imagesToCompares: [
                    ...this.state.imagesToCompares,
                    url
                ]
            });
        }
    }

    handleOpenImage = (url) => {
        if (this.state.comparing) {
            this.handleClickImageToCompare(url);
        } else {
            this.props.navigation.navigate('MediaFullScreen', {
                url,
                type: 'image'
            });
        }
    }

    toggleModal = () => {
        this.setState({isModalVisible: !this.state.isModalVisible});
    }

    renderEmptyProgress = () => {
        return (
            <EmptySection text={Strings.strings_empty_progress} icon={'images'} />
        )
    }

    renderImage = (url, name, isMiddle = false) => {
        const {
            text10,
            textRegular,
            textCenter,
            whiteText,
            text30,
            textBold
        } = CommonStyles;

        if(!url) {
            return null;
        }

        const selectedItem = this.state.imagesToCompares.find(item => item === url);
        const selectedItemIndex = this.state.imagesToCompares.findIndex(item => item === url);
        const comparingBorder = this.state.comparing ? (selectedItem ? styles.selectedImage : styles.comparingBorder) : null;

        return (
            <View style={[styles.mainProgressContainer, isMiddle ? styles.mainProgressContainerMiddle : null]}>
                <TouchableOpacity
                    style={styles.progressContainer}
                    onPress={() => this.handleOpenImage(url)}
                    activeOpacity={0.9}
                >
                    <FastImage
                        source={{
                            uri: url
                        }}
                        style={[styles.progressImage, comparingBorder]}
                    />
                    {
                        selectedItem &&
                        <View
                            style={styles.containerNumberCompare}
                        >
                            <Text style={[text30, textBold, whiteText]}>{ selectedItemIndex + 1 }</Text>
                        </View>
                    }
                    
                </TouchableOpacity>
                <Text style={[text10, textRegular, textCenter]}>{name}</Text>
            </View>
            
        )
    }

    renderInnerProgress = (progress) => {
        return (
            <View style={styles.innerProgress}>
                {this.renderImage(progress.frontImage ? progress.frontImage.file_url : null, Strings.label_front_photo)}
                {this.renderImage(progress.sideImage ? progress.sideImage.file_url : null, Strings.label_side_photo, true)}
                {this.renderImage(progress.backImage ? progress.backImage.file_url : null, Strings.label_back_photo)}
            </View>
        )
    }
    
    renderProgress = ({item, index}) => {
        const {
            text18,
            textBold
        } = CommonStyles;

        return (
            <View style={styles.containerProgressSection}>
                <View style={styles.progressSection}>
                    <Text style={[text18, textBold]}>{item.takenOn}</Text>
                    {
                        !this.state.comparing &&
                        <CustomButton
                            onPress={() => this.handleRemoveButton(item.id)}
                            text={Strings.label_delete}
                            smallButton
                        />
                    }
                </View>
                { this.renderInnerProgress(item) }
            </View>
        )
    }

    cancelComparing = () => {
        this.setState({
            comparing: null,
            imagesToCompares: []
        });
    }

    handleFloatingItem = (name) => {
        if (name === 'new_progress') {
            this.goToAddProgress();
        } else {
            this.setState({ comparing: name });
        }
    }

    renderAddProgress = () => {
        if (this.state.progress && this.state.progress.length === 0) {
            return (
                <CustomButton
                    onPress={this.goToAddProgress}
                    text={Strings.label_add_progress}
                    isAbsolute
                    icon={'images'}
                />
            )
        }

        if (this.state.comparing) {
            return (
                <View style={styles.compareButtonsContainer}>
                    {
                        this.state.imagesToCompares.length >= 2 &&
                            <CustomButton
                                onPress={this.goToCompareImages}
                                text={Strings.label_compare}
                                icon={'images'}
                                containerStyle={styles.compareButton}
                            />
                    }
                    <CustomButton
                        onPress={this.cancelComparing}
                        text={Strings.label_undo}
                        secondaryButton
                        icon={'close-outline'}
                    />
                </View>
            )
        }

        return (
            <FloatingActionCustom
                handleItem={this.handleFloatingItem}
                actions={this.floatingActionsItems}
            />
        )
    }

    renderModal = () => {
        return (
            <ConfirmModal
                text={Strings.strings_confirm_delete_progress}
                toggleModal={this.toggleModal}
                isModalVisible={this.state.isModalVisible}
                action={this.handleRemove}
            />
        )
    }

    renderTitle = () => {
        return (
            <TitleComponent
                title={Strings.label_progresses}
                handleBack={this.handleBack}
            />
        )
    }

    render() {
        if(!this.state.progress) {
            return <Spinner />
        }

        return (
            <ComponentWithBackground safeAreaEnabled>
                <FlatList
                    data={this.state.progress}
                    renderItem={this.renderProgress}
                    ref={(ref) => { this.flatListProgressRef = ref; }}
                    keyExtractor={(_, index) => index.toString()}
                    refreshing={false}
                    refreshControl={this.preRenderRefreshControl}
                    contentContainerStyle={styles.list}
                    ListHeaderComponent={this.renderTitle}
                    ListEmptyComponent={this.renderEmptyProgress}
                />
                {this.renderModal()}
                {this.renderAddProgress()}
            </ComponentWithBackground>
        );
    }
}

const styles = ScaledSheet.create({
    list: {
        flexGrow: 1,
        paddingBottom: '90@s'
    },
    mainProgressContainer: {
        flex: 0.333
    },
    mainProgressContainerMiddle: {
        paddingHorizontal: '3@s'
    },
    progressContainer: {
        flex: 1,
        aspectRatio: 1/1,
        borderRadius: '5@s',
        marginHorizontal: '1@s',
        marginBottom: '5@s'
    },
    comparingBorder: {
        borderWidth: 1,
        borderRadius: '8@s',
        borderColor: mainColor
    },
    selectedImage: {
        borderWidth: 2,
        borderRadius: '8@s',
        borderColor: mainColor
    },
    innerProgress: {
        flex: 1,
        flexDirection: 'row',
        marginTop: '3@s'
    },
    progressImage: {
        flex: 1,
        borderRadius: '8@s'
    },
    containerProgressSection: {
        backgroundColor: white,
        marginBottom: '20@s',
        borderRadius: '10@s',
        marginHorizontal: '15@s',
        paddingTop: '10@s',
        paddingBottom: '5@s',
        paddingHorizontal: '10@s'
    },
    containerNumberCompare: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: applyOpacity(mainColor, 0.5),
        borderRadius: '8@s',
        alignItems: 'center',
        justifyContent: 'center'
    },
    progressSection:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '15@s'
    },
    compareButtonsContainer: {
        position: 'absolute',
        bottom: '15@s',
        marginHorizontal: '15@s',
        right: 0,
        left: 0,
        zIndex: 10
    },
    compareButton: {
        marginBottom: '10@s'
    }
});

export default withGlobal(
    (global) => ({
        refreshProgressList: global[GLOBAL_REFRESH_PROGRESS_LIST]
    })
)(function(props) {
    const navigation = useNavigation();
  
    return <Progress {...props} navigation={navigation} />;
});