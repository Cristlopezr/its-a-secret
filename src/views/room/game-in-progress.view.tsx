import { Button } from '@/components/ui/button';
import { audioUrls } from '@/lib/constants/audio-urls';
import { colorVariants, type ColorName } from '@/lib/constants/color-variants';
import { socket } from '@/lib/socket';
import { useAudioActions } from '@/stores/audio.store';
import { useGameActions, useGameRoom, useGameSinglePlayer } from '@/stores/game.store';
import { useEffect, useState } from 'react';

export const GameInProgressView = () => {
    const room = useGameRoom();
    const singlePlayer = useGameSinglePlayer();
    const { setRoom, setRoomStatus, setRoomCurrentSecretIdx } = useGameActions();

    const [timeToGuess, setTimeToGuess] = useState(15);
    const [timeToStartGame, setTimeToStartGame] = useState(5);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [infoText, setInfoText] = useState('Round starts in');
    const [selectedId, setSelectedId] = useState<string | null>(null);
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
        return <div className='text-6xl flex items-center justify-center min-h-screen'>Time is Up</div>;
    }

    if (timeToStartGame !== 0) {
        return (
            <div className='text-6xl flex items-center justify-center min-h-screen'>
                {infoText}: {timeToStartGame}
            </div>
        );
    }

    const onVote = (selectedId: string) => {
        setSelectedId(selectedId);
        if (selectedId === singlePlayer?.id) return;

        if (selectedId === room.secrets[room.currentSecretIdx].playerId) {
            socket.emit('user-voted', { endTime: Date.now(), code: room.code });
        }
    };

    return (
        <div className='container text-center mx-auto min-h-screen px-10'>
            <div className='text-4xl py-10'>&quot;{room.secrets[room.currentSecretIdx].secret}&quot;</div>
            <div className='font-semibold text-3xl'>{timeToGuess}</div>
            <div className='font-semibold text-3xl mt-10 mb-5'>Who wrote it?</div>
            {/* Hacer que el mensaje sea random */}
            <div className={`text-lg ${selectedId ? 'opacity-100' : 'opacity-0'}`}>
                Your answer&apos;s in! But who knows if you&apos;re onto something?
            </div>
            <div className='grid grid-cols-2 py-10 md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 place-items-center'>
                {room.players.map(({ id, username, color }) => (
                    <div
                        key={id}
                        className={`${
                            selectedId
                                ? 'rounded-md w-full min-h-[150px] md:h-[250px] p-[2px]'
                                : 'hover:border-2 hover:border-violet-500 rounded-md w-full min-h-[150px] md:h-[250px] p-[2px]'
                        }`}
                    >
                        <Button
                            disabled={!!selectedId}
                            onClick={() => onVote(id)}
                            className={`flex items-center h-full w-full justify-center font-semibold text-xl cursor-pointer ${
                                colorVariants[color as ColorName].bg
                            } ${selectedId && id !== selectedId ? 'disabled:opacity-50' : 'disabled:opacity-100'}`}
                        >
                            {username}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};
