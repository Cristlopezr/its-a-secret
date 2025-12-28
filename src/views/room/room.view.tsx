import Loader from '@/components/ui/loader';
import { socket } from '@/lib/socket';
import { useGameActions, useGameSessionState, useGameSinglePlayer } from '@/stores/game.store';
import { useEffect, useState } from 'react';
import { EnterNameView } from './enter-name.view';
import { GameRoomView } from './game-room.view';

export const RoomView = () => {
    const [showRoomView, setShowRoomView] = useState(false);
    const sessionState = useGameSessionState();
    const { setRoom } = useGameActions();
    const singlePlayer = useGameSinglePlayer();

    //TODO:Checkear por los parametros si la room existe
    useEffect(() => {
        socket.on('joined-room', () => {
            setShowRoomView(true);
        });

        socket.on('update-users-in-room', payload => {
            setRoom(payload.room);
        });
        return () => {
            socket.off('joined-room');
            socket.off('update-users-in-room');
        };
    }, []);

    if (sessionState === 'checking') {
        return <Loader />;
    }

    if (!showRoomView && !singlePlayer?.username) {
        return <EnterNameView />;
    }

    return <GameRoomView />;
};
