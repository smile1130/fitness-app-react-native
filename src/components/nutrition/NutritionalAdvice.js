import React, { PureComponent } from 'react';
import { ScaledSheet } from 'react-native-size-matters';
import { mainColor } from '../../styles/colors';
import { CommonStyles } from '../../styles/CommonStyles';
import EmptySection from '../common/EmptySection';
import { Strings } from '../../config/Strings';
import { Spinner } from '../common/Spinner';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../common/CustomButton';
import NutritionService from '../../services/NutritionService';
import ComponentWithBackground from '../common/ComponentWithBackground';
import MediasList from '../common/MediasList';
import TitleComponent from '../common/TitleComponent';

class NutritionalAdvice extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            nutritional_advices: null,
            nextPage: null,
            disabledButton: false
        };
    }

    componentDidMount() {
        this.loadNutritionalAdvices();
    }

    handleBack = () => {
        this.props.navigation.goBack();
    }

    loadNutritionalAdvices = () => {
        NutritionService.nutritionalAdvices()
        .then(data => {
            this.setState({
                nutritional_advices: data.nutritional_advices,
                nextPage: data.next_page
            });
        }).catch(null);
    }

    attachNutritionalAdvices = (nextPage) => {
        this.setState({
            disabledButton: true
        });
        
        let params = {
            page: nextPage
        };

        NutritionService.nutritionalAdvices(params)
        .then(data => {
            this.setState({
                nutritional_advices: [...this.state.nutritional_advices, ...data.nutritional_advices],
                nextPage: data.next_page,
                disabledButton: false
            });
        }).catch(null);
    }

    renderEmptyNutritionalAdvices = () => {
        return (
            <EmptySection text={Strings.strings_empty_nutritional_advices} icon={'images'} />
        )
    }

    renderFooter = () => {
        if(!this.state.nextPage) {
            return null;
        }

        const {
            text12
        } = CommonStyles;

        return (
            <CustomButton
                onPress={() => this.attachNutritionalAdvices(this.state.nextPage)}
                text={Strings.label_load_more}
                containerStyle={styles.loadMoreBtn}
                disabled={this.state.disabledButton}
            />
        )
    }

    renderHeader = () => {
        return (
            <TitleComponent
                title={Strings.label_nutritional_advice}
                handleBack={this.handleBack}
            />
        );
    };

    render() {
        if(!this.state.nutritional_advices) {
            return <Spinner />
        }

        return (
            <ComponentWithBackground safeAreaEnabled>
                <MediasList
                    medias={this.state.nutritional_advices}
                    numColumns={1}
                    ListHeaderComponent={this.renderHeader}
                    ListEmptyComponent={this.renderEmptyNutritionalAdvices}
                    ListFooterComponent={this.renderFooter}
                    onRefresh={this.loadNutritionalAdvices}
                />
            </ComponentWithBackground>
        );
    }
}

const styles = ScaledSheet.create({
    loadMoreBtn: {
        marginTop: '20@s',
        marginHorizontal: '15@s'
    },
});

export default function(props) {
    const navigation = useNavigation();
  
    return <NutritionalAdvice {...props} navigation={navigation} />;
};