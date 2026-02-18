# 3D Planet Viewer - Obsidian Event

An immersive 3D web application for viewing, exploring, and simulating exoplanets with vital habitability data.

## Features

- **3D Globe**: Interactive rotating planet visualization using Three.js and React Three Fiber.
- **Explore**: Browse a curated list of 8 real NASA exoplanets with detailed stats.
- **Simulator**: Customize planet parameters (star type, distance, atmosphere, radius) and see visual changes in real-time. Or simulate existing planets.
- **Habitability Analysis**: Dynamic scoring based on 6 key factors (Distance, Radius, Atmosphere, Water, etc.).
- **User Authentication**: Simple login/signup flow (mocked) to save your custom simulated planets.
- **Sci-Fi Aesthetics**: Glassmorphism, neon accents, and responsive design.

## Tech Stack

- **React 18** + **Vite**
- **Three.js** + **@react-three/fiber** + **@react-three/drei** (3D Rendering)
- **Framer Motion** (Animations)
- **Zustand** (State Management)
- **React Router** (Navigation)
- **Lucide React** (Icons)
- **Vanilla CSS** (Styling)

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser.

## Project Structure

- `src/components`: Reusable UI components (Navbar, Globe, Controls, PlanetCard).
- `src/pages`: Application pages (Landing, Explore, Simulator, My Planets, Auth).
- `src/store`: Global state management with Zustand.
- `src/data`: Static data for exoplanets.
