import { useEffect } from 'react';
import { AppRouter } from './router/app-router';
import { socket } from './lib/socket';

function App() {
    const initSession = async () => {
        await fetch(`${import.meta.env.VITE_PUBLIC_WSS_URL}/api/session`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!socket.connected) {
            socket.connect();
        }
    };

    useEffect(() => {
        initSession();
    }, []);

    return <AppRouter />;
}

export default App;
