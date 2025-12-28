import { Route, Routes } from 'react-router';
import { Home } from '../pages/home';
import { MainLayout } from '@/layouts/main-layout';
import { Room } from '../pages/room';

export const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path='room/:roomId' element={<Room />} />
            </Route>
        </Routes>
    );
};
