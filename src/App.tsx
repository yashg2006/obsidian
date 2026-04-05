import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import AuthGate from './components/AuthGate';
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import Simulator from './pages/Simulator';
import MyPlanets from './pages/MyPlanets';
import Auth from './pages/Auth';
import StarMap from './pages/StarMap';
import Compare from './pages/Compare';
import { useStore } from './store/useStore';

const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

const AnimatedRoutes: React.FC = () => {
    const location = useLocation();
    const { isAuthenticated } = useStore();

    // If not authenticated and not on the /auth page, show AuthGate
    if (!isAuthenticated && location.pathname !== '/auth') {
        return <AuthGate />;
    }

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={
                    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                        <Landing />
                    </motion.div>
                } />
                <Route path="/explore" element={
                    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                        <Explore />
                    </motion.div>
                } />
                <Route path="/simulator" element={
                    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                        <Simulator />
                    </motion.div>
                } />
                <Route path="/starmap" element={
                    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                        <StarMap />
                    </motion.div>
                } />
                <Route path="/compare" element={
                    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                        <Compare />
                    </motion.div>
                } />
                <Route path="/my-planets" element={
                    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                        <MyPlanets />
                    </motion.div>
                } />
                <Route path="/auth" element={
                    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                        <Auth />
                    </motion.div>
                } />
            </Routes>
        </AnimatePresence>
    );
};

const App: React.FC = () => {
    const { isAuthenticated } = useStore();

    return (
        <Router>
            <div className="app-container">
                {isAuthenticated && <Navbar />}
                <AnimatedRoutes />
            </div>
        </Router>
    );
};

export default App;
