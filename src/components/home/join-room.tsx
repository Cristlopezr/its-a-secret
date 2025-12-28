import { socket } from '@/lib/socket';
import { useGameActions, useGameSinglePlayer } from '@/stores/game.store';
import { useUINotifications } from '@/stores/ui.store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { EnterCodeForm } from './enter-code-form';

export const JoinRoom = () => {
    const navigate = useNavigate();
    const { setSinglePlayer, setRoom } = useGameActions();
    const singlePlayer = useGameSinglePlayer();
    const notifications = useUINotifications();

    useEffect(() => {
        socket.on('correct-code', payload => {
            setSinglePlayer({
                ...singlePlayer,
                ...payload.player,
            });
            setRoom(payload.room);
            navigate(`/room/${payload.room.id}`);
        });

        return () => {
            socket.off('correct-code');
        };
    }, []);
    return (
        <div>
            <p className='mb-2'>Join a Room</p>
            <EnterCodeForm />
            {notifications?.JOIN_ROOM && (
                <p className='text-destructive font-semibold pt-2'>{notifications.JOIN_ROOM}</p>
            )}
        </div>
    );
};
