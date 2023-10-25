import React, { PureComponent } from 'react';
import {
    FlatList,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

import ComponentWithBackground from '../../common/ComponentWithBackground';
import { gray2 } from '../../../styles/colors';
import { CommonStyles } from '../../../styles/CommonStyles';
import { Strings } from '../../../config/Strings';
import VisitService from '../../../services/VisitService';
import EmptySection from '../../common/EmptySection';
import { Spinner } from '../../common/Spinner';
import { useNavigation } from '@react-navigation/native';
import TitleComponent from '../../common/TitleComponent';

class VisitHistory extends PureComponent {
    constructor(props) {
        super(props);

        this.name = this.props.route.params.name;
        this.selectedResultId = null;

        this.state = {
            visit: null
        }
    }

    componentDidMount() {
        this.loadVisit();
    }

    handleBack = () => {
        this.props.navigation.goBack();
    }

    loadVisit = () => {
        VisitService.visit(this.name)
        .then(data => {
            let visit = data.visit;
            visit.values = visit.values.reverse();

            this.setState({
                visit: data.visit
            });
        }).catch(null);
    }

    renderEmptyValues = () => {
        return (
            <EmptySection text={Strings.strings_empty_visits} icon={'bar-chart-outline'} />
        )
    }

    renderValue = ({item, index}) => {
        const {
            text13,
            textBold
        } = CommonStyles;

        return (
            <View style={styles.value}>
                <View style={styles.containerValue}>
                    <Text style={[text13, textBold]}>{item.value} {this.state.visit.unit}</Text>
                </View>
                <View style={styles.containerDate}>
                    <Text>{item.dateFormatted}</Text>
                </View>
            </View>
        )
    }

    renderTitle = () => {
        return (
            <TitleComponent
                title={`${this.state.visit.name_label} (${this.state.visit.unit})`}
                handleBack={this.handleBack}
            />
        );
    }

    render() {
        if(!this.state.visit) {
            return <Spinner />
        }

        return (
            <ComponentWithBackground safeAreaEnabled>
                <FlatList
                    data={this.state.visit.values}
                    renderItem={this.renderValue}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={styles.list}
                    ListHeaderComponent={this.renderTitle}
                    ListEmptyComponent={this.renderEmptyValues}
                />
            </ComponentWithBackground>
        );
    }
}

const styles = ScaledSheet.create({
    containerTitle: {
        marginTop: '10@s',
        marginBottom: '30@s'
    },
    list: {
        flexGrow: 1,
        marginBottom: '20@s'
    },
    value: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: '20@s',
        marginHorizontal: '15@s',
        borderBottomWidth: 1,
        borderBottomColor: gray2
    },
    containerDate: {
        flex: 1
    },
    containerValue: {
        flex: 1
    }
});

export default function(props) {
    const navigation = useNavigation();
  
    return <VisitHistory {...props} navigation={navigation} />;
}