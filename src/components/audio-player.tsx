import { cn } from '@/lib/utils';
import { useAudioActions, useAudioCurrentMusicSrc, useAudioIsPlaying } from '@/stores/audio.store';
import { Volume2, VolumeOff } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface Props {
    className?: string;
}

export const AudioPlayer = ({ className }: Props) => {
    const currentMusic = useAudioCurrentMusicSrc();
    const { setAudioRef, play, setIsPlaying } = useAudioActions();
    const isPlaying = useAudioIsPlaying();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            setAudioRef(audioRef.current);
        }
    }, []);

    useEffect(() => {
        if (isPlaying) {
            play();
        }
    }, [currentMusic]);

    const onSetIsPlaying = () => {
        setIsPlaying(!isPlaying);
    };
    return (
        <div>
            {!isPlaying && <VolumeOff className={cn(className)} onClick={onSetIsPlaying} />}
            {isPlaying && <Volume2 className={cn(className)} onClick={onSetIsPlaying} />}
            <audio className='invisible' ref={audioRef} src={currentMusic} loop autoPlay={false} />
        </div>
    );
};
