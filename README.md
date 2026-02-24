# 🌌 Cosmos: Advanced Exoplanet Simulator

Cosmos is a high-fidelity, full-stack web application designed for interactive 3D exploration and scientific simulation of real NASA exoplanet data.

![Cosmos Banner](https://raw.githubusercontent.com/yashg2006/obsidian/main/public/banner.png) *(Placeholder: Add your own project screenshot here!)*

## 🚀 Features

### 🔭 Real-Time 3D Simulation
- **Scientific Rendering**: Advanced GLSL shaders using Fractal Brownian Motion (FBM) to procedurally generate terrain, oceans, and atmospheric effects.
- **Dynamic Environments**: Visual changes based on physical properties:
  - **Lava Flows**: Visible on planets with extreme temperatures (>450K).
  - **Glacial Caps**: Realistic ice coverage for cold worlds (<220K).
  - **Dynamic Water**: Real-time sea-level displacement based on surface water percentages.

### 🧪 Habitability Analysis Engine
- **Multi-Factor Scoring**: Real-time habitability index (0-100%) calculated from:
  - Stellar Classification (O, B, A, F, G, K, M stars)
  - Orbital Distance (AU)
  - Atmospheric Density & Composition
  - Magnetic Field Strength
  - Planetary Mass & Radius
- **Scientific HUD**: A premium, glassmorphism-style interface providing deep telemetry on planetary conditions.

### 📊 Data & Personalization
- **NASA Integration**: Explore real discoveries from the Exoplanet Archive.
- **Discovery Archive**: Authenticate to save custom planet configurations and theoretical discoveries.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Three.js, React Three Fiber, Framer Motion, Zustand.
- **Backend**: Node.js, Express, Prisma (SQLite).
- **Styling**: Vanilla CSS with advanced Glassmorphism and Neon design tokens.
- **Deployment**: Configured for Render.com.

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yashg2006/obsidian.git
   cd obsidian
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your_secret_key"
   VITE_API_URL="http://localhost:3000/api"
   ```

4. **Initialize Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run Development Mode:**
   ```bash
   # Both frontend and backend
   npm run dev
   ```

## 🌌 Scientific Logic

The simulation uses simplified astrophysical formulas to approximate planetary conditions:
- **Temperature**: Calculated using the Stefan-Boltzmann law approximation, factoring in stellar luminosity (based on spectral class), distance (inverse-square law), and greenhouse effects from atmospheric density.
- **Habitability**: A weighted algorithm that prioritizes the "Goldilocks Zone" temperature (approx. 288K) and the presence of liquid water and magnetic protection.

---

*Created with ❤️ by [Yash](https://github.com/yashg2006)*
