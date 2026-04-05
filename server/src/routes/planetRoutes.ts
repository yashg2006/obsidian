import express from 'express';
import prisma from '../prisma';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Get all saved planets for authenticated user
router.get('/', authenticateToken, async (req: any, res) => {
    try {
        const planets = await prisma.planet.findMany({
            where: { userId: req.user.id }
        });
        res.json(planets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching planets' });
    }
});

// Save a new planet
router.post('/', authenticateToken, async (req: any, res) => {
    const { name, type, distance, mass, radius, temperature, habitability, atmosphere, discoveryYear, description, color } = req.body;

    try {
        const newPlanet = await prisma.planet.create({
            data: {
                name,
                type,
                distance,
                mass,
                radius,
                temperature,
                habitability,
                atmosphere,
                discoveryYear,
                description,
                color,
                userId: req.user.id
            }
        });
        res.json(newPlanet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving planet' });
    }
});

// Delete a planet
router.delete('/:id', authenticateToken, async (req: any, res) => {
    const { id } = req.params;
    try {
        await prisma.planet.delete({
            where: { id }
        });
        res.json({ message: 'Planet deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting planet' });
    }
});

export default router;
