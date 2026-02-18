import { create } from 'zustand';
import { Planet, exoplanets } from '../data/planets';

export interface User {
    id: string;
    email: string;
    name: string;
}

export interface SimulatorParams {
    starType: 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M';
    distance: number; // AU
    atmosphereDensity: number; // 0-1
    surfaceWater: number; // 0-1
    planetRadius: number; // Earth Radii
    magneticField: number; // 0-1
}

interface AppState {
    user: User | null;
    isAuthenticated: boolean;
    savedPlanets: Planet[];
    allPlanets: Planet[];

    // Simulator State
    simulatorParams: SimulatorParams;

    // Actions
    login: (email: string, token: string, user: User) => void;
    logout: () => void;
    savePlanet: (planet: Planet) => void;
    loadSavedPlanets: () => void;
    removeSavedPlanet: (id: string) => void;
    updateSimulatorParams: (params: Partial<SimulatorParams>) => void;
}

const DEFAULT_SIMULATOR_PARAMS: SimulatorParams = {
    starType: 'G',
    distance: 1,
    atmosphereDensity: 1,
    surfaceWater: 0.7,
    planetRadius: 1,
    magneticField: 1,
};

const API_URL = 'http://localhost:3000/api';

export const useStore = create<AppState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    savedPlanets: [],
    allPlanets: exoplanets,

    simulatorParams: DEFAULT_SIMULATOR_PARAMS,

    login: (email, token, user) => {
        localStorage.setItem('token', token);
        set({ user, isAuthenticated: true });
        get().loadSavedPlanets();
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false, savedPlanets: [] });
    },

    loadSavedPlanets: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`${API_URL}/planets`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                set({ savedPlanets: data });
            }
        } catch (err) {
            console.error('Failed to load planets', err);
        }
    },

    savePlanet: async (planet) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`${API_URL}/planets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(planet)
            });

            if (res.ok) {
                const newPlanet = await res.json();
                set((state) => ({ savedPlanets: [...state.savedPlanets, newPlanet] }));
            }
        } catch (err) {
            console.error('Failed to save planet', err);
        }
    },

    removeSavedPlanet: async (id) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await fetch(`${API_URL}/planets/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            set((state) => ({
                savedPlanets: state.savedPlanets.filter(p => p.id !== id)
            }));
        } catch (err) {
            console.error('Failed to delete planet', err);
        }
    },

    updateSimulatorParams: (params) => set((state) => ({
        simulatorParams: { ...state.simulatorParams, ...params }
    })),
}));
