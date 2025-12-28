import { useEffect } from 'react';
import { AppRouter } from './router/app-router';
import { socket } from './lib/socket';
import { useGameActions } from './stores/game.store';

function App() {
    const { setSessionState } = useGameActions();

    const initSession = async () => {
        try {
            await fetch(`${import.meta.env.VITE_PUBLIC_WSS_URL}/api/session`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!socket.connected) {
                socket.connect();
            }
            setSessionState('ready');
        } catch (error) {
            setSessionState('not-found');
        }
    };

    useEffect(() => {
        if (window.location.pathname !== '/') {
            window.location.replace('/');
        }
        initSession();
    }, []);

    return <AppRouter />;
}

export default App;
