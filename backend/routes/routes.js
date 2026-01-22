import express from 'express';
import Route from '../models/Route.js';
import Bus from '../models/Bus.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * SEARCH ROUTES
 */
router.get('/search', async (req, res) => {
  try {
    const { from, to, date } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({ message: 'Please provide from, to, and date' });
    }

    // Parse date string in format YYYY-MM-DD
    // Create date at start of day (00:00:00) in UTC
    const [year, month, day] = date.split('-').map(Number);
    const searchDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    
    // Create end of day (23:59:59) in UTC
    const nextDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    const routes = await Route.find({
      from: { $regex: `^${from}$`, $options: 'i' },
      to: { $regex: `^${to}$`, $options: 'i' },
      date: { $gte: searchDate, $lte: nextDay }
    })
      .populate('bus')
      .sort({ departureTime: 1 });

    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * GET ALL ROUTES
 */
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find()
      .populate('bus')
      .sort({ date: 1, departureTime: 1 });

    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * GET ROUTE BY ID
 */
router.get('/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate('bus');

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.json(route);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * CREATE ROUTE (ADMIN)
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const route = new Route(req.body);
    await route.save();

    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
