import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Globe2, AlertCircle } from 'lucide-react';
import './CreatePlanetModal.css';

interface CreatePlanetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NASA_SAMPLES = [
    {
        name: 'Kepler-438b',
        type: 'Terrestrial',
        distance: 470,
        mass: 1.2,
        radius: 1.12,
        temperature: 276,
        discoveryYear: 2015,
        description: 'A near-Earth-sized exoplanet, likely rocky, orbiting on the inner edge of its star\'s habitable zone.',
        color: '#4682B4',
        habitability: 88,
        atmosphere: 'Unknown, potentially Earth-like'
    },
    {
        name: 'Gliese 581g',
        type: 'Super-Earth',
        distance: 20.4,
        mass: 3.1,
        radius: 1.5,
        temperature: 228,
        discoveryYear: 2010,
        description: 'An unconfirmed but heavily studied exoplanet candidate in the habitable zone of Gliese 581.',
        color: '#8B4513',
        habitability: 75,
        atmosphere: 'Dense and rocky'
    }
];

const CreatePlanetModal: React.FC<CreatePlanetModalProps> = ({ isOpen, onClose }) => {
    const { addPlanetToExplore } = useStore();
    const [formData, setFormData] = useState({
        name: '',
        type: 'Terrestrial',
        distance: '',
        mass: '',
        radius: '',
        temperature: '',
        discoveryYear: new Date().getFullYear().toString(),
        description: '',
        color: '#4682B4',
        habitability: '50',
        atmosphere: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAutoFill = () => {
        const sample = NASA_SAMPLES[Math.floor(Math.random() * NASA_SAMPLES.length)];
        setFormData({
            name: sample.name,
            type: sample.type,
            distance: sample.distance.toString(),
            mass: sample.mass.toString(),
            radius: sample.radius.toString(),
            temperature: sample.temperature.toString(),
            discoveryYear: sample.discoveryYear.toString(),
            description: sample.description,
            color: sample.color,
            habitability: sample.habitability.toString(),
            atmosphere: sample.atmosphere
        });
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.distance || !formData.mass) {
            setError('Please fill in all required fields (Name, Distance, Mass).');
            return;
        }

        const newPlanet = {
            id: `custom-${Date.now()}`,
            name: formData.name,
            type: formData.type,
            distance: parseFloat(formData.distance) || 0,
            mass: parseFloat(formData.mass) || 1,
            radius: parseFloat(formData.radius) || 1,
            temperature: parseFloat(formData.temperature) || 273,
            discoveryYear: parseInt(formData.discoveryYear) || new Date().getFullYear(),
            description: formData.description || 'A newly cataloged exoplanet.',
            color: formData.color,
            habitability: parseInt(formData.habitability) || 50,
            atmosphere: formData.atmosphere || 'Unknown'
        };

        addPlanetToExplore(newPlanet);
        onClose();
        
        // Reset form
        setFormData({
            name: '',
            type: 'Terrestrial',
            distance: '',
            mass: '',
            radius: '',
            temperature: '',
            discoveryYear: new Date().getFullYear().toString(),
            description: '',
            color: '#4682B4',
            habitability: '50',
            atmosphere: ''
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay">
                    <motion.div 
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    
                    <motion.div 
                        className="create-planet-modal glass-panel"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
                        
                        <div className="modal-header">
                            <div className="modal-title-wrap">
                                <Globe2 className="modal-icon" size={24} />
                                <h2>Catalog New Exoplanet</h2>
                            </div>
                            <button className="auto-fill-btn" type="button" onClick={handleAutoFill}>
                                <Sparkles size={14} /> Auto-fill from NASA Archive
                            </button>
                        </div>

                        {error && (
                            <div className="modal-error">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="create-planet-form">
                            <div className="form-row">
                                <div className="form-group flex-2">
                                    <label>Designation / Name *</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Kepler-186f" required />
                                </div>
                                <div className="form-group flex-1">
                                    <label>Planet Type</label>
                                    <select name="type" value={formData.type} onChange={handleChange}>
                                        <option value="Terrestrial">Terrestrial</option>
                                        <option value="Super-Earth">Super-Earth</option>
                                        <option value="Gas Giant">Gas Giant</option>
                                        <option value="Ice Giant">Ice Giant</option>
                                        <option value="Ocean World">Ocean World</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label>Distance (ly) *</label>
                                    <input type="number" step="0.1" name="distance" value={formData.distance} onChange={handleChange} placeholder="Light years" required />
                                </div>
                                <div className="form-group flex-1">
                                    <label>Mass (Earths) *</label>
                                    <input type="number" step="0.01" name="mass" value={formData.mass} onChange={handleChange} required />
                                </div>
                                <div className="form-group flex-1">
                                    <label>Radius (Earths)</label>
                                    <input type="number" step="0.01" name="radius" value={formData.radius} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label>Temp (Kelvin)</label>
                                    <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} />
                                </div>
                                <div className="form-group flex-1">
                                    <label>Discovery Year</label>
                                    <input type="number" name="discoveryYear" value={formData.discoveryYear} onChange={handleChange} />
                                </div>
                                <div className="form-group flex-1">
                                    <label>Habitability Score (0-100)</label>
                                    <input type="number" min="0" max="100" name="habitability" value={formData.habitability} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group flex-2">
                                    <label>Atmosphere Type</label>
                                    <input type="text" name="atmosphere" value={formData.atmosphere} onChange={handleChange} placeholder="e.g. Thick, Nitrogen-rich" />
                                </div>
                                <div className="form-group flex-1 color-picker-group">
                                    <label>Base Color</label>
                                    <input type="color" name="color" value={formData.color} onChange={handleChange} className="color-input" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description Notes</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Scientific observations..." />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                                <button type="submit" className="btn-submit">Add to Explorer Database</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CreatePlanetModal;
