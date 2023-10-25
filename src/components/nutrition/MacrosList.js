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
import TitleComponent from '../common/TitleComponent';
import ComponentWithBackground from '../common/ComponentWithBackground';
import CardWithIcon from '../common/CardWithIcon';

class MacrosList extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            macros: null
        };

        this.preRenderRefreshControl = this.renderRefreshControl();
    }

    componentDidMount() {
        this.loadMacrosList();
    }

    renderRefreshControl = () => {
        return <RefreshControl refreshing={false} onRefresh={this.loadMacrosList} colors={[mainColor, mainColorDark]} />
    }

    goToDetail = (id) => {
        this.props.navigation.navigate('Macro', {
            id
        });
    }

    handleBack = () => {
        this.props.navigation.goBack();
    }

    loadMacrosList = () => {
        NutritionService.macros()
        .then(data => {
            this.setState({
                macros: data.macros
            });
        }).catch(null);
    }

    renderEmptyMacros = () => {
        return (
            <EmptySection text={Strings.strings_empty_macros} icon={'nutrition'} />
        )
    }

    renderTitle = () => {
        return (
            <TitleComponent
                title={Strings.label_macros}
                handleBack={this.handleBack}
            />
        )
    }
    
    renderItem = ({item, index}) => {
        return (
            <CardWithIcon
                title={item.title}
                subtitle={item.start_at || item.created_at}
                icon={'pie-chart-outline'}
                handlePress={() => this.goToDetail(item.id)}
            />
        )
    }

    render() {
        if(!this.state.macros) {
            return <Spinner />
        }

        return (
            <ComponentWithBackground safeAreaEnabled>
                <FlatList
                    data={this.state.macros}
                    renderItem={this.renderItem}
                    keyExtractor={(_, index) => index.toString()}
                    refreshing={false}
                    refreshControl={this.preRenderRefreshControl}
                    contentContainerStyle={styles.list}
                    ListHeaderComponent={this.renderTitle}
                    ListEmptyComponent={this.renderEmptyMacros}
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
  
    return <MacrosList {...props} navigation={navigation} />;
};