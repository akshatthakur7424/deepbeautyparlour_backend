// importing packages
import express from "express" 
import dotenv from "dotenv"

// initializing packages
const app = express();
dotenv.config();

// global variables
const PORT = process.env.PORT || 7000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.get('/', (req, res) => {
  res.send('Hello, this is Deep Beauty Parlour server!');
});

// Service Category Routes (Admin - for organizing services)
app.post('/service-categories', authenticateAdmin, createServiceCategory);
app.get('/service-categories', getAllServiceCategories);
app.put('/service-categories/:id', authenticateAdmin, updateServiceCategory);
app.delete('/service-categories/:id', authenticateAdmin, deleteServiceCategory);

// Service Routes
app.get('/services', getAllServices); // list all services
app.get('/services/:id', getServiceById); // specific service
app.post('/services', authenticateAdmin, createService); // dashboard
app.put('/services/:id', authenticateAdmin, updateService); // dashboard
app.delete('/services/:id', authenticateAdmin, deleteService); // dashboard

// Favorite Service Routes
app.post('/favorite-services', authenticateUser, addFavoriteService);
app.get('/favorite-services', authenticateUser, getFavoriteServices);

// Product Category Routes (Admin - for organizing services)
app.post('/product-categories', authenticateAdmin, createProductCategory);
app.get('/product-categories', getAllProductCategories);
app.put('/product-categories/:id', authenticateAdmin, updateProductCategory);
app.delete('/product-categories/:id', authenticateAdmin, deleteProductCategory);

// Product Routes
app.get('/products', getAllProducts); // list all products
app.get('/products/:id', getProductById); // view product
app.post('/products', authenticateAdmin, createProduct); // dashboard
app.put('/products/:id', authenticateAdmin, updateProduct); // dashboard
app.delete('/products/:id', authenticateAdmin, deleteProduct); // dashboard

// Favorite Product Routes
app.post('/favorite-products', authenticateUser, addFavoriteProduct);
app.get('/favorite-products', authenticateUser, getFavoriteProducts);

// Booking Routes
app.post('/bookings', authenticateUser, checkBookingConflict, createBooking); // book a service

// TimeSlot Routes (needed to create bookable slots)
app.post('/timeslots', authenticateAdmin, createTimeSlot);
app.get('/timeslots', getAllTimeSlots); // needed to show available time slots

// Order Routes
app.post('/orders', authenticateUser, createOrder); // for single or group of product orders
app.get('/orders/:id', authenticateUser, getOrderById); // optional, view placed order
app.get('/orders', authenticateUser, getAllOrders);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
