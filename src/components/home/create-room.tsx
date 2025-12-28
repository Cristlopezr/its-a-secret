import { socket } from '@/lib/socket';
import { useGameActions } from '@/stores/game.store';
import { Scope, useUIActions, useUINotifications } from '@/stores/ui.store';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { LoaderCircle } from 'lucide-react';

export const CreateRoom = () => {
    const navigate = useNavigate();
    const { setRoom, setSinglePlayer } = useGameActions();
    const [isLoading, setIsLoading] = useState(false);
    const { setNotification, clearNotifications } = useUIActions();
    const notifications = useUINotifications();

    useEffect(() => {
        socket.on('room-created', payload => {
            setSinglePlayer(payload.player);
            setRoom(payload.room);
            navigate(`/room/${payload.room.id}`);
        });

        return () => {
            socket.off('room-created');
        };
    }, []);

    const onCreateRoom = () => {
        setIsLoading(true);
        clearNotifications();
        //If response is a success whe go to another page, no need to handle success
        socket.timeout(5000).emit('create-room', (err: { message: string }) => {
            if (err) {
                setNotification(Scope.CreateRoom, 'An error has occurred, please try again later.');
                setIsLoading(false);
            }
        });
    };

    return (
        <div>
            <p className='mb-2'>Create a Room</p>
            <Button className='w-full' disabled={isLoading} onClick={onCreateRoom}>
                {isLoading ? (
                    <>
                        <span className='mr-4'>Loading...</span>
                        <LoaderCircle className='animate-spin' />
                    </>
                ) : (
                    'Create room'
                )}
            </Button>
            {notifications?.CREATE_ROOM && (
                <p className='text-destructive font-semibold pt-2'>{notifications.CREATE_ROOM}</p>
            )}
        </div>
    );
};
