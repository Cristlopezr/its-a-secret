import { socket } from '@/lib/socket';
import { useGameActions, useGameRoom, useGameSinglePlayer } from '@/stores/game.store';
import { useEffect } from 'react';
import { WaitingPlayersView } from './waiting-players.view';
import { WaitingSecretsView } from './waiting-secrets.view';
import { GameInProgressView } from './game-in-progress.view';
import { GameFinishedView } from './game-finished.view';

export const GameRoomView = () => {
    const room = useGameRoom();
    const { setRoom, updatePlayerScore } = useGameActions();
    const singlePlayer = useGameSinglePlayer();
    const hasSubmittedSecret = room.secrets.find(({ playerId }) => playerId === singlePlayer?.id);

    useEffect(() => {
        socket.on('player-disconnected', payload => {
            setRoom(payload.room);
        });

        socket.on('waiting-secrets', payload => {
            setRoom(payload.room);
        });

        socket.on('secret-submitted', payload => {
            setRoom(payload.room);
        });

        socket.on('game-started', payload => {
            setRoom(payload.room);
        });

        socket.on('updated-points', payload => {
            updatePlayerScore(payload.playerId, payload.score);
        });

        return () => {
            socket.off('waiting-secrets');
            socket.off('secret-submitted');
            socket.off('game-started');
            socket.off('updated-points');
        };
    }, []);

    if (room.status === 'waitingPlayers') {
        return <WaitingPlayersView />;
    }

    //waitingSecrets status
    if (room.status === 'waitingSecrets') {
        return <WaitingSecretsView hasSubmittedSecret={!!hasSubmittedSecret} />;
    }

    if (room.status === 'started') {
        return <GameInProgressView />;
    }
    /* Mostrar los ganadores */
    return <GameFinishedView />;
};
