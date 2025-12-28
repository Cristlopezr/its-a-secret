import { socket } from '@/lib/socket';
import { useGameStore } from '@/stores/game.store';
import { useUiStore } from '@/stores/ui.store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { EnterCodeForm } from './enter-code-form';

export const JoinRoom = () => {
    const navigate = useNavigate();
    const setSinglePlayer = useGameStore(state => state.setSinglePlayer);
    const singlePlayer = useGameStore(state => state.singlePlayer);
    const setRoom = useGameStore(state => state.setRoom);
    const notifications = useUiStore(state => state.notifications);

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
            <p className='text-destructive font-semibold pt-2'>{notifications?.joinRoom}</p>
        </div>
    );
};
