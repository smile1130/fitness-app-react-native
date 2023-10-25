import React, { PureComponent } from 'react';
import {
    FlatList,
    Text,
    View
} from 'react-native';
import { scale, ScaledSheet } from 'react-native-size-matters';
import { blue, red, gray2, mainColor, orange, white } from '../../styles/colors';
import { Strings } from '../../config/Strings';
import { Spinner } from '../common/Spinner';
import { useNavigation } from '@react-navigation/native';
import NutritionService from '../../services/NutritionService';
import { CommonStyles } from '../../styles/CommonStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import ComponentWithBackground from '../common/ComponentWithBackground';
import CustomButton from '../common/CustomButton';
import TitleComponent from '../common/TitleComponent';
import CardsList from '../common/CardsList';
import { PieChart } from 'react-native-chart-kit';

class MealPlan extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            meal_plan: null,
            meal_note: null,
            hide_macros: false
        };
    }

    componentDidMount() {
        this.loadMealPlan();
    }

    formattedMealPlanDays = () => {
        return this.state.meal_plan.days.map((item) => {
            let newItem = {};

            newItem.label = item.day;
            newItem.items = [this.renderItem(item)]

            return newItem;
        });
    }

    handleBack = () => {
        this.props.navigation.goBack();
    }

    handleMealNote = () => {
        this.props.navigation.navigate('MealPlanInfo', {
            info: this.state.meal_note
        });
    }

    loadMealPlan = () => {
        const mealPlanId = this.props.route.params.id;

        NutritionService.mealPlan(mealPlanId)
        .then(data => {
            this.setState({
                meal_plan: data.mealPlan,
                meal_note: data.mealNote,
                hide_macros: data.hideMacros
            });
        }).catch();
    }

    renderHeader = () => {
        return (
            <TitleComponent
                title={Strings.label_meal_plan}
                handleBack={this.handleBack}
            />
        );
    }

    renderInfo = () => {
        if (!this.state.meal_note) {
            return null;
        }

        return (
            <CustomButton
                onPress={this.handleMealNote}
                text={Strings.label_show_info}
                containerStyle={styles.buttonMealNote}
                icon={'document-outline'}
            />
        )
    }

    renderMacros = (day) => {
        const {
            text11,
            text9,
            text22,
            whiteText,
            textBold
        } = CommonStyles;

        return (
            <View style={styles.containerMacros}>
                <View style={styles.containerCalories}>
                    <Text style={[text11, whiteText]}>{Strings.label_calories}</Text>
                    <Text style={[text22, whiteText, textBold]}>{day.calories}</Text>
                </View>
                <View style={styles.containerGraph}>
                    <PieChart
                        data={[
                            {
                                name: "Carb.",
                                value: day.carbs_tot,
                                color: blue
                            },
                            {
                                name: "Prot.",
                                value: day.protein_tot,
                                color: orange
                            },
                            {
                                name: "Grassi",
                                value: day.lipids_tot,
                                color: red
                            }
                        ]}
                        width={scale(67)}
                        height={scale(67)}
                        center={[17, 0]}
                        chartConfig={{
                            backgroundColor: mainColor,
                            color: () => white,
                            strokeWidth: 2,
                            barPercentage: 0.5
                        }}
                        accessor={"value"}
                        backgroundColor={"transparent"}
                        hasLegend={false}
                    />
                </View>
                <View>
                    <View style={styles.macro}>
                        <Text style={[text11, textBold, styles.macroCarbs]}>{day.carbs_tot}g</Text>
                        <View style={styles.macroInner}>
                            <Text style={text9}>{Strings.label_carbs}</Text>
                        </View>
                    </View>
                    <View style={styles.macro}>
                        <Text style={[text11, textBold, styles.macroProteins]}>{day.protein_tot}g</Text>
                        <View style={styles.macroInner}>
                            <Text style={text9}>{Strings.label_proteins}</Text>
                        </View>
                    </View>
                    <View style={styles.macro}>
                        <Text style={[text11, textBold, styles.macroLipids]}>{day.lipids_tot}g</Text>
                        <View style={styles.macroInner}>
                            <Text style={text9}>{Strings.label_lipids}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    renderAliment = (aliments_length, item, index) => {
        const {
            textBold,
            mainText
        } = CommonStyles;

        return (
            <View style={[
                styles.aliment,
                index > 0 ? styles.alternative : null,
                index === 0 && aliments_length > 1 ? styles.hasAlternative : null,
                index === aliments_length - 1 && aliments_length > 1 ? styles.lastAlternative : null
            ]}>
                <View style={{ flex: 0.85 }}>
                    <Text>
                        {
                            index > 0 &&
                                <Text style={mainText}>{Strings.label_or} </Text>
                        }
                        {item.custom_name}
                    </Text>
                </View>
                <View style={{ flex: 0.15, alignItems: 'flex-end' }}>
                    <Text style={textBold}>{item.custom_quantity}g</Text>
                </View>
            </View>
        )
    }

    renderMealComponent = ({item, index}) => {
        const aliments_length = item.aliments.length;

        return (
            <FlatList
                data={item.aliments}
                renderItem={({item, index}) => this.renderAliment(aliments_length, item, index)}
                keyExtractor={(_, index) => index.toString()}
                refreshing={false}
            />
        )
    }

    renderNote = (item) => {
        if(!item.meal_description) {
            return null;
        }

        const {
            text12,
            textBold
        } = CommonStyles;

        return (
            <View>
                <Text style={[text12, textBold]}>{Strings.label_notes}</Text>
                <Text>{item.meal_description}</Text>
            </View>
        )
    }

    renderMeal = ({item, index}) => {
        const {
            text12,
            textWrap,
            textBold,
            mainText
        } = CommonStyles;

        return (
            <View style={styles.containerMeal}>
                <View style={styles.containerMealHeader}>
                    <Text style={[text12, textWrap, textBold]}>{item.meal_title}</Text>
                    <View style={styles.containerTime}>
                        <Icon
                            name={'time'}
                            size={scale(13)}
                            color={mainColor}
                        />
                        <Text style={[mainText, textBold]}>{item.meal_time}</Text>
                    </View>
                </View>
                <FlatList
                    data={item.mealComponents}
                    renderItem={this.renderMealComponent}
                    keyExtractor={(_, index) => index.toString()}
                    refreshing={false}
                />
                {this.renderNote(item)}
            </View>
        )
    }

    renderItem = (item) => {
        return (
            <View style={styles.innerItem}>
                { !this.state.hide_macros && this.renderMacros(item) }
                <FlatList
                    data={item.meals}
                    renderItem={this.renderMeal}
                    keyExtractor={(_, index) => index.toString()}
                    refreshing={false}
                />
            </View>
        )
    }

    renderContainer = () => {
        const {
            text16
        } = CommonStyles;

        return (
            <CardsList
                items={this.formattedMealPlanDays()}
                labelStyle={text16}
                itemStyle={styles.item}
                onRefresh={this.loadMealPlan}
            />
        )
    }
    
    render() {
        if(!this.state.meal_plan) {
            return <Spinner />
        }

        return (
            <ComponentWithBackground safeAreaEnabled>
                {this.renderHeader()}
                {this.renderInfo()}
                {this.renderContainer()}
            </ComponentWithBackground>
        );
    }
}

const styles = ScaledSheet.create({
    containerMacros: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: '20@s',
        marginBottom: '15@s',
        borderBottomColor: gray2,
        borderBottomWidth: 1
    },
    macro: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerGraph: {
        marginHorizontal: '10@s'
    },
    macroInner: {
        marginLeft: '3@s',
        marginTop: '1@s'
    },
    macroCarbs: {
        color: blue
    },
    macroProteins: {
        color: orange
    },
    macroLipids: {
        color: red
    },
    item: {
        paddingVertical: '13@s'
    },
    innerItem: {
        flex: 1
    },
    containerMeal: {
        borderBottomWidth: '1@s',
        borderBottomColor: gray2,
        paddingVertical: '10@s',
        marginBottom: '10@s'
    },
    containerMealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flex: 1,
        marginBottom: '15@s'
    },
    containerTime: {
        marginLeft: '10@s',
        flexDirection: 'row',
        alignItems: 'center'
    },
    aliment: {
        marginBottom: '15@s',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    alternative: {
        marginLeft: '10@s',
        marginBottom: '5@s'
    },
    hasAlternative: {
        marginBottom: '5@s'
    },
    lastAlternative: {
        marginBottom: '15@s'
    },
    buttonMealNote: {
        marginHorizontal: '15@s'
    },
    containerCalories: {
        borderRadius: '12@s',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: mainColor,
        paddingTop: '6@s',
        paddingBottom: '2@s',
        paddingHorizontal: '15@s'
    }
});

export default function(props) {
    const navigation = useNavigation();
  
    return <MealPlan {...props} navigation={navigation} />;
};