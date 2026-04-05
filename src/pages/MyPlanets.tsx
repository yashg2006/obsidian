import React from 'react';
import { useStore } from '../store/useStore';
import PlanetCard from '../components/PlanetCard';
import './Explore.css'; // Reuse styles

const MyPlanets: React.FC = () => {
    const { savedPlanets, removeSavedPlanet } = useStore();

    return (
        <div className="explore-page">
            <div className="explore-header">
                <h1>My Saved Planets</h1>
            </div>

            {savedPlanets.length === 0 ? (
                <div className="no-results">
                    <p>You haven't saved any planets yet.</p>
                    <p>Go to the Simulator to create your own worlds!</p>
                </div>
            ) : (
                <div className="planet-grid">
                    {savedPlanets.map(planet => (
                        <div key={planet.id} className="saved-planet-wrapper">
                            <PlanetCard planet={planet} />
                            <button
                                onClick={() => removeSavedPlanet(planet.id)}
                                style={{
                                    marginTop: '10px',
                                    padding: '5px 10px',
                                    background: '#ff0055',
                                    border: 'none',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    borderRadius: '4px'
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPlanets;
