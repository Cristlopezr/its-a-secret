import { audioUrls } from '@/lib/constants/audio-urls';
import { create } from 'zustand';

interface AudioActions {
    setAudioRef: (audioRef: HTMLAudioElement | undefined) => void;
    setCurrentMusicSrc: (src: string) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    play: () => void;
}

interface AudioState {
    currentMusicSrc: string;
    audioRef: HTMLAudioElement | undefined;
    isPlaying: boolean;
    actions: AudioActions;
}

const useAudioStore = create<AudioState>()(set => ({
    currentMusicSrc: audioUrls.startEnd,
    audioRef: undefined,
    actions: {
        setAudioRef: audioRef => set(() => ({ audioRef })),
        setCurrentMusicSrc: src =>
            set(state => {
                if (state.audioRef) {
                    state.audioRef.pause();
                    /*  state.audioRef.current.src = src; */
                }
                return { currentMusicSrc: src };
            }),
        setIsPlaying: isPlaying =>
            set(state => {
                if (state.audioRef) {
                    if (state.isPlaying) {
                        state.audioRef.pause();
                    } else {
                        state.audioRef.play();
                    }
                }
                return {
                    isPlaying: isPlaying,
                };
            }),
        play: () =>
            set(state => {
                if (state.audioRef) {
                    state.audioRef.load();
                    state.audioRef.play();
                }
                return {
                    isPlaying: true,
                };
            }),
    },
    isPlaying: false,
}));

export const useAudioIsPlaying = () => useAudioStore(state => state.isPlaying);
export const useAudioActions = () => useAudioStore(state => state.actions);
export const useAudioCurrentMusicSrc = () => useAudioStore(state => state.currentMusicSrc);
export const useAudioAudioRef = () => useAudioStore(state => state.audioRef);
