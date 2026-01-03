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

    return (
        <div className='flex flex-col min-h-screen pt-16 pb-10 px-8'>
            <h1 className='text-5xl font-extrabold mb-10 bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent text-center'>
                It&apos;s a Secret!
            </h1>
            
            <div className='flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto'>
                {/* Left Column - Main Content */}
                <div className='flex-1 flex flex-col gap-6'>
                    <Card className='bg-background/50 backdrop-blur-sm border-violet-500/20'>
                        <CardHeader>
                            <CardTitle className='text-3xl text-center flex items-center justify-center gap-3 font-black'>
                                Room Code: <span className='text-violet-500 tracking-widest'>{room.code}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='text-center space-y-6'>
                            <p className='text-lg'>
                                Invite at least 3 friends to join the fun! Share this room code with them.
                            </p>
                            {singlePlayer?.id === admin.id ? (
                                <p className='text-base text-muted-foreground italic'>
                                    Once you&apos;re all set and ready to reveal your secrets, click the button below to get
                                    started!
                                </p>
                            ) : (
                                <p className='text-base text-muted-foreground italic'>
                                    Waiting for the admin to start the secret reveal phase...
                                </p>
                            )}
                            
                            {/* Status & Button integrated into the card */}
                            <div className='flex flex-col items-center gap-4 pt-4 border-t border-violet-500/10'>
                                <div className='flex items-center gap-3'>
                                    {currentPlayers.length < room.maxPlayers ? (
                                        <div className='animate-pulse text-xl font-semibold flex items-center gap-3 text-violet-500'>
                                            <div className='w-2 h-2 rounded-full bg-violet-500' />
                                            {playersLeft !== 1 ? (
                                                <div>Waiting for {playersLeft} more players...</div>
                                            ) : (
                                                <div>Waiting for {playersLeft} more player...</div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className='flex items-center gap-2 text-xl font-bold text-green-500'>
                                            <Check className='w-6 h-6' />
                                            <div>Ready to start!</div>
                                        </div>
                                    )}
                                </div>

                                {singlePlayer?.id === admin.id && (
                                    <Button
                                        onClick={onClickReveal}
                                        disabled={room.players.length < room.maxPlayers}
                                        size="lg"
                                        className='font-bold py-6 px-10 rounded-xl text-xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all duration-300'
                                    >
                                        Reveal Your Secrets
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className={`flex flex-col items-center gap-4 p-6 rounded-2xl transition-all duration-300 ${
                        singlePlayer?.id === admin.id ? 'bg-secondary/40 border border-violet-500/10' : 'bg-secondary/20'
                    }`}>
                        {singlePlayer?.id === admin.id ? (
                            <>
                                <div className='flex items-center gap-4'>
                                    <Switch
                                        id='scores-public'
                                        checked={room.scoresPublic}
                                        onCheckedChange={handleToggleScores}
                                    />
                                    <Label htmlFor='scores-public' className='text-xl flex items-center gap-2 cursor-pointer font-bold'>
                                        {room.scoresPublic ? <Eye className='w-6 h-6' /> : <EyeOff className='w-6 h-6' />}
                                        Make scores public
                                    </Label>
                                </div>
                                <p className='text-sm text-muted-foreground font-medium'>
                                    {room.scoresPublic
                                        ? 'Scores in this room have been made public by you'
                                        : 'Scores in this room are currently hidden'}
                                </p>
                            </>
                        ) : (
                            <div className='flex flex-col items-center gap-2'>
                                <div className='flex items-center gap-2 text-xl font-bold'>
                                    {room.scoresPublic ? <Eye className='w-6 h-6 text-violet-500' /> : <EyeOff className='w-6 h-6 text-muted-foreground' />}
                                    {room.scoresPublic ? 'Public Scores Enabled' : 'Scores are Hidden'}
                                </div>
                                <p className='text-sm text-center text-muted-foreground font-medium'>
                                    {room.scoresPublic
                                        ? 'The admin has made scores public for this game'
                                        : 'The scoring for this game will remain private'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Players List */}
                <div className='lg:w-80 flex flex-col'>
                    <h3 className='text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6'>
                        Connected Players ({currentPlayers.length})
                    </h3>
                    <PlayersList />
                </div>
            </div>
        </div>
    );
};
