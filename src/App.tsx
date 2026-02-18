import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import Simulator from './pages/Simulator';
import MyPlanets from './pages/MyPlanets';
import Auth from './pages/Auth';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/my-planets" element={<MyPlanets />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
