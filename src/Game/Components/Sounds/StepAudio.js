import Sound from 'react-native-sound';

const StepAudio = new Sound('step.mp3', Sound.MAIN_BUNDLE, error => {
	if (error) {
		console.log('failed to load the sound', error);
		return;
	}
	// loaded successfully
	console.log('duration in seconds: ' + StepAudio.getDuration() + 'number of channels: ' + StepAudio.getNumberOfChannels());
});

export default StepAudio;
