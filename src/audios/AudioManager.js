import { AUDIO_ELEMENTS } from "./audios";

export const AudioManager = {
    audios: AUDIO_ELEMENTS,
    play: (audio) => {
        document.getElementById(audio).cloneNode().play();
    }
};