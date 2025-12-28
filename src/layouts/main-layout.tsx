import { AudioPlayer } from '@/components/audio-player';
import { Outlet } from 'react-router';

export const MainLayout = () => {
    return (
        <>
            <AudioPlayer className='absolute right-10 top-10 xl:right-32' />
            <Outlet />
        </>
    );
};
