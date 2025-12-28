import { colorVariants, type ColorName } from '@/lib/constants/color-variants';
import { icons, type IconName } from '@/lib/constants/icons';
import { useGameRoom } from '@/stores/game.store';

interface Props {
    sortedByScores?: boolean;
}

export const PlayersList = ({ sortedByScores }: Props) => {
    const room = useGameRoom();
    return (
        <ul className='flex flex-col gap-5'>
            {sortedByScores
                ? room.players
                      .sort((a, b) => b.score - a.score)
                      .map(({ id, username, icon, color, score }) => {
                          if (username === undefined) return null;
                          return (
                              <li key={id} className='flex items-center gap-3 w-full justify-between'>
                                  <div className='flex items-center gap-3'>
                                      {icons[icon as IconName]({ color: colorVariants[color as ColorName].color })}
                                      <p
                                          className='font-semibold text-xl'
                                          style={{ color: colorVariants[color as ColorName].color }}
                                      >
                                          {username}
                                      </p>
                                  </div>
                                  {room.scoresPublic && (room.status === 'started' || room.status === 'finished') && (
                                      <p className='font-bold text-2xl ml-auto'>{score}</p>
                                  )}
                              </li>
                          );
                      })
                : room.players.map(({ id, username, icon, color, score }) => {
                      if (username === undefined) return null;

                      return (
                          <li key={id} className='flex items-center gap-3 w-full justify-between'>
                              <div className='flex items-center gap-3'>
                                  {icons[icon as IconName]({ color: colorVariants[color as ColorName].color })}
                                  <p
                                      className='font-semibold text-xl'
                                      style={{ color: colorVariants[color as ColorName].color }}
                                  >
                                      {username}
                                  </p>
                              </div>
                              {room.scoresPublic && (room.status === 'started' || room.status === 'finished') && (
                                  <p className='font-bold text-2xl ml-auto'>{score}</p>
                              )}
                          </li>
                      );
                  })}
        </ul>
    );
};
