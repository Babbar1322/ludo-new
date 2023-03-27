import Sound from 'react-native-sound';

const BgMusic = new Sound('bg.mp3', Sound.MAIN_BUNDLE, error => {
	if (error) {
		console.log('Error While Loading BG Music', error);
	}
	BgMusic.setNumberOfLoops(-1);
});

export default BgMusic;
