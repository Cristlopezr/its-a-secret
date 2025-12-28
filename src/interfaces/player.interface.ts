type Role = 'Admin' | 'Player';

export interface Player {
    id: string;
    username: string;
    role: Role;
    score: number;
    color: string;
    icon: string;
}
