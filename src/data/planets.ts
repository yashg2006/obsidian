export interface Planet {
    id: string;
    name: string;
    type: string;
    distance: number; // light years
    mass: number; // relative to Earth
    radius: number; // relative to Earth
    temperature: number; // Kelvin
    discoveryYear: number;
    description: string;
    color: string;
    habitability: number; // 0-100
    atmosphere: string;
}

export const exoplanets: Planet[] = [
    {
        id: 'trappist-1e',
        name: 'TRAPPIST-1e',
        type: 'Terrestrial',
        distance: 40,
        mass: 0.69,
        radius: 0.92,
        temperature: 251,
        discoveryYear: 2017,
        description: 'One of the most Earth-like exoplanets found in the habitable zone of its star.',
        color: '#2E8B57',
        habitability: 95,
        atmosphere: 'Dense, Nitrogen-rich'
    },
    {
        id: 'proxima-centauri-b',
        name: 'Proxima Centauri b',
        type: 'Super-Earth',
        distance: 4.2,
        mass: 1.27,
        radius: 1.1,
        temperature: 234,
        discoveryYear: 2016,
        description: 'The closest known exoplanet to the Solar System, orbiting within the habitable zone.',
        color: '#A52A2A',
        habitability: 88,
        atmosphere: 'Thin, potentially irradiated'
    },
    {
        id: 'kepler-186f',
        name: 'Kepler-186f',
        type: 'Terrestrial',
        distance: 500,
        mass: 1.1,
        radius: 1.11,
        temperature: 188,
        discoveryYear: 2014,
        description: 'The first Earth-size planet found in the habitable zone of another star.',
        color: '#4682B4',
        habitability: 78,
        atmosphere: 'Unknown, possibly thick'
    },
    {
        id: 'lhs-1140b',
        name: 'LHS 1140b',
        type: 'Super-Earth',
        distance: 40,
        mass: 6.98,
        radius: 1.43,
        temperature: 230,
        discoveryYear: 2017,
        description: 'A rocky world in the habitable zone, a prime target for atmospheric study.',
        color: '#8B4513',
        habitability: 82,
        atmosphere: 'Rocky surface, potential thick atmosphere'
    },
    {
        id: 'k2-18b',
        name: 'K2-18b',
        type: 'Super-Earth',
        distance: 124,
        mass: 8.63,
        radius: 2.6,
        temperature: 265,
        discoveryYear: 2015,
        description: 'Known to have water vapor in its atmosphere, possibly a Hycean world.',
        color: '#87CEEB',
        habitability: 65,
        atmosphere: 'Hydrogen-rich with water vapor'
    },
    {
        id: 'gliese-667cc',
        name: 'Gliese 667 Cc',
        type: 'Super-Earth',
        distance: 23.6,
        mass: 4.5,
        radius: 1.5,
        temperature: 277,
        discoveryYear: 2011,
        description: 'Orbits a red dwarf in a triple star system.',
        color: '#CD853F',
        habitability: 84,
        atmosphere: 'Likely dense'
    },
    {
        id: 'kepler-452b',
        name: 'Kepler-452b',
        type: 'Super-Earth',
        distance: 1400,
        mass: 5,
        radius: 1.6,
        temperature: 265,
        discoveryYear: 2015,
        description: 'Called "Earth\'s Cousin", orbiting a Sun-like star at a similar distance.',
        color: '#DEB887',
        habitability: 80,
        atmosphere: 'Thick, greenhouse effect likely'
    },
    {
        id: 'ross-128b',
        name: 'Ross 128 b',
        type: 'Terrestrial',
        distance: 11,
        mass: 1.35,
        radius: 1.1,
        temperature: 280,
        discoveryYear: 2017,
        description: 'Orbits a quiet red dwarf, making it a good candidate for habitability.',
        color: '#E9967A',
        habitability: 90,
        atmosphere: 'Stable, potentially Earth-like'
    },
    {
        id: 'kepler-22b',
        name: 'Kepler-22b',
        type: 'Super-Earth',
        distance: 620,
        mass: 9.1,
        radius: 2.4,
        temperature: 262,
        discoveryYear: 2011,
        description: 'A well-known super-Earth orbiting in the habitable zone of a Sun-like star.',
        color: '#6495ED',
        habitability: 72,
        atmosphere: 'Unknown, potentially a water world'
    },
    {
        id: 'hd-209458-b',
        name: 'HD 209458 b (Osiris)',
        type: 'Gas Giant',
        distance: 153,
        mass: 220,
        radius: 15,
        temperature: 1130,
        discoveryYear: 1999,
        description: 'The first exoplanet discovered to have an atmosphere. It is a "Hot Jupiter" that is slowly losing its atmosphere into space.',
        color: '#FF8C00',
        habitability: 0,
        atmosphere: 'Evaporating hydrogen envelope'
    },
    {
        id: '51-pegasi-b',
        name: '51 Pegasi b (Dimidium)',
        type: 'Gas Giant',
        distance: 50,
        mass: 150,
        radius: 21,
        temperature: 1265,
        discoveryYear: 1995,
        description: 'The first exoplanet discovered orbiting a main-sequence star. It established the class of planets known as Hot Jupiters.',
        color: '#CD5C5C',
        habitability: 0,
        atmosphere: 'Thick, blazing hot'
    },
    {
        id: 'toi-700-d',
        name: 'TOI 700 d',
        type: 'Terrestrial',
        distance: 101,
        mass: 1.72,
        radius: 1.14,
        temperature: 265,
        discoveryYear: 2020,
        description: 'An Earth-sized planet in the habitable zone of an M dwarf star, discovered by TESS.',
        color: '#20B2AA',
        habitability: 88,
        atmosphere: 'Potentially Earth-like'
    },
    {
        id: 'trappist-1d',
        name: 'TRAPPIST-1d',
        type: 'Terrestrial',
        distance: 40,
        mass: 0.388,
        radius: 0.788,
        temperature: 288,
        discoveryYear: 2017,
        description: 'A small rocky world on the inner edge of its star\'s habitable zone, possibly having a thin atmosphere.',
        color: '#A0522D',
        habitability: 75,
        atmosphere: 'Thin, possibly water-bearing'
    }
];
