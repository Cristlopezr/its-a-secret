import { Button } from '@/components/ui/button';
import { Field, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { SocketResponse } from '@/interfaces/socket.interface';
import { socket } from '@/lib/socket';
import { EnterNameViewSchema } from '@/schemas/enter-name-form.schema';
import { useGameActions, useGameRoom, useGameSinglePlayer } from '@/stores/game.store';
import { Scope, useUIActions, useUINotifications } from '@/stores/ui.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

export const EnterNameView = () => {
    const singlePlayer = useGameSinglePlayer();
    const { setSinglePlayer } = useGameActions();
    const room = useGameRoom();
    const admin = room.players.filter(player => player.role === 'Admin')[0];
    const { setNotification, clearNotifications } = useUIActions();
    const notifications = useUINotifications();
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof EnterNameViewSchema>>({
        resolver: zodResolver(EnterNameViewSchema),
        defaultValues: {
            username: '',
        },
    });

    useEffect(() => {
        clearNotifications();
    }, []);

    const onSubmit = (values: { username: string }) => {
        const { username } = values;
        setIsLoading(true);
        socket
            .timeout(5000)
            .emit('join-room', { code: room.code, username }, (err: { message: string }, response: SocketResponse) => {
                if (err) {
                    setNotification(Scope.EnterName, 'An error has occurred, please try again later.');
                } else {
                    if (!response.ok) {
                        setNotification(Scope.EnterName, response.message);
                    }
                }
                setIsLoading(false);
            });
        setSinglePlayer({
            ...singlePlayer!,
            username,
        });
    };

    return (
        <div className='flex flex-col items-center pt-20 text-center gap-10 px-4'>
            <h1 className='text-5xl font-extrabold mb-4 bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent'>
                It&apos;s a Secret!
            </h1>
            <div className='min-w-96 space-y-8 bg-secondary/20 p-8 rounded-2xl border border-violet-500/10'>
                <h2 className='text-2xl font-bold'>Enter your username</h2>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                    <Controller
                        control={form.control}
                        name='username'
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Input
                                    placeholder='Username'
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    {isLoading ? (
                        <Button disabled>
                            <span className='mr-4'>Loading...</span>
                            <LoaderCircle className='animate-spin' />
                        </Button>
                    ) : (
                        <>
                            <Button type='submit'>
                                {singlePlayer && singlePlayer.id === admin.id ? 'Create room' : 'Join room'}
                            </Button>
                            {notifications?.ENTER_NAME && (
                                <p className='text-destructive font-semibold'>{notifications.ENTER_NAME}</p>
                            )}
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};
