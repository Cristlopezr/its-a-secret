import { colorVariants, type ColorName } from '@/lib/constants/color-variants';
import { icons, type IconName } from '@/lib/constants/icons';
import { useGameRoom } from '@/stores/game.store';

interface Props {
    sortedByScores?: boolean;
}

export const PlayersList = ({ sortedByScores }: Props) => {
    const room = useGameRoom();
    const showScores = room.scoresPublic && (room.status === 'started' || room.status === 'finished');
    const players = sortedByScores ? [...room.players].sort((a, b) => b.score - a.score) : room.players;

    return (
        <ul className='flex flex-col gap-4 w-full'>
            {players.map(({ id, username, icon, color, score }) => {
                if (username === undefined) return null;

                return (
                    <li
                        key={id}
                        className={`flex items-center gap-4 p-4 rounded-2xl border border-violet-500/10 bg-secondary/10 w-full transition-all duration-300 hover:bg-secondary/20 ${
                            showScores ? 'justify-between' : 'justify-center'
                        }`}
                    >
                        <div className={`flex items-center gap-4 ${showScores ? '' : 'flex-1 justify-center ml-10'}`}>
                            {icons[icon as IconName]({ 
                                color: colorVariants[color as ColorName].color,
                                size: '32'
                            })}
                            <p
                                className='font-bold text-2xl'
                                style={{ color: colorVariants[color as ColorName].color }}
                            >
                                {username}
                            </p>
                        </div>
                        {showScores && (
                            <p className='font-black text-3xl text-violet-500'>
                                {score}
                            </p>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};
