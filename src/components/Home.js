import React, { withGlobal } from 'reactn';
import {
    Text,
    View,
    SafeAreaView
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

import { mainColor, white, mainColorDark } from '../styles/colors';
import ComponentWithBackground from './common/ComponentWithBackground';
import { CommonStyles } from '../styles/CommonStyles';
import { Spinner } from './common/Spinner';
import { GLOBAL_INITIAL_STATE } from '../state/StateInitializer';
import { Strings } from '../config/Strings';
import CardsList from './common/CardsList';

const Home = ({ initialState }) => {
    const items = [
        {
            icon: 'barbell-outline',
            label: Strings.label_workouts,
            route: 'WorkoutsList',
        },
        {
            icon: 'analytics-outline',
            label: Strings.label_weights_history,
            route: 'Weights',
        },
        {
            icon: 'body-outline',
            label: Strings.label_metrics,
            route: 'Metrics',
        },
        {
            icon: 'rocket-outline',
            label: Strings.label_progresses,
            route: 'Progress',
        },
        {
            icon: 'restaurant-outline',
            label: Strings.label_nutrition,
            items: [
                {
                    icon: 'pie-chart-outline',
                    label: Strings.label_macros,
                    route: 'MacrosList',
                },
                {
                    icon: 'restaurant-outline',
                    label: Strings.label_meal_plans,
                    route: 'MealPlansList',
                },
                {
                    icon: 'nutrition-outline',
                    label: Strings.label_nutritional_advice,
                    route: 'NutritionalAdvice',
                },
                {
                    icon: 'cart-outline',
                    label: Strings.label_shopping_list,
                    route: 'ShoppingList',
                },
            ],
        },
        {
            icon: 'calendar-outline',
            label: Strings.label_reservations,
            route: 'Reservation',
        },
        {
            icon: 'reader-outline',
            label: Strings.label_surveys,
            route: 'Surveys',
        }
        // {
        //     icon: 'gift-outline',
        //     label: Strings.label_discount_codes,
        // },
    ];

    const renderInnerHeader = () => {
        const {
            text22,
            whiteText,
            textBold,
            textWrap
        } = CommonStyles;

        if (!initialState || !initialState.coach) {
            return <Spinner colorSpin={white} />
        }

        return (
            <View style={styles.containerCoachInfo}>
                <FastImage
                    style={styles.coachImage}
                    source={{
                        uri: initialState.coach.photo
                    }}
                />
                <Text style={[text22, whiteText, textBold, textWrap]}>
                    {initialState.coach.firstName + ' ' + initialState.coach.lastName}
                </Text>
            </View>
        )
    }

    const renderHeader = () => {
        const {
            boxShadowDark
        } = CommonStyles;

        return (
            <View style={[boxShadowDark, styles.containerGradient]}>
                <LinearGradient
                    start={{ x: -1, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={[mainColor, mainColor, mainColorDark]}
                    style={styles.headerContainer}
                >
                    <SafeAreaView>
                        {renderInnerHeader()}
                    </SafeAreaView>
                </LinearGradient>
            </View>
        )
    }

    return (
        <ComponentWithBackground>
            {renderHeader()}
            <CardsList
                items={items}
            />
        </ComponentWithBackground>
    );
}

const styles = ScaledSheet.create({
    headerContainer: {
        paddingVertical: '15@s'
    },
    containerGradient: {
        backgroundColor: white,
        paddingBottom: '1@s'
    },
    containerCoachInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '25@s'
    },
    coachImage: {
        width: '50@s',
        height: '50@s',
        borderRadius: '25@s',
        borderWidth: '2@s',
        borderColor: white,
        marginRight: '20@s'
    }
});

export default withGlobal(
    (global) => ({
        initialState: global[GLOBAL_INITIAL_STATE]
    })
)(Home);