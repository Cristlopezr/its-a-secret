import Loader from '@/components/ui/loader';
import { socket } from '@/lib/socket';
import { useGameActions, useGameSessionState, useGameRoom, useGameSinglePlayer } from '@/stores/game.store';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { EnterNameView } from './enter-name.view';
import { GameRoomView } from './game-room.view';

export const RoomView = () => {
    const [showRoomView, setShowRoomView] = useState(false);
    const sessionState = useGameSessionState();
    const { setRoom } = useGameActions();
    const room = useGameRoom();
    const singlePlayer = useGameSinglePlayer();
    const navigate = useNavigate();
    const shouldNavigate = useRef(false);

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

    useEffect(() => {
        if (shouldNavigate.current) {
            navigate('/');
        }
    }, [shouldNavigate.current]);

    if (sessionState === 'checking') {
        return <Loader />;
    }

    if (!singlePlayer || (room.status !== 'waitingPlayers' && room.status !== 'waitingSecrets')) {
        shouldNavigate.current = true;
        return null;
    }

    if (!showRoomView && !singlePlayer?.username) {
        return <EnterNameView />;
    }

    return <GameRoomView />;
};
