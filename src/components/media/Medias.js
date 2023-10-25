import React, { PureComponent } from 'react';
import ComponentWithBackground from '../common/ComponentWithBackground';
import { ScaledSheet } from 'react-native-size-matters';
import EmptySection from '../common/EmptySection';
import { Strings } from '../../config/Strings';
import { Spinner } from '../common/Spinner';
import MediaService from '../../services/MediaService';
import CustomButton from '../common/CustomButton';
import TitleComponent from '../common/TitleComponent';
import MediasList from '../common/MediasList';

class Medias extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            medias: null,
            nextPage: null,
            disabledButton: false
        };
    }

    componentDidMount() {
        this.loadMedias();
    }

    handleBack = () => {
        this.props.navigation.goBack();
    }

    loadMedias = () => {
        const params = {
            conversationId: this.props.route.params.conversationId
        };

        MediaService.medias(params)
        .then(data => {
            this.setState({
                medias: data.medias,
                nextPage: data.next_page
            });
        }).catch(null);
    }

    attachMedias = (nextPage) => {
        this.setState({
            disabledButton: true
        });
        
        let params = {
            page: nextPage
        };

        MediaService.medias(params)
        .then(data => {
            this.setState({
                medias: [...this.state.medias, ...data.medias],
                nextPage: data.next_page,
                disabledButton: false
            });
        }).catch(null);
    }

    renderEmptyMedias = () => {
        return (
            <EmptySection text={Strings.strings_empty_media} icon={'images'} />
        )
    }

    renderTitle = () => {
        return (
            <TitleComponent
                title={Strings.label_medias_and_documents}
                handleBack={this.handleBack}
            />
        )
    }

    renderFooter = () => {
        if(!this.state.nextPage) {
            return null;
        }

        return (
            <CustomButton
                onPress={() => this.attachMedias(this.state.nextPage)}
                text={Strings.label_load_more}
                containerStyle={styles.loadMoreBtn}
                disabled={this.state.disabledButton}
            />
        )
    }

    render() {
        if(!this.state.medias) {
            return <Spinner />
        }

        return (
            <ComponentWithBackground safeAreaEnabled>
                <MediasList
                    medias={this.state.medias}
                    numColumns={3}
                    ListHeaderComponent={this.renderTitle}
                    ListEmptyComponent={this.renderEmptyMedias}
                    ListFooterComponent={this.renderFooter}
                    onRefresh={this.loadMedias}
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

export default Medias;