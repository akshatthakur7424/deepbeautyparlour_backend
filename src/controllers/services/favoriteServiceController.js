import { db } from '../../database/database.js';

// Add a service to favorites
export const addFavoriteService = async (req, res) => {
  try {
    const userId = req.user.id; // assuming authenticateUser adds user to req
    const { serviceId } = req.body;

    // Check if already favorited
    const existing = await db.favoriteService.findUnique({
      where: {
        userId_serviceId: {
          userId,
          serviceId
        }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Service already in favorites' });
    }

    const favorite = await db.favoriteService.create({
      data: {
        userId,
        serviceId
      }
    });

    res.status(201).json(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add favorite service' });
  }
};

// Get all favorite services of the logged-in user
export const getFavoriteServices = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await db.favoriteService.findMany({
      where: { userId },
      include: {
        service: true
      }
    });

    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch favorite services' });
  }
};
