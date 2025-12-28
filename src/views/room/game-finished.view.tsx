import { PlayersList } from '@/components/room/players-list';
import { Button } from '@/components/ui/button';
import { audioUrls } from '@/lib/constants/audio-urls';
import { useAudioActions } from '@/stores/audio.store';
import { useGameRoom } from '@/stores/game.store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const GameFinishedView = () => {
    const navigate = useNavigate();
    const room = useGameRoom();
    const { setCurrentMusicSrc } = useAudioActions();

    useEffect(() => {
        setCurrentMusicSrc(audioUrls.startEnd);
    }, []);

    return (
        <div className='flex flex-col items-center pt-40 gap-10 px-8 text-center'>
            <div className='text-2xl max-w-2xl'>
                {room.scoresPublic 
                    ? "Final reveal! Here are the rankings based on everyone's guesses. Who came out on top?"
                    : "Final reveal! The game has ended. Only the admin knows the true masters of secrets in this room!"}
            </div>
            <div className='w-full max-w-md'>
                <PlayersList sortedByScores />
            </div>
            <Button onClick={() => navigate('/')}>Go to home</Button>
        </div>
    );
};
