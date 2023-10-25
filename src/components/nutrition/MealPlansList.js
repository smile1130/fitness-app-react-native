import React, { PureComponent } from 'react';
import {
    FlatList,
    RefreshControl
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { mainColor, mainColorDark } from '../../styles/colors';
import EmptySection from '../common/EmptySection';
import { Strings } from '../../config/Strings';
import { Spinner } from '../common/Spinner';
import { useNavigation } from '@react-navigation/native';
import NutritionService from '../../services/NutritionService';
import ComponentWithBackground from '../common/ComponentWithBackground';
import TitleComponent from '../common/TitleComponent';
import CardWithIcon from '../common/CardWithIcon';

class MealPlansList extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            meal_plans: null
        };

        this.preRenderRefreshControl = this.renderRefreshControl();
    }

    componentDidMount() {
        this.loadMealPlansList();
    }

    renderRefreshControl = () => {
        return <RefreshControl refreshing={false} onRefresh={this.loadMealPlansList} colors={[mainColor, mainColorDark]} />
    }

    goToDetail = (id) => {
        this.props.navigation.navigate('MealPlan', {
            id
        });
    }

    handleBack = () => {
        this.props.navigation.goBack();
    }

    loadMealPlansList = () => {
        NutritionService.mealPlans()
        .then(data => {
            this.setState({
                meal_plans: data.mealPlans
            });
        }).catch(null);
    }

    renderEmptyMealPlans = () => {
        return (
            <EmptySection text={Strings.strings_empty_meal_plans} icon={'nutrition'} />
        )
    }

    renderTitle = () => {
        return (
            <TitleComponent
                title={Strings.label_meal_plans}
                handleBack={this.handleBack}
            />
        )
    }
    
    renderItem = ({item, index}) => {
        return (
            <CardWithIcon
                title={item.title}
                subtitle={item.start_at || item.created_at}
                icon={'restaurant-outline'}
                handlePress={() => this.goToDetail(item.id)}
            />
        )
    }

    render() {
        if(!this.state.meal_plans) {
            return <Spinner />
        }

        return (
            <ComponentWithBackground safeAreaEnabled>
                <FlatList
                    data={this.state.meal_plans}
                    renderItem={this.renderItem}
                    keyExtractor={(_, index) => index.toString()}
                    refreshing={false}
                    refreshControl={this.preRenderRefreshControl}
                    contentContainerStyle={styles.list}
                    ListHeaderComponent={this.renderTitle}
                    ListEmptyComponent={this.renderEmptyMealPlans}
                />
            </ComponentWithBackground>
        );
    }
}

const styles = ScaledSheet.create({
    list: {
        flexGrow: 1
    }
});

export default function(props) {
    const navigation = useNavigation();
  
    return <MealPlansList {...props} navigation={navigation} />;
};