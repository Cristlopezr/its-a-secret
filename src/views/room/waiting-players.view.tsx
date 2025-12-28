import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { socket } from '@/lib/socket';
import { useGameRoom, useGameSinglePlayer } from '@/stores/game.store';
import { Check, Eye, EyeOff } from 'lucide-react';
import { PlayersList } from '../../components/room/players-list';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const WaitingPlayersView = () => {
    const room = useGameRoom();
    const singlePlayer = useGameSinglePlayer();
    const admin = room.players.filter(player => player.role === 'Admin')[0];

    const currentPlayers = room.players.filter(({ username }) => username !== undefined);

    const playersLeft = room.maxPlayers - currentPlayers.length;

    const onClickReveal = () => {
        socket.emit('reveal-secrets', { code: room.code });
    };

    const handleToggleScores = () => {
        socket.emit('toggle-scores-public', { code: room.code });
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
                <div className='flex flex-col items-center gap-4 bg-secondary/30 p-4 rounded-lg w-full max-w-2xl'>
                    <div className='flex items-center gap-4'>
                        <Switch
                            id='scores-public'
                            checked={room.scoresPublic}
                            onCheckedChange={handleToggleScores}
                        />
                        <Label htmlFor='scores-public' className='text-lg flex items-center gap-2 cursor-pointer'>
                            {room.scoresPublic ? <Eye className='w-5 h-5' /> : <EyeOff className='w-5 h-5' />}
                            Make scores public
                        </Label>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                        {room.scoresPublic
                            ? 'Scores in this room have been made public by the admin'
                            : 'Scores in this room are hidden'}
                    </p>
                </div>

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
            <div className='flex flex-col items-center gap-2 bg-secondary/20 p-4 rounded-lg w-full max-w-md'>
                <div className='flex items-center gap-2 text-lg font-medium'>
                    {room.scoresPublic ? <Eye className='w-5 h-5' /> : <EyeOff className='w-5 h-5' />}
                    {room.scoresPublic ? 'Public Scores' : 'Hidden Scores'}
                </div>
                <p className='text-sm text-center text-muted-foreground'>
                    {room.scoresPublic
                        ? 'Scores in this room have been made public by the admin'
                        : 'Scores in this room are hidden'}
                </p>
            </div>

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
