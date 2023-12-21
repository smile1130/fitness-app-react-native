import React from 'react';
import {
    ScrollView,
    View
} from 'react-native';
import { Strings } from '../../config/Strings';
import { useNavigation } from '@react-navigation/native';
import { CommonStyles } from '../../styles/CommonStyles';
import ComponentWithBackground from '../common/ComponentWithBackground';
import HtmlCustom from '../common/HtmlCustom';
import TitleComponent from '../common/TitleComponent';
import { ScaledSheet } from 'react-native-size-matters';
import FastImage from 'react-native-fast-image';

const MealPlanInfo = (props) => {
    const navigation = useNavigation();

    const handleBack = () => {
        navigation.goBack();
    }

    const {
        text13
    } = CommonStyles;

    const renderHeader = () => {
        return (
            <TitleComponent
                title={Strings.label_meal_plan_info}
                handleBack={handleBack}
            />
        );
    }

    const renderImage = () => {
        if (!props.route.params.mealImage) {
            return;
        }

        return (
            <FastImage
                style={styles.image}
                resizeMode='contain'
                source={{
                    uri: props.route.params.mealImage
                }}
            />
        )
    }

    const renderInfo = () => {
        if (!props.route.params.info) {
            return;
        }

        return (
            <HtmlCustom
                html={props.route.params.info}
                baseFontStyle={{ ...text13 }}
            />
        )
    }

    return (
        <ComponentWithBackground safeAreaEnabled>
            <ScrollView>
                {renderHeader()}
                <View style={styles.mainContainer}>
                    {renderImage()}
                    {renderInfo()}
                </View>
            </ScrollView>
        </ComponentWithBackground>
    );
}

const styles = ScaledSheet.create({
    mainContainer: {
        marginHorizontal: '15@s',
        paddingBottom: '20@s'
    },
    image: {
        height: '150@s',
        flex: 1,
        marginBottom: '20@s'
    }
});

export default MealPlanInfo;