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
    habitabilityScore: number;
    calculatedTemp: number; // in Kelvin

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

const STAR_TEMPERATURES = {
    O: 40000,
    B: 20000,
    A: 8500,
    F: 6500,
    G: 5700,
    K: 4500,
    M: 3500,
};

const calculateMetrics = (params: SimulatorParams) => {
    // 1. Calculate Temperature (simplified Stefan-Boltzmann)
    // T_p = T_star * sqrt(R_star / 2D) * (1 - albedo)^0.25
    // We'll simplify: T_p proportional to T_star / sqrt(distance)
    const baseStarTemp = STAR_TEMPERATURES[params.starType];
    const temp = (baseStarTemp * 0.05) / Math.sqrt(params.distance);

    // Adjust for atmosphere (greenhouse effect)
    const finalTemp = temp * (1 + params.atmosphereDensity * 0.2);

    // 2. Calculate Habitability Score (0-100)
    let score = 0;

    // Temperature Score (Optimized for 288K - Earth like)
    const tempDiff = Math.abs(finalTemp - 288);
    const tempScore = Math.max(0, 40 - (tempDiff / 2)); // 40 pts max

    // Water Score (Optimized for 0.4 - 0.8)
    const waterScore = params.surfaceWater > 0 ? (params.surfaceWater > 0.3 && params.surfaceWater < 0.9 ? 30 : 15) : 0;

    // Atmosphere Score
    const atmScore = params.atmosphereDensity > 0.4 && params.atmosphereDensity < 1.8 ? 20 : 10;

    // Magnetic Field
    const magScore = params.magneticField * 10;

    score = tempScore + waterScore + atmScore + magScore;

    return {
        calculatedTemp: Math.round(finalTemp),
        habitabilityScore: Math.round(Math.min(100, Math.max(0, score)))
    };
};

import { API_URL } from '../config';

export const useStore = create<AppState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    savedPlanets: [],
    allPlanets: exoplanets,

    simulatorParams: DEFAULT_SIMULATOR_PARAMS,
    habitabilityScore: 85,
    calculatedTemp: 288,

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

    updateSimulatorParams: (params) => {
        const newParams = { ...get().simulatorParams, ...params };
        const { calculatedTemp, habitabilityScore } = calculateMetrics(newParams);
        set({
            simulatorParams: newParams,
            calculatedTemp,
            habitabilityScore
        });
    },
}));
