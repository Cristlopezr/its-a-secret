import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { socket } from '@/lib/socket';
import { useGameRoom, useGameSinglePlayer } from '@/stores/game.store';
import { Check } from 'lucide-react';
import { PlayersList } from '../../components/room/players-list';

export const WaitingPlayersView = () => {
    const room = useGameRoom();
    const singlePlayer = useGameSinglePlayer();
    const admin = room.players.filter(player => player.role === 'Admin')[0];

    const currentPlayers = room.players.filter(({ username }) => username !== undefined);

    const playersLeft = room.maxPlayers - currentPlayers.length;

    const onClickReveal = () => {
        socket.emit('reveal-secrets', { code: room.code });
    };

    if (singlePlayer && singlePlayer.id === admin.id) {
        return (
            <div className='flex flex-col items-center gap-10 min-h-screen pt-20'>
                <h1 className='text-4xl font-bold mb-8'>It&apos;s a Secret!</h1>
                <Card className='w-full max-w-2xl bg-background'>
                    <CardHeader>
                        <CardTitle className='text-2xl'>Room Code: {room.code}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-base mb-2'>
                            Invite at least 3 friends to join the fun! Share this room code with them.
                        </p>
                        <p className='text-base'>
                            Once you&apos;re all set and ready to reveal your secrets, click the button below to get
                            started!
                        </p>
                    </CardContent>
                </Card>
                <div className='flex items-center gap-2 mt-5'>
                    {currentPlayers.length < room.maxPlayers ? (
                        <div className='animate-pulse text-lg flex items-center gap-2'>
                            {playersLeft !== 1 ? (
                                <div>Waiting for {playersLeft} more players to join...</div>
                            ) : (
                                <div>Waiting for {playersLeft} more player to join...</div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div>You can wait for more players to join or start playing now.</div>
                            <Check />
                        </>
                    )}
                </div>
                <Button
                    onClick={onClickReveal}
                    disabled={room.players.length < room.maxPlayers}
                    className='font-semibold py-2 px-6 rounded text-lg my-6 transition-all duration-200'
                >
                    Reveal Your Secrets
                </Button>

                <PlayersList />
            </div>
        );
    }
    return (
        <div className='flex flex-col items-center gap-10 justify-center min-h-screen p-8'>
            <PlayersList />
            <div className='flex items-center gap-2 mt-5'>
                {currentPlayers.length < room.maxPlayers ? (
                    <div className='animate-pulse text-lg flex items-center gap-2'>
                        <div>Waiting for {playersLeft} more players to join...</div>
                    </div>
                ) : (
                    <>
                        <div>You can wait for more players to join or start playing now.</div>
                        <Check />
                    </>
                )}
            </div>
        </div>
    );
};
