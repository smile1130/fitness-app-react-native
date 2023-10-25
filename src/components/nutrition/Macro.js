import React, { PureComponent } from 'react';
import {
    Text,
    View
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { gray2 } from '../../styles/colors';
import { Spinner } from '../common/Spinner';
import { useNavigation } from '@react-navigation/native';
import NutritionService from '../../services/NutritionService';
import { CommonStyles } from '../../styles/CommonStyles';
import ComponentWithBackground from '../common/ComponentWithBackground';
import { Strings } from '../../config/Strings';
import TitleComponent from '../common/TitleComponent';
import CardsList from '../common/CardsList';

class Macro extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            macro: null
        };
    }

    componentDidMount() {
        this.loadMacro();
    }

    handleBack = () => {
        this.props.navigation.goBack();
    }

    loadMacro = () => {
        const macroId = this.props.route.params.id;

        NutritionService.macro(macroId)
        .then(data => {
            this.setState({
                macro: data.macro
            });
        }).catch();
    }

    formattedMacroDays = () => {
        return this.state.macro.data.map((item) => {
            let newItem = {};

            newItem.label = item.label;
            newItem.items = [this.renderItem(item)]

            return newItem;
        });
    }

    renderHeader = () => {
        return (
            <TitleComponent
                title={this.state.macro.title}
                handleBack={this.handleBack}
            />
        )
    }
    
    renderItem = (item) => {
        const {
            textBold,
            text16,
            text14,
            text13
        } = CommonStyles;

        return (
            <View style={styles.body}>
                <View style={styles.containerMacro}>
                    <Text style={text13}>{Strings.label_calories}</Text>
                    <Text style={[text16, textBold]}>{item.calories ?? '-'} kcal</Text>
                </View>
                <View style={styles.containerMacro}>
                    <Text style={text13}>{Strings.label_carbs}</Text>
                    <Text style={[text16, textBold]}>{item.carbs ?? '-'} g</Text>
                </View>
                <View style={styles.containerMacro}>
                    <Text style={text13}>{Strings.label_proteins}</Text>
                    <Text style={[text16, textBold]}>{item.proteins ?? '-'} g</Text>
                </View>
                <View style={styles.containerMacro}>
                    <Text style={text13}>{Strings.label_lipids}</Text>
                    <Text style={[text16, textBold]}>{item.lipids ?? '-'} g</Text>
                </View>
                {
                    item.note &&
                    <View style={styles.containerNote}>
                        <Text style={[text16, textBold]}>{Strings.label_notes}</Text>
                        <View style={styles.innerNote}>
                            <Text style={text13}>{item.note}</Text>
                        </View>
                    </View>
                }
            </View>
        );
    }

    renderContainer = () => {
        const {
            text16
        } = CommonStyles;

        return (
            <CardsList
                items={this.formattedMacroDays()}
                labelStyle={text16}
                itemStyle={styles.item}
                onRefresh={this.loadMacro}
            />
        )
    }

    render() {
        if(!this.state.macro) {
            return <Spinner />
        }

        return (
            <ComponentWithBackground safeAreaEnabled>
                {this.renderHeader()}
                {this.renderContainer()}
            </ComponentWithBackground>
        );
    }
}

const styles = ScaledSheet.create({
    body: {
        flex: 1,
        paddingVertical: '15@s'
    },
    containerMacro: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10@s'
    },
    containerNote: {
        marginTop: '5@s',
        paddingTop: '20@s',
        borderTopWidth: 1,
        borderTopColor: gray2
    },
    innerNote: {
        marginTop: '5@s',
        paddingTop: '10@s'
    },
    item: {
        paddingVertical: '13@s'
    }
});

export default function(props) {
    const navigation = useNavigation();
  
    return <Macro {...props} navigation={navigation} />;
};