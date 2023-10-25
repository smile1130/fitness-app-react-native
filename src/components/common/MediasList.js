import React from 'react';
import {
    FlatList,
    View
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import MediaFile from '../media/MediaFile';
import CustomButtonIcon from './CustomButtonIcon';

const MediasList = (
    {
        medias,
        numColumns = 2,
        ListHeaderComponent,
        ListEmptyComponent,
        ListFooterComponent,
        refreshing = false,
        showIcon = false,
        aspectRatio = 1,
        handlePressIcon,
        onRefresh
    }) =>
{
    const renderFile = (item, index = 0, flexSize = 1) => {
        return (
            <View style={{ flex: flexSize }}>
                <MediaFile
                    fileUrl={item.file ? (item.file.file_url || item.file.uri) : item.file_url}
                    thumbUrl={item.file ? (item.file.thumb_url || null) : (item.thumb_url || null)}
                    fileName={item.filename}
                    fileType={item.type}
                    link={item.link ? item.link.link : null}
                    title={item.title || item.filename}
                    subtitle={item.dateFormatted}
                    showTexts={numColumns === 1}
                    aspectRatio={aspectRatio}
                />
                {
                    showIcon &&
                    <CustomButtonIcon
                        onPress={() => handlePressIcon(index)}
                        isAbsolute
                    />
                }
            </View>
        )
    }

    const renderItem = ({item, index}) => {
        const flexSize = 1 / numColumns;

        return renderFile(item, index, flexSize);
    }

    if (Array.isArray(medias)) {
        return (
            <FlatList
                data={medias}
                extraData={medias}
                renderItem={renderItem}
                numColumns={numColumns}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={styles.list}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListHeaderComponent={ListHeaderComponent}
                ListEmptyComponent={ListEmptyComponent}
                ListFooterComponent={ListFooterComponent}
            />
        );
    }

    return renderFile(medias)
}

const styles = ScaledSheet.create({
    list: {
        flexGrow: 1,
        paddingBottom: '50@s'
    }
});

export default MediasList;