import { Button } from '@/components/ui/button';
import { audioUrls } from '@/lib/constants/audio-urls';
import { colorVariants, type ColorName } from '@/lib/constants/color-variants';
import { socket } from '@/lib/socket';
import { PlayersList } from '@/components/room/players-list';
import { EyeOff, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { icons, type IconName } from '@/lib/constants/icons';
import { useAudioActions } from '@/stores/audio.store';
import { useGameActions, useGameRoom, useGameSinglePlayer } from '@/stores/game.store';
import { useEffect, useState } from 'react';

const VOTING_MESSAGES = [
    "Your answer's in! But who knows if you're onto something?",
    "Locked and loaded. Ready for the reveal?",
    "Detective hats on! Let's see if you cracked it.",
    "Interesting choice... hiding something or just a hunch?",
    "A secret revealed soon! You feeling confident?",
    "Vote cast! Now we wait for the truth to come out.",
    "Suspiciously fast! Or is it just intuition?",
    "Bold move. Let's see if the others agree!",
    "The plot thickens... your vote is in!",
    "Secrets, secrets... will you be the master of truth today?"
];

export const GameInProgressView = () => {
    const room = useGameRoom();
    const singlePlayer = useGameSinglePlayer();
    const { setRoom, setRoomStatus, setRoomCurrentSecretIdx } = useGameActions();

    const [timeToGuess, setTimeToGuess] = useState(15);
    const [timeToStartGame, setTimeToStartGame] = useState(5);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [infoText, setInfoText] = useState('Round starts in');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [votedMessage, setVotedMessage] = useState('');
    const { setCurrentMusicSrc } = useAudioActions();

    useEffect(() => {
        socket.on('game-started', payload => {
            setRoom(payload.room);
            setIsTimeUp(false);
        });

        socket.on('delay-timer-update', payload => {
            setTimeToStartGame(payload.time);
        });

        socket.on('timer-update', payload => {
            setTimeToGuess(payload.time);
        });

        socket.on('time-is-up', payload => {
            setRoomStatus(payload.status);
            setRoomCurrentSecretIdx(payload.currentSecretIdx);
            setIsTimeUp(true);
        });

        socket.on('round-starts', () => {
            setCurrentMusicSrc(audioUrls.game);
        });

        socket.on('round-waiting', () => {
            setCurrentMusicSrc(audioUrls.roundStartsIn);
        });

        socket.on('timer-ended', () => {
            setIsTimeUp(false);
            setTimeToGuess(15);
            setSelectedId(null);
            setVotedMessage('');
            setInfoText('New round starts in');
            setTimeToStartGame(5);
        });

        return () => {
            socket.off('game-started');
            socket.off('delay-timer-update');
            socket.off('timer-update');
            socket.off('timer-ended');
            socket.off('time-is-up');
            socket.off('round-starts');
            socket.off('round-waiting');
        };
    }, []);

    if (isTimeUp) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen gap-10 px-4'>
                <h1 className='text-5xl font-extrabold mb-4 bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent'>
                    It&apos;s a Secret!
                </h1>
                <div className='text-6xl font-black italic'>Time is Up!</div>
            </div>
        );
    }

    if (timeToStartGame !== 0) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen gap-8 p-10'>
                <h1 className='text-5xl font-extrabold mb-4 bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent'>
                    It&apos;s a Secret!
                </h1>
                <div className='text-6xl font-bold'>
                    {infoText}: {timeToStartGame}
                </div>
                
                {room.scoresPublic ? (
                    <div className='w-full max-w-md bg-secondary/20 p-6 rounded-xl'>
                        <h2 className='text-2xl font-semibold mb-4'>Current Standings</h2>
                        <PlayersList sortedByScores />
                    </div>
                ) : (
                    <div className='flex flex-col items-center gap-2 text-muted-foreground'>
                        <EyeOff className='w-8 h-8' />
                        <p className='text-xl'>Scores are hidden in this room</p>
                    </div>
                )}
            </div>
        );
    }

    const onVote = (selectedId: string) => {
        setSelectedId(selectedId);
        const randomMessage = VOTING_MESSAGES[Math.floor(Math.random() * VOTING_MESSAGES.length)];
        setVotedMessage(randomMessage);
        
        if (selectedId === singlePlayer?.id) return;

        if (selectedId === room.secrets[room.currentSecretIdx].playerId) {
            socket.emit('user-voted', { endTime: Date.now(), code: room.code });
        }
    };

    return (
        <div className='flex flex-col items-center min-h-screen pt-10 pb-20 px-4 gap-8'>
             <h1 className='text-5xl font-extrabold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent'>
                It&apos;s a Secret!
            </h1>

            <div className='w-full max-w-3xl'>
                <Card className='bg-violet-500/10 border-violet-500/20 shadow-xl shadow-violet-500/5 overflow-hidden'>
                    <div className='bg-violet-500/10 py-4 px-6 border-b border-violet-500/20 flex justify-between items-center'>
                         <span className='text-sm font-bold uppercase tracking-widest text-violet-500'>The Secret Reveal</span>
                         <div className='flex items-center gap-2 bg-background/50 px-3 py-1 rounded-full border border-violet-500/20'>
                            <span className='w-2 h-2 rounded-full bg-violet-500 animate-pulse' />
                            <span className='text-lg font-black font-mono text-violet-500'>{timeToGuess}s</span>
                         </div>
                    </div>
                    <CardContent className='py-12 px-8 flex flex-col items-center gap-6'>
                         <p className='text-4xl font-serif italic text-foreground leading-tight text-center'>
                            &quot;{room.secrets[room.currentSecretIdx].secret}&quot;
                         </p>
                    </CardContent>
                </Card>
            </div>

            <div className='flex flex-col items-center gap-4 w-full max-w-4xl'>
                <div className='flex flex-col items-center gap-1'>
                    <h2 className='text-3xl font-black italic uppercase tracking-tighter'>Who wrote it?</h2>
                    <p className={`text-center text-md font-medium text-violet-500 transition-all duration-500 min-h-[1.5rem] ${selectedId ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                        {votedMessage}
                    </p>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full place-items-stretch py-4'>
                    {[...room.players]
                        .sort((a, b) => a.id.localeCompare(b.id))
                        .map(({ id, username, color, icon }) => (
                        <div key={id} className='relative group'>
                            <Button
                                disabled={!!selectedId}
                                onClick={() => onVote(id)}
                                className={`flex flex-col items-center gap-3 h-full w-full justify-center p-8 rounded-2xl transition-all duration-300 border-2 overflow-hidden ${
                                    selectedId === id 
                                        ? 'border-violet-500 bg-violet-500/20 scale-105 shadow-lg shadow-violet-500/20' 
                                        : selectedId 
                                            ? 'opacity-40 border-transparent bg-secondary/10'
                                            : 'border-transparent bg-secondary/20 hover:border-violet-500/50 hover:bg-secondary/30 hover:scale-105'
                                }`}
                            >
                                <div 
                                    className='p-4 rounded-full transition-transform duration-300 group-hover:rotate-12'
                                    style={{ backgroundColor: `${colorVariants[color as ColorName].color}20` }}
                                >
                                     {icons[icon as IconName]({ 
                                        color: colorVariants[color as ColorName].color,
                                        size: '48'
                                    })}
                                </div>
                                <span 
                                    className='font-bold text-xl'
                                    style={{ color: colorVariants[color as ColorName].color }}
                                >
                                    {username}
                                </span>
                                {selectedId === id && (
                                    <div className='absolute top-2 right-2'>
                                        <Check className='w-5 h-5 text-violet-500' />
                                    </div>
                                )}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
