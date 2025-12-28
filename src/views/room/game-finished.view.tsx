import { PlayersList } from '@/components/room/players-list';
import { Button } from '@/components/ui/button';
import { audioUrls } from '@/lib/constants/audio-urls';
import { useAudioActions } from '@/stores/audio.store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const GameFinishedView = () => {
    const navigate = useNavigate();
    const { setCurrentMusicSrc } = useAudioActions();

    useEffect(() => {
        setCurrentMusicSrc(audioUrls.startEnd);
    }, []);

    return (
        <div className='flex flex-col items-center pt-40 gap-10'>
            <div className='text-2xl'>
                Final reveal! Players are ranked based on their hidden scores. Who guessed best?
            </div>
            <PlayersList sortedByScores />
            <Button onClick={() => navigate('/')}>Go to home</Button>
        </div>
    );
};
