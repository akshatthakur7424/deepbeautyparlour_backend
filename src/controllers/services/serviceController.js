import { db } from '../../database/database.js';

// Create a new service
export const createService = async (req, res) => {
  try {
    const { name, description, imageUrl, price, categoryId } = req.body;

    const service = await db.service.create({
      data: {
        name,
        description,
        imageUrl,
        price: parseFloat(price),
        categoryId,
      },
    });

    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create service' });
  }
};

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await db.service.findMany({
      include: {
        category: true,
      },
    });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

// Get a specific service by ID
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await db.service.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};

// Update a service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, price, categoryId } = req.body;

    const updated = await db.service.update({
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
    res.status(500).json({ error: 'Failed to update service' });
  }
};

// Delete a service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    await db.service.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
};
