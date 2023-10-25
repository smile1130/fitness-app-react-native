import React, { Component } from 'react';
import {
    SafeAreaView,
    View,
    TouchableOpacity
} from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import { black, white } from '../../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { screenWidth, screenHeight } from '../../config/Util';
import FastImage from 'react-native-fast-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import CompareSlider from './CompareSlider';

class CompareImagesModal extends Component {
    constructor(props) {
        super(props);
    };

    renderClose = () => {
        return (
            <TouchableOpacity
                onPress={this.props.navigation.goBack}
                style={styles.backIcon}
                hitSlop={{
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10
                }}
            >
                <Icon
                    name={'close-circle'}
                    size={scale(26)}
                    color={white}
                />
            </TouchableOpacity>
        )
    }

    renderSlider = () => {
        return (
            <CompareSlider
                imageWidth={screenWidth}
                imageHeight={screenHeight * 0.8}
                initialPosition={50}
                leftImageURI={ this.props.route.params.images[0] }
                rightImageURI={ this.props.route.params.images[1] }
            />
        )
    }

    renderSideImages = () => {
        const images = [];

        this.props.route.params.images.forEach((item, index) => {
            images.push(
                <ImageViewer
                    key={index}
                    imageUrls={[{url: item}]}
                    renderIndicator={() => {}}
                    renderImage={(props)=>{
                        return(
                            <FastImage
                                source={{
                                    uri: item
                                }}
                                style={styles.flex1}
                                resizeMode={'cover'}
                            />
                        )
                    }}
                />
            )
        })

        return (
            <View style={styles.containerSideImages}>
                {images}
            </View>
        )
    }
    
    render() {
        return (
            <SafeAreaView style={styles.container}>
                {this.renderClose()}
                <View style={styles.containerComparison}>
                    {this.props.route.params.type === 'compare' ? this.renderSideImages() : this.renderSlider()}
                </View>
            </SafeAreaView>
        )
    }
}

const styles = ScaledSheet.create({
    flex1: {
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: black
    },
    containerComparison: {
        flex: 1,
        marginTop: screenHeight * 0.05
    },
    containerSideImages: {
        height: screenHeight * 0.8,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    backIcon: {
        position: 'absolute',
        zIndex: 10,
        top: '40@s',
        right: '20@s'
    }
});

export default function(props) {
    const navigation = useNavigation();
  
    return <CompareImagesModal {...props} navigation={navigation} />;
}