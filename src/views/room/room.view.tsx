import Loader from '@/components/ui/loader';
import { socket } from '@/lib/socket';
import { useGameActions, useGameRoom, useGameSinglePlayer } from '@/stores/game.store';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { EnterNameView } from './enter-name.view';
import { GameRoomView } from './game-room.view';

export const RoomView = () => {
    const [showRoomView, setShowRoomView] = useState(false);
    const [isCheking, setIsCheking] = useState(true);
    const { setRoom } = useGameActions();
    const room = useGameRoom();
    const singlePlayer = useGameSinglePlayer();
    const navigate = useNavigate();

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
        // Redirect if there's no player
        if (!singlePlayer || (room.status !== 'waitingPlayers' && room.status !== 'waitingSecrets')) {
            navigate('/');
        } else {
            setIsCheking(false);
        }
    }, [singlePlayer]);

    if (isCheking) {
        return <Loader />;
    }

    if (!showRoomView && !singlePlayer?.username) {
        return <EnterNameView />;
    }

    return <GameRoomView />;
};
