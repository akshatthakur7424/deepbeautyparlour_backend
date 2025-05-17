import { db } from '../../database/database.js';

// Add a product to favorites
export const addFavoriteProduct = async (req, res) => {
  try {
    const userId = req.user.id; // assuming authenticateUser adds user to req
    const { productId } = req.body;

    // Check if already favorited
    const existing = await db.favoriteProduct.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Product already in favorites' });
    }

    const favorite = await db.favoriteProduct.create({
      data: {
        userId,
        productId
      }
    });

    res.status(201).json(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add favorite product' });
  }
};

// Get all favorite products of the logged-in user
export const getFavoriteProducts = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await db.favoriteProduct.findMany({
      where: { userId },
      include: {
        product: true
      }
    });

    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch favorite products' });
  }
};
