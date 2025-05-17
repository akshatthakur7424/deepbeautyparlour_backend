import { db } from '../../database/database.js';

// Create a new service category
export const createServiceCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existing = await db.serviceCategory.findUnique({ where: { name } });
    if (existing) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const category = await db.serviceCategory.create({
      data: { name },
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Update a service category
export const updateServiceCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await db.serviceCategory.update({
      where: { id },
      data: { name },
    });

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update category' });
  }
};

// Delete a service category
export const deleteServiceCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await db.serviceCategory.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

// Get all service categories
export const getAllServiceCategories = async (req, res) => {
  try {
    const categories = await db.serviceCategory.findMany();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};
