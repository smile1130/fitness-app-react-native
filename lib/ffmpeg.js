// lib/FFmpeg.js
import { FFmpegKit, FFmpegKitConfig, ReturnCode } from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';

class FFmpegWrapper {
	static async ensureTrimVideosFolder() {
		const trimVideosPath = `${RNFS.TemporaryDirectoryPath}/trimvideos`;
		try {
			if (!(await RNFS.exists(trimVideosPath))) {
				await RNFS.mkdir(trimVideosPath);
				console.log('Trim videos folder created.');
			}
		} catch (error) {
			console.error('Error ensuring trim videos folder:', error);
		}
	}

	static async clearTrimVideosFolder() {
		const trimVideosPath = `${RNFS.TemporaryDirectoryPath}/trimvideos`;
		try {
			if (await RNFS.exists(trimVideosPath)) {
				const files = await RNFS.readDir(trimVideosPath);
				for (const file of files) {
					await RNFS.unlink(file.path);
				}
				console.log('Trim videos folder cleared.');
			}
		} catch (error) {
			console.error('Error clearing trim videos folder:', error);
		}
	}


	static getFrames = async (
		localFileName,
		videoURI,
		duration,
		frameNumber,
		successCallback,
		errorCallback,
	) => {
		await this.ensureTrimVideosFolder();

		let outputImagePath = `${RNFS.TemporaryDirectoryPath}/trimvideos/${localFileName}_%4d.png`;

		let frame_per_second = Math.max(duration / (frameNumber - 1));

		const ffmpegCommand = `-ss 0 -i ${videoURI} -vf "fps=1/${frame_per_second}:round=up,scale=426:-1" ${outputImagePath}`;

		try {
			FFmpegKit.executeAsync(
				ffmpegCommand,
				async session => {
					try {
						console.log('Execution Session started');
						const returnCode = await session.getReturnCode();

						console.log(returnCode);
						if (ReturnCode.isSuccess(returnCode)) {
							console.log(`Check at ${outputImagePath}`);
							successCallback(outputImagePath);
						} else {
							const state = FFmpegKitConfig.sessionStateToString(
								await session.getState(),
							);
							const failStackTrace = await session.getFailStackTrace();
							console.log('Encode failed. Please check log for the details.');
							console.log(
								`Encode failed with state ${state} and rc ${returnCode}. StackTrace: ${failStackTrace}, '\\n'`,
							);
							errorCallback();
						}
					} catch (err) {
						console.error(
							'An error occurred during the execution session: ' + err.message,
						);
					}
				},
				log => {
					console.log('FFmpeg Kit Log: ' + log.getMessage());
				},
				statistics => {
					console.log('FFmpeg Kit Statistics: ', statistics);
				},
			)
				.then(session =>
					console.log(
						`Async FFmpeg process started with sessionId ${session.getSessionId()}.`,
					),
				)
				.catch(error =>
					console.error('FFmpegKit ExecuteAsync error: ' + error.message),
				);
		} catch (error) {
			console.error(
				'An error occurred when trying to start execution: ' + error.message,
			);
		}
	}

	static trimVideo = async (inputPath, startSecond, endSecond, isMuted) => {
		await this.ensureTrimVideosFolder();

		return new Promise((resolve, reject) => {
			let outputPath = `${RNFS.TemporaryDirectoryPath}/trimvideos/output.mp4`;
			//let command = `-ss ${startSecond} -i ${inputPath} -to ${endSecond} -c:v mpeg4 -b:v 10M -vf "scale=1280:720" -y ${outputPath}`;
			let command = '';
			if (isMuted) {
				command = `-ss ${startSecond} -i ${inputPath} -to ${endSecond} -an -c:v libx264 -b:v 600k -y ${outputPath}`;
			} else {
				command = `-ss ${startSecond} -i ${inputPath} -to ${endSecond} -c:v libx264 -b:v 600k -y ${outputPath}`;
			}

			console.log(`Command: ${command}`);

			FFmpegKit.execute(command)
				.then(async session => {
					const returnCode = await session.getReturnCode();

					if (ReturnCode.isSuccess(returnCode)) {
						console.log('Trim process completed successfully.');
						RNFS.stat(outputPath)
							.then(statResult => {
								let fileSizeInBytes = statResult.size;
								console.log(`File size: ${fileSizeInBytes} bytes`);

								resolve({
									localPath: outputPath,
									mime: 'video/mp4',
									size: fileSizeInBytes, // Assign the size of the video file to 'size'
								});
							})
							.catch(err => {
								console.log('Error while getting file size:', err);
								reject('Error while getting file size.');
							});
					} else if (ReturnCode.isCancel(returnCode)) {
						console.log('Trim process cancelled.');
						reject('Trim process cancelled.');
					} else {
						console.log('Trim process failed with state and return code.');
						reject('Trim process failed.');
					}
				})
				.catch(error => {
					console.log(`An error occurred during the trim process: ${error}`);
					reject('An error occurred during the trim process.');
				});
		});
	};
}

export default FFmpegWrapper;
