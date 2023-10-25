import React, { useState } from 'react';
import { Video } from 'react-native-compressor';
import ImagePicker from 'react-native-image-crop-picker';
import { Strings } from '../../config/Strings';
import {
	errorImagePicker,
	getFileNameFromUrl,
	isAndroid,
} from '../../config/Util';
import PopupMenu from './PopupMenu';
import DocumentPicker from 'react-native-document-picker';
import { showMessage } from 'react-native-flash-message';
import { mainColor, white } from '../../styles/colors';
import { CommonStyles } from '../../styles/CommonStyles';
import { Spinner } from './Spinner';
import { ScaledSheet } from 'react-native-size-matters';
import VideoTrimmer from '../../components/media/VideoTrimmer';
import { Modal, Platform } from 'react-native';

const UploadMedias = ({
	handleFileChange,
	showLabel = true,
	icon = 'add-outline',
	hideUploadingMessage = false,
	hideDocument = false,
	hideLibrary = false,
	hideCamera = false,
	mediaType = 'any', // 'photo' 'video' 'any'
}) => {
	const [isOpenVideoTrimmer, setIsOpenVideoTrimmer] = useState(false);
	const [videoData, setVideoData] = useState();

	const showFlashMessage = () => {
		if (hideUploadingMessage) {
			return;
		}

		showMessage({
			message: Strings.label_loading,
			autoHide: false,
			hideOnPress: false,
			backgroundColor: mainColor,
			titleStyle: CommonStyles.textBold,
			icon: () => (
				<Spinner size={'small'} colorSpin={white} style={styles.spinner} />
			),
		});
	};

	const handleAttach = async () => {
		const res = await DocumentPicker.pick({
			type: [DocumentPicker.types.allFiles],
		});

		showFlashMessage();

		const params = {
			type: 'other',
			filename: res.name,
			mime_type: res.type,
			file: {
				uri: res.uri,
				filename: res.name,
				name: res.name,
				type: res.type,
			},
		};

		handleFileChange(params);
	};

	const handleLibrary = () => {
		console.log("document")
		ImagePicker.openPicker({
			mediaType,
			includeBase64: false,
			compressVideoPreset: '960x540',
			compressImageQuality: isAndroid ? 0.8 : 0.4,
			compressImageMaxWidth: 1400,
			compressImageMaxHeight: 1400,
		})
			.then(data => handleMedia(data))
			.catch(error => {
				errorImagePicker(error.code);
			});
	};

	const handleCamera = () => {
		ImagePicker.openCamera({
			mediaType,
			includeBase64: false,
			compressImageQuality: isAndroid ? 0.8 : 0.4,
			compressImageMaxWidth: 1400,
			compressImageMaxHeight: 1400,
		})
			.then(data => handleMedia(data))
			.catch(error => {
				errorImagePicker(error.code);
			});
	};

	const handleMedia = async data => {
		console.log(data);
		const isImage = data.mime.includes('image');

		if (isImage) {
			showFlashMessage();

			const filename = data.filename || getFileNameFromUrl(data.path);

			const params = {
				type: 'image',
				filename,
				mime_type: data.mime,
				file: {
					uri: data.path,
					filename,
					name: filename,
					type: data.mime,
				},
			};

			handleFileChange(params);
		} else {
			console.log('handlemedia');
			setVideoData(data);
			setIsOpenVideoTrimmer(true);
		}
	};

	const handleVideo = async data => {
		// showFlashMessage();
		const filename = getFileNameFromUrl(data.localPath);
		const params = {
			type: 'video',
			filename,
			mime_type: data.mime,
			size: data.size,
			file: {
				uri: data.localPath,
				filename,
				name: filename,
				type: data.mime,
			},
		};
		handleFileChange(params);
	};

	const handlePressPopupMenu = value => {
		switch (value) {
			case 'document':
				return handleAttach();
			case 'library':
				return handleLibrary();
			case 'camera':
				return handleCamera();
		}
	};

	let options = [];

	if (!hideDocument) {
		options.push({
			key: 'document',
			icon: 'document-outline',
			text: Strings.label_document,
		});
	}

	if (!hideLibrary) {
		options.push({
			key: 'library',
			icon: 'image-outline',
			text: Strings.label_gallery_and_video,
		});
	}

	if (!hideCamera) {
		options.push({
			key: 'camera',
			icon: 'camera-outline',
			text: Strings.label_camera,
		});
	}

	return (
		<>
			{!isOpenVideoTrimmer ? (
				<PopupMenu
					options={options}
					showLabel={showLabel}
					icon={icon}
					handlePress={value => handlePressPopupMenu(value)}
				/>
			) : (
				<Modal style={{ flex: 1, zIndex: 231465 }}>
					<VideoTrimmer
						source={videoData}
						handleVideo={handleVideo}
						setIsOpenVideoTrimmer={setIsOpenVideoTrimmer}
						showFlashMessage={showFlashMessage}
					/>
				</Modal>
			)}
		</>
	);
};

const styles = ScaledSheet.create({
	spinner: {
		width: '20@s',
		height: '20@s',
		marginRight: '10@s',
		marginTop: -2,
		flex: 0,
	},
});

export default UploadMedias;