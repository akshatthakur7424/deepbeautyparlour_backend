import { db } from '../../database/database.js';

// Create a new product category
export const createProductCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existing = await db.productCategory.findUnique({ where: { name } });
    if (existing) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const category = await db.productCategory.create({
      data: { name },
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all product categories
export const getAllProductCategories = async (req, res) => {
  try {
    const categories = await db.productCategory.findMany();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Update a product category by ID
export const updateProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await db.productCategory.update({
      where: { id },
      data: { name },
    });

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update category' });
  }
};

// Delete a product category by ID
export const deleteProductCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await db.productCategory.delete({ where: { id } });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
