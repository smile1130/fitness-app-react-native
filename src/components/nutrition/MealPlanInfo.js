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

const MealPlanInfo = (props) => {
    const navigation = useNavigation();

    const handleBack = () => {
        navigation.goBack();
    }

    const renderHeader = () => {
        return (
            <TitleComponent
                title={Strings.label_meal_plan_info}
                handleBack={handleBack}
            />
        );
    }
    
    const {
        text13
    } = CommonStyles;

    return (
        <ComponentWithBackground safeAreaEnabled>
            <ScrollView>
                {renderHeader()}
                <View style={styles.mainContainer}>
                    <HtmlCustom
                        html={props.route.params.info}
                        baseFontStyle={{ ...text13 }}
                    />
                </View>
            </ScrollView>
        </ComponentWithBackground>
    );
}

const styles = ScaledSheet.create({
    mainContainer: {
        marginHorizontal: '15@s',
        paddingBottom: '20@s'
    }
});

export default MealPlanInfo;