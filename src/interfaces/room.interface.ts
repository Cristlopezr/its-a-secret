import { type Player } from './player.interface';

export type RoomStatus = 'waitingPlayers' | 'waitingSecrets' | 'started' | 'finished';

export interface Room {
    id: string;
    code: string;
    players: Player[];
    status: RoomStatus;
    secrets: Secret[];
    config: Config[];
    maxPlayers: number;
    currentSecretIdx: number;
    scoresPublic: boolean;
}

interface Secret {
    id: string;
    playerId: string;
    secret: string;
}

interface Config {
    id: string;
    description: string;
    isActive: boolean;
}
