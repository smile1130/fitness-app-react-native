import React, { useEffect, useState } from 'react';
import {
    FlatList,
    TouchableOpacity,
    View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScaledSheet } from 'react-native-size-matters';

import SurveyService from '../../services/SurveyService';
import { Spinner } from '../common/Spinner';
import ComponentWithBackground from '../common/ComponentWithBackground';
import { applyOpacity, black, blue, gray3, green, mainColorLight, white } from '../../styles/colors';
import EmptySection from '../common/EmptySection';
import { Strings } from '../../config/Strings';
import TitleComponent from '../common/TitleComponent';
import CardWithIcon from '../common/CardWithIcon';
import CustomLabel from '../common/CustomLabel';
import CustomFilters from '../common/CustomFilters';

const Surveys = () => {
    const navigation = useNavigation();
    const [surveys, setSurveys] = useState(null);
    const [surveysCompleted, setSurveysCompleted] = useState(null);
    const [filter, setFilter] = useState('all');
    const [currentIndex, setCurrentIndex] = useState(0);
    const mainFilters = [
        {
            key: 0,
            title: Strings.label_to_complete
        },
        {
            key: 1,
            title: Strings.label_done
        }
    ];
    const filters = [
        {
            key: 'all',
            label: Strings.label_all,
            color: mainColorLight
        },
        {
            key: 'WELCOME',
            label: Strings.label_welcome,
            color: blue
        },
        {
            key: 'CHECK_IN',
            label: Strings.label_check_in,
            color: green
        }
    ];

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = () => {
        loadSurveys();
        loadCompletedSurveys();
    };

    const loadSurveys = () => {
        const params = {
            fromList: 1
        };

        SurveyService.surveys(params)
            .then((data) => {
                setSurveys(data.surveys);
            });
    };

    const loadCompletedSurveys = () => {
        SurveyService.completedSurveys()
            .then((data) => {
                setSurveysCompleted(data.surveys);
            });
    };

    const filteredSurveys = (items) => {
        return items.filter(survey => {
            if (filter === 'all') {
                return true;
            }

            return survey.type === filter;
        });
    }

    const handleBack = () => {
        navigation.goBack();
    };

    const goToSurvey = (id) => {
        navigation.navigate('SurveyForm', {
            id
        });
    };

    const goToCompletedSurvey = (answerId) => {
        navigation.navigate('SurveyForm', {
            answerId
        });
    }

    const renderEmptySurveys = () => {
        return (
            <EmptySection text={Strings.strings_empty_surveys} icon={'clipboard-outline'} />
        );
    };

    const renderSurvey = ({ item, index }) => {
        const labelColor = filters.find(filter => filter.key === item.type).color;

        return (
            <CardWithIcon
                title={item.title}
                icon={'reader-outline'}
                handlePress={() => currentIndex === 0 ? goToSurvey(item.id) : goToCompletedSurvey(item.id)}
                labelText={item.type_label}
                subtitle={item.date || null}
                labelColor={labelColor}
                labelBold={false}
            />
        );
    };

    const renderHeader = () => {
        return (
            <TitleComponent
                title={Strings.label_surveys}
                handleBack={handleBack}
            />
        );
    };

    const renderMainTab = () => {
        return (
            <CustomFilters
                filters={mainFilters}
                onPress={(selected) => setCurrentIndex(selected)}
                currentKey={currentIndex}
            />
        )
    };

    const renderFilter = ({item, index}) => {
        return (
            <TouchableOpacity
                onPress={() => setFilter(item.key)}
                activeOpacity={0.8}
                hitSlop={{
                    top: 10,
                    bottom: 10,
                    right: 10,
                    left: 10
                }}
            >
                <CustomLabel
                    text={item.label}
                    background={item.key === filter ? item.color : gray3}
                    textColor={item.key === filter ? applyOpacity(black, 0.7) : white}
                    boldText={false}
                    large
                />
            </TouchableOpacity>
        )
    }

    const renderFilters = () => {
        return (
            <FlatList
                data={filters}
                renderItem={renderFilter}
                keyExtractor={(_, index) => index.toString()}
                refreshing={false}
                contentContainerStyle={styles.filters}
                horizontal
            />
        );
    }

    const renderSurveys = () => {
        if (!surveys) {
            return <Spinner />;
        }

        return (
            <FlatList
                data={filteredSurveys(surveys)}
                renderItem={renderSurvey}
                keyExtractor={(_, index) => index.toString()}
                onRefresh={loadSurveys}
                refreshing={!surveys}
                contentContainerStyle={styles.list}
                ListHeaderComponent={renderTitle}
                ListEmptyComponent={renderEmptySurveys}
            />
        );
    };

    const renderCompleted = () => {
        if (!surveysCompleted) {
            return <Spinner />;
        }

        return (
            <FlatList
                data={filteredSurveys(surveysCompleted)}
                renderItem={renderSurvey}
                keyExtractor={(_, index) => index.toString()}
                onRefresh={loadCompletedSurveys}
                refreshing={!surveysCompleted}
                contentContainerStyle={styles.list}
                ListHeaderComponent={renderTitle}
                ListEmptyComponent={renderEmptySurveys}
            />
        );
    };

    renderTitle = () => {
        return (
            <View>
                {renderHeader()}
                {renderMainTab()}
                {renderFilters()}
            </View>
        )
    }

    renderContent = () => {
        return currentIndex === 0 ? renderSurveys() : renderCompleted();
    }

    return (
        <ComponentWithBackground safeAreaEnabled>
            {renderContent()}
        </ComponentWithBackground>
    );
};

const styles = ScaledSheet.create({
    list: {
        flexGrow: 1,
        paddingBottom: '80@s'
    },
    filters: {
        paddingHorizontal: '15@s',
        marginTop: '5@s',
        marginBottom: '30@s'
    }
});

export default Surveys;