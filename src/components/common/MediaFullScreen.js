import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    TouchableOpacity
} from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import { black, white } from '../../styles/colors';
import { Spinner } from './Spinner';
import { useNavigation } from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { isAndroid } from '../../config/Util';
import FastImage from 'react-native-fast-image';

const MediaFullScreen = (props) => {
    const { url, type } = props.route.params;
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    const goBack = () => {
        navigation.goBack();
    }

    const renderClose = () => {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={goBack}
                style={styles.backIcon}
                hitSlop={{
                    top: 20,
                    right: 20,
                    bottom: 15,
                    left: 15
                }}
            >
                <View style={styles.backIconInner}>
                    <Icon
                        name={'close'}
                        size={scale(20)}
                        color={black}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    const onLoad = () => {
        setLoading(false);
    };

    const renderImage = () => {
        return (
            <ImageViewer
                style={styles.containerInner}
                imageUrls={[{url: url}]}
                renderIndicator={() => null}
                renderImage={(props)=>{
                    return(
                        <FastImage
                            source={{
                                uri: url
                            }}
                            style={styles.image}
                            resizeMode={'cover'}
                        />
                    )
                }}
            />
        )
    }

    const renderVideo = () => {
        return (
            <View style={{ flex: 1 }}>
                <Video
                    source={{ uri: url }}
                    controls={true}
                    paused={false}
                    style={styles.video}
                    resizeMode={'contain'}
                    ignoreSilentSwitch={'ignore'}
                    repeat={true}
                    onLoad={onLoad}
                />
                {loading && <Spinner style={styles.spinner} />}
            </View>
        )
    }

    const renderContent = () => {
        if (type === 'image') {
            return renderImage();
        } else {
            return renderVideo();
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {renderClose()}
            {renderContent()}
        </SafeAreaView>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: black
    },
    containerInner: {
        marginTop: isAndroid ? 0 : -30
    },
    image: {
        flex: 1
    },
    backIcon: {
        position: 'absolute',
        zIndex: 10,
        top: '0@s',
        right: '0@s',
        paddingRight: '20@s',
        paddingTop: '40@s'
    },
    backIconInner: {
        width: '26@s',
        height: '26@s',
        backgroundColor: white,
        borderRadius: '13@s',
        borderWidth: '1@s',
        borderColor: black,
        alignItems: 'center',
        justifyContent: 'center'
    },
    video: {
        flex: 1,
        marginVertical: '30@s'
    },
    spinner: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default MediaFullScreen;