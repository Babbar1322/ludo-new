import CutAudio from './CutAudio';
import DiceAudio from './DiceAudio';
import FinishAudio from './FinishAudio';
import LoseAudio from './LoseAudio';
import SafeAudio from './SafeAudio';
import WinAudio from './WinAudio';

export {CutAudio, DiceAudio, FinishAudio, LoseAudio, SafeAudio, WinAudio};
export default () => {
	return {CutAudio, DiceAudio, FinishAudio, LoseAudio, SafeAudio, WinAudio};
};
