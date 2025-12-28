import { create } from 'zustand';

export const Scope = {
    CreateRoom: 'CREATE_ROOM',
    JoinRoom: 'JOIN_ROOM',
    EnterName: 'ENTER_NAME',
    General: 'GENERAL',
} as const;

type Scope = (typeof Scope)[keyof typeof Scope];

interface UIActions {
    setNotification: (scope: Scope, message: string) => void;
    clearNotifications: () => void;
}

interface UiState {
    notifications: Partial<Record<Scope, string>>;
    actions: UIActions;
}

const useUiStore = create<UiState>()(set => ({
    notifications: {},
    actions: {
        setNotification: (scope, message) =>
            set(state => ({
                notifications: {
                    ...state.notifications,
                    [scope]: message,
                },
            })),
        clearNotifications: () => set(() => ({ notifications: {} })),
    },
}));

export const useUINotifications = () => useUiStore(state => state.notifications);
export const useUIActions = () => useUiStore(state => state.actions);
