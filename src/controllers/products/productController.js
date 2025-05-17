import { db } from '../../database/database.js';

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, imageUrl, price, categoryId } = req.body;

    const product = await db.product.create({
      data: {
        name,
        description,
        imageUrl,
        price: parseFloat(price),
        categoryId,
      },
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await db.product.findMany({
      include: {
        category: true,
        images: true,          // Include product images if you have added that relation
      },
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get a specific product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,          // Include product images here as well
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, price, categoryId } = req.body;

    const updated = await db.product.update({
      where: { id },
      data: {
        name,
        description,
        imageUrl,
        price: parseFloat(price),
        categoryId,
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await db.product.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
