import type { Player } from '@/interfaces/player.interface';
import type { Room } from '@/interfaces/room.interface';
import { create } from 'zustand';

type SessionState = 'checking' | 'not-found' | 'ready';

interface GameActions {
    setSinglePlayer: (player: Player) => void;
    setRoom: (room: Room) => void;
    updatePlayerScore: (playerId: string, score: number) => void;
    setRoomStatus: (status: Room['status']) => void;
    setRoomCurrentSecretIdx: (currentSecretIdx: number) => void;
    setSessionState: (sessionState: SessionState) => void;
    reset: () => void;
}

interface GameState {
    sessionState: SessionState;
    singlePlayer: Player | undefined;
    room: Room;
    actions: GameActions;
}

const useGameStore = create<GameState>()(set => ({
    sessionState: 'checking',
    singlePlayer: undefined,
    room: {
        code: '',
        id: '',
        status: 'waitingPlayers',
        secrets: [],
        players: [],
        config: [],
        maxPlayers: 0,
        currentSecretIdx: 0,
        scoresPublic: false,
    },
    actions: {
        setSinglePlayer: player => set(() => ({ singlePlayer: player })),
        setRoom: room => set(() => ({ room })),
        updatePlayerScore: (playerId, score) =>
            set(state => ({
                room: {
                    ...state.room,
                    players: state.room.players.map(p =>
                        p.id === playerId ? { ...p, score } : p
                    ),
                },
            })),
        setRoomStatus: status =>
            set(state => ({
                room: {
                    ...state.room,
                    status,
                },
            })),
        setRoomCurrentSecretIdx: currentSecretIdx =>
            set(state => ({
                room: {
                    ...state.room,
                    currentSecretIdx,
                },
            })),
        setSessionState: sessionState => set(() => ({ sessionState: sessionState })),
        reset: () =>
            set(() => ({
                singlePlayer: undefined,
                room: {
                    code: '',
                    id: '',
                    status: 'waitingPlayers',
                    secrets: [],
                    players: [],
                    config: [],
                    maxPlayers: 0,
                    currentSecretIdx: 0,
                    scoresPublic: false,
                },
            })),
    },
}));

export const useGameSinglePlayer = () => useGameStore(state => state.singlePlayer);
export const useGameSessionState = () => useGameStore(state => state.sessionState);
export const useGameRoom = () => useGameStore(state => state.room);
export const useGameActions = () => useGameStore(state => state.actions);
