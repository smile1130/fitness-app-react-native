import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    FlatList,
    TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScaledSheet } from 'react-native-size-matters';

import SurveyService from '../../services/SurveyService';
import { Spinner } from '../common/Spinner';
import ComponentWithBackground from '../common/ComponentWithBackground';
import { mainColor, white, gray2 } from '../../styles/colors';
import EmptySection from '../common/EmptySection';
import { Strings } from '../../config/Strings';
import { CommonStyles } from '../../styles/CommonStyles';
import CustomRadioGroups from '../common/CustomRadioGroups';
import CustomButton from '../common/CustomButton';
import { showMessage } from 'react-native-flash-message';
import UploadMedias from '../common/UploadMedias';
import TitleComponent from '../common/TitleComponent';
import MediasList from '../common/MediasList';

const SurveyForm = ({
    route
}) => {
    const {
        answerId,
        type,
        id,
        notCompleted
    } = route.params;

    const navigation = useNavigation();
    const [surveys, setSurveys] = useState(null);
    const [survey, setSurvey] = useState(null);
    const [currentSurveyIndex, setCurrentSurveyIndex] = useState(null);
    const [loadingProgress, setLoadingProgress] = useState(false);
    
    useEffect(()=>{
        loadSurveys();
    },[])

    const handleBack = () => {
        navigation.goBack();
    }

    const goToHome = () => {
        navigation.navigate('Home');
    }

    const isDetail = () => {
        return answerId;
    }

    const isWelcome = () => {
        return type === 'WELCOME';
    }

    const loadAnswer = () => {
        SurveyService.loadAnswer(answerId)
            .then((data) => {
                setSurveys([data.survey]);
                setSurvey(data.survey);
                setCurrentSurveyIndex(0);
            });
    }

    const loadSurveys = () => {
        if (answerId) {
            loadAnswer();
            
            return;
        }

        let params = {};

        if (id) {
            params.id = id;
        }
        
        if (type) {
            params.type = type;
        }

        if (notCompleted) {
            params.notCompleted = 1;
        }

        SurveyService.surveys(params)
            .then((data) => {
                if(data.surveys.length === 0) {
                    goToHome();
                    return;
                }

                setSurveys(data.surveys);
                setSurvey(data.surveys[0]);
                setCurrentSurveyIndex(0);
            });
    }

    const renderEmptyQuestions = () => {
        return (
            <EmptySection text={Strings.strings_empty_questions} icon={'document-text-outline'} />
        )
    }

    const handleSubmit = () => {
        let errorMessage = null;

        survey.questions.forEach((obj) => {
            if (
                obj.required &&
                !obj.hasOwnProperty('answer') &&
                !obj.hasOwnProperty('files')
            ) {
                errorMessage = Strings.label_fill_in_the_required_answers;
                return; // Exit the loop early when the key is not present
            }
        });

        if (errorMessage) {
            showMessage({
                message: errorMessage,
                type: "danger"
            });

            return;
        }

        let data = {
            id: survey.id,
            questions: [],
            media: [],
            mediasIndex: []
        };

        survey.questions.forEach((obj, questionIndex) => {
            if (['files'].includes(obj.type)) {
                data.questions.push({
                    type: obj.type,
                    question: obj.question,
                    answers: obj.answers
                });

                if (obj.files) {
                    obj.files.forEach((file) => {
                        data.media.push(file.file);
                        data.mediasIndex.push({
                            questionIndex,
                            type: file.type
                        });
                    });
                }
            } else {
                data.questions.push({
                    type: obj.type,
                    question: obj.question,
                    answer: obj.answer,
                    answers: obj.answers
                })
            }
        });

        data.questions = JSON.stringify(data.questions); 
        data.mediasIndex = JSON.stringify(data.mediasIndex); 

        setLoadingProgress(true);

        SurveyService.submitSurvey(data)
        .then(() => {
            showMessage({
                message: Strings.label_survey_completed,
                type: "success",
            });

            if (currentSurveyIndex + 1 !== surveys.length) {
                setSurvey(surveys[currentSurveyIndex + 1]);
                setCurrentSurveyIndex(currentSurveyIndex + 1);
            } else {
                goToHome();
            }
        }).finally(() => {
            setLoadingProgress(false);
        });
    }

    const handleInputChange = (value, index) => {
        survey.questions[index].answer = value;
        survey.questions[index].completed = value !== null && value !== '';

        const updatedValues = { ...survey };

        setSurvey(updatedValues);
    };

    const handleFileChange = (value, index) => {
        if (!survey.questions[index].files) {
            survey.questions[index].files = [];
        }

        survey.questions[index].files.push(value);
        survey.questions[index].completed = true;

        const updatedValues = { ...survey };

        setSurvey(updatedValues);
    };

    const handleDeleteFile = (index, indexFile) => {
        survey.questions[index].files.splice(indexFile, 1);

        if (survey.questions[index].files.length === 0) {
            survey.questions[index].completed = false;
        }

        const updatedValues = { ...survey };

        setSurvey(updatedValues);
    }

    const renderText = (item, index) => {
        const {
            textInputBlack
        } = CommonStyles;

        return (
            <TextInput
                placeholder={isDetail() ? '-' : Strings.label_insert_value}
                value={item.answer}
                onChangeText={(text) => handleInputChange(text, index)}
                autoCapitalize='none'
                editable={!isDetail()}
                style={textInputBlack}
            />
        );
    }

    const renderMultiple = (item, index) => {
        let options = [];

        item.answers.forEach(item => {
            options.push({
                label: item.answer,
                value: item.answer
            })
        })

        let defaultSelected = null;

        if (item.answer) {
            defaultSelected = item.answers.findIndex(obj => obj.answer === item.answer);
        }

        return (
            <CustomRadioGroups
                options={options}
                handlePress={(value) => handleInputChange(value.value, index)}
                defaultSelected={defaultSelected}
                disabled={isDetail()}
            />
        )
    }

    const renderBoolean = (item, index) => {
        const options = [
            {
                label: Strings.label_yes,
                value: 1
            },
            {
                label: Strings.label_no,
                value: 0
            }
        ];

        let defaultSelected = null;

        if (item.hasOwnProperty('answer') && item.answer !== null) {
            defaultSelected = item.answer ? 0 : 1;
        }

        return (
            <CustomRadioGroups
                options={options}
                handlePress={(value) => handleInputChange(value.value, index)}
                defaultSelected={defaultSelected}
                disabled={isDetail()}
            />
        )
    }

    const renderUploadedFiles = (item, index) => {
        if (!item.files) {
            return null;
        }
        
        return (
            <MediasList
                medias={item.files}
                showIcon={!isDetail()}
                handlePressIcon={(indexFile) => handleDeleteFile(index, indexFile)}
            />
        )
    }

    const renderFile = (item, index) => {
        return (
            <View>
                {renderUploadedFiles(item, index)}
                {
                    !isDetail() &&
                    <UploadMedias
                        handleFileChange={(params) => handleFileChange(params, index)}
                        hideUploadingMessage
                    />
                }
            </View>
        )
    }

    const renderAnswer = (item, index) => {
        switch (item.type) {
            case 'text':
                return renderText(item, index);
            case 'multiple':
                return renderMultiple(item, index);
            case 'boolean':
                return renderBoolean(item, index);
            case 'files':
                return renderFile(item, index);
        }
    }

    const renderQuestion = ({ item, index }) => {
        const {
            text14,
            textBold,
            boxShadowLight,
            mainText
        } = CommonStyles;

        return (
            <View style={[styles.questionContainer, boxShadowLight]}>
                <Text style={[text14, textBold]}>
                    {item.question} <Text style={mainText}>{item.required ? '*' : null}</Text>
                </Text>
                <View style={styles.containerAnswer}>
                    {renderAnswer(item, index)}
                </View>
            </View>
        )
    }

    const renderHeader = () => {
        const {
            textBold,
            text18,
            mainText
        } = CommonStyles;

        return (
            <View>
                <TitleComponent
                    title={Strings.label_survey}
                    hideBack={isWelcome()}
                    handleBack={handleBack}
                />
                <View style={styles.containerHeader}>
                    <Text style={[text18, mainText, textBold]}>
                        {survey.title}
                    </Text>
                </View>
            </View>
        )
    }

    const renderLoadingBar = () => {
        const questionsCount = survey.questions.length;
        const completedCount = survey.questions.reduce((acc, obj) => {
            if (obj.completed) {
                return acc + 1;
            }
            return acc;
        }, 0);

        let width = (100 * completedCount / questionsCount);

        if (width == 0) {
            width = 1;
        }

        width += '%';

        return (
            <View style={styles.mainContainerLoadingBar}>
                <View style={[styles.loadingBar, { width }]} />
            </View>
        )
    }

    const renderSubmit = () => {
        return (
            <View style={styles.containerActions}>
                <CustomButton
                    onPress={handleSubmit}
                    text={Strings.label_send}
                    containerStyle={styles.submitBtn}
                    showSpinner={loadingProgress}
                    icon={'checkmark-outline'}
                    disabled={loadingProgress}
                />
                <CustomButton
                    onPress={handleBack}
                    secondaryButton
                    text={isWelcome() ? Strings.label_fill_in_later : Strings.label_undo}
                    containerStyle={styles.submitBtn}
                />
            </View>
        )
    }

    if (!survey) {
        return <Spinner />
    }

    return (
        <ComponentWithBackground safeAreaEnabled>
            <View style={styles.mainContainer}>
                <FlatList
                    data={survey.questions}
                    renderItem={renderQuestion}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={styles.list}
                    onRefresh={loadSurveys}
                    refreshing={!survey}
                    ListHeaderComponent={renderHeader}
                    ListEmptyComponent={renderEmptyQuestions}
                    ListFooterComponent={!isDetail() && renderSubmit}
                />
                {!isDetail() && renderLoadingBar()}
            </View>
        </ComponentWithBackground>
    )
}

const styles = ScaledSheet.create({
    mainContainer: {
        flex: 1
    },
    list: {
        flexGrow: 1,
        paddingBottom: '40@s'
    },
    containerHeader: {
        marginBottom: '10@s',
        marginHorizontal: '15@s'
    },
    questionContainer: {
        borderRadius: '15@s',
        marginTop: '15@s',
        backgroundColor: white,
        padding: '15@s',
        marginHorizontal: '15@s'
    },
    containerAnswer: {
        marginTop: '15@s'
    },
    mainContainerLoadingBar: {
        position: 'absolute',
        top: 0,
        backgroundColor: gray2,
        width: '100%',
        height: '3@s',
    },
    loadingBar: {
        height: '3@s',
        width: '50%',
        backgroundColor: mainColor,
        borderRadius: '5@s'
    },
    containerActions: {
        marginTop: '30@s'
    },
    submitBtn: {
        marginHorizontal: '15@s',
        marginBottom: '15@s'
    },
});

export default SurveyForm;