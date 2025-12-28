import { PlayersList } from '@/components/room/players-list';
import { Button } from '@/components/ui/button';
import { audioUrls } from '@/lib/constants/audio-urls';
import { useAudioActions } from '@/stores/audio.store';
import { useGameActions, useGameRoom } from '@/stores/game.store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const GameFinishedView = () => {
    const navigate = useNavigate();
    const room = useGameRoom();
    const { setCurrentMusicSrc } = useAudioActions();
    const { reset } = useGameActions();

    useEffect(() => {
        setCurrentMusicSrc(audioUrls.startEnd);
    }, []);

    const onGoHome = () => {
        reset();
        navigate('/');
    };

    return (
        <div className='flex flex-col items-center pt-20 pb-10 gap-10 px-8 text-center'>
            <h1 className='text-5xl font-extrabold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent'>
                It&apos;s a Secret!
            </h1>
            <div className='text-2xl max-w-2xl font-semibold'>
                {room.scoresPublic 
                    ? "Final reveal! Here are the rankings based on everyone's guesses. Who came out on top?"
                    : "Final reveal! The game has ended. Only the admin knows the true masters of secrets in this room!"}
            </div>
            <div className='w-full max-w-md bg-secondary/10 p-8 rounded-2xl border border-violet-500/10'>
                 <h3 className='text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6'>
                    Final Standings
                </h3>
                <PlayersList sortedByScores />
            </div>
            <Button onClick={onGoHome}>Go to home</Button>
        </div>
    );
};
