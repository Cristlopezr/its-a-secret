export interface SocketResponse {
    message: string;
    ok: boolean;
    type: 'room-not-found' | 'game-started';
}
