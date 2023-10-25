import React, { useCallback, useState } from 'react';
import { View, FlatList } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';

import ComponentWithBackground from '../common/ComponentWithBackground';
import { Strings } from '../../config/Strings';
import EmptySection from '../common/EmptySection';
import HtmlCustom from '../common/HtmlCustom';
import TitleComponent from '../common/TitleComponent';
import CustomFilters from '../common/CustomFilters';
import { CommonStyles } from '../../styles/CommonStyles';

const Programs = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const programsInfo = route.params.programs;
    const [currentIndex, setCurrentIndex] = useState(0);

    const filters = [
        {
            key: 0,
            title: Strings.label_personal
        },
        {
            key: 1,
            title: Strings.label_program
        }
    ];

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const hasMessage = () => {
        return programsInfo.some(item => item.message);
    }

    const renderHeader = () => {
        return (
            <TitleComponent
                title={Strings.label_informations}
                handleBack={handleBack}
            />
        );
    };

    const renderEmpty = () => {
        return (
            <EmptySection text={Strings.strings_empty_programs} icon={'clipboard-outline'}  style={styles.info}/>
        );
    };

    const renderEmptyInfo = () => {
        return (
            <EmptySection text={Strings.strings_empty_info} icon={'clipboard-outline'}  style={styles.info}/>
        );
    };

    const renderProgram = ({item}) => {
        const {
            text14
        } = CommonStyles;

        const showPersonal = currentIndex === 0 && hasMessage();
        const html = showPersonal ? item.message : item.description;

        if(!html || html === '<p><br></p>') {
            return renderEmptyInfo();
        }

        return (
            <View style={styles.program}>
                <HtmlCustom html={html} baseFontStyle={{ ...text14 }} />
            </View>
        );
    };

    const renderFilters = () => {
        if (!hasMessage()) {
            return null;
        }

        return (
            <CustomFilters
                filters={filters}
                onPress={(selected) => setCurrentIndex(selected)}
                currentKey={currentIndex}
            />
        )
    }

    const renderContent = () => {
        return (
            <FlatList
                data={programsInfo}
                renderItem={renderProgram}
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.container}
            />
        )
    }

    return (
        <ComponentWithBackground safeAreaEnabled>
            {renderHeader()}
            {renderFilters()}
            {renderContent()}
        </ComponentWithBackground>
    );
};

const styles = ScaledSheet.create({
    container: {
        flexGrow: 1
    },
    labelName: {
        marginBottom: '10@s'
    },
    header: {
        marginBottom: '30@s',
        flexDirection: 'row',
        alignItems: 'center'
    },
    info: {
        marginTop: '30@s'
    },
    program: {
        flex: 1,
        marginHorizontal: '15@s',
        marginBottom: '40@s'
    }
});

export default Programs;
