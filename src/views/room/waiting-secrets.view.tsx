import { PlayersList } from '@/components/room/players-list';
import { SecretForm } from '@/components/room/secret-form';
import { Button } from '@/components/ui/button';
import { socket } from '@/lib/socket';
import { useGameRoom, useGameSinglePlayer } from '@/stores/game.store';

interface Props {
    hasSubmittedSecret: boolean;
}

import { CheckCircle2, ListChecks, LockKeyhole } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const WaitingSecretsView = ({ hasSubmittedSecret }: Props) => {
    const room = useGameRoom();
    const singlePlayer = useGameSinglePlayer();
    const admin = room.players.filter(player => player.role === 'Admin')[0];
    const secretsLeft = room.players.length - room.secrets.length;

    const onStartGame = () => {
        socket.emit('game-starts', { code: room.code });
    };

    return (
        <div className='flex flex-col items-center gap-10 min-h-screen pt-20 pb-10 px-4'>
            <h1 className='text-5xl font-extrabold mb-4 bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent'>
                It&apos;s a Secret!
            </h1>

            {hasSubmittedSecret ? (
                <div className='w-full max-w-2xl flex flex-col items-center gap-8'>
                    <Card className='w-full bg-green-500/10 border-green-500/20 shadow-lg shadow-green-500/5'>
                        <CardContent className='flex flex-col items-center gap-4 pt-6'>
                            <CheckCircle2 className='w-16 h-16 text-green-500 animate-in zoom-in duration-500' />
                            <div className='text-center'>
                                <h2 className='text-2xl font-bold text-green-500 mb-2'>Secret Locked In!</h2>
                                <p className='text-muted-foreground'>
                                    You have successfully submitted your secret. 
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {secretsLeft > 0 ? (
                        <div className='flex flex-col items-center gap-4 bg-secondary/30 p-8 rounded-2xl w-full'>
                            <div className='flex items-center gap-3 text-xl font-semibold animate-pulse text-violet-500'>
                                <ListChecks className='w-6 h-6' />
                                <span>Waiting for others...</span>
                            </div>
                            <p className='text-lg text-center'>
                                {secretsLeft === 1 
                                    ? "Just one more person left to reveal their secret!" 
                                    : `${secretsLeft} more players are still writing their secrets.`}
                            </p>
                            <div className='w-full max-w-xs bg-secondary h-2 rounded-full mt-2 overflow-hidden'>
                                <div 
                                    className='bg-violet-500 h-full transition-all duration-500 ease-out' 
                                    style={{ width: `${(room.secrets.length / room.players.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col items-center gap-4 bg-violet-500/10 border border-violet-500/20 p-8 rounded-2xl w-full text-center'>
                            <div className='text-2xl font-black text-violet-500 uppercase tracking-tighter'>
                                Everyone is Ready!
                            </div>
                            <p className='text-muted-foreground'>
                                {singlePlayer?.id === admin.id 
                                    ? "All secrets have been collected. You can now start the game." 
                                    : "Waiting for the admin to kick off the game. Get ready!"}
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className='w-full max-w-2xl flex flex-col items-center gap-8'>
                    <div className='flex flex-col items-center gap-2 text-center'>
                        <div className='bg-red-500/10 p-4 rounded-full mb-2'>
                            <LockKeyhole className='w-8 h-8 text-red-500' />
                        </div>
                        <h2 className='text-3xl font-black italic'>SHHH! IT&apos;S A SECRET</h2>
                        <p className='text-muted-foreground max-w-md'>
                            Write something about yourself that others might not know. 
                            Make it challenging to guess!
                        </p>
                    </div>
                    
                    <SecretForm />
                    
                    <div className='flex items-center gap-2 text-sm font-medium text-orange-500 bg-orange-500/10 py-2 px-4 rounded-full'>
                        Don&apos;t forget to hide your screen!
                    </div>
                </div>
            )}

            <div className='w-full max-w-md mt-4'>
                <h3 className='text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6'>
                    Status Check
                </h3>
                <PlayersList />
            </div>

            {singlePlayer && singlePlayer.id === admin.id && (
                <Button
                    onClick={onStartGame}
                    disabled={room.secrets.length !== room.players.length}
                    size="lg"
                    className='font-bold py-6 px-12 rounded-xl text-2xl shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 transition-all duration-300 mt-4'
                >
                    Start Game
                </Button>
            )}
        </div>
    );
};
