// importing packages
import express from "express" 
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";

// user authentication controllers
import { loginController } from "./controllers/authentication_user/loginController.js"
import { loginPasswordController } from "./controllers/authentication_user/loginPasswordController.js";
import { signupController } from "./controllers/authentication_user/signupController.js";
import { passwordController } from "./controllers/authentication_user/passwordController.js";
import { otpController } from "./controllers/authentication_user/otpController.js";
import { resendOtpController } from "./controllers/authentication_user/resendOtp.js";
// service category controllers
import { createServiceCategory, getAllServiceCategories, updateServiceCategory, deleteServiceCategory } from "./controllers/services/serviceCategoryController.js";
// service controllers
import { createService, getAllServices, updateService, deleteService, getServiceById } from "./controllers/services/serviceController.js";
// favorite service controllers
import { addFavoriteService, getFavoriteServices } from "./controllers/services/favoriteServiceController.js";
// product category controllers
import { createProductCategory, getAllProductCategories, updateProductCategory, deleteProductCategory } from "./controllers/products/productCategoryCategory.js";
// product controllers
import { createProduct, getAllProducts, updateProduct, deleteProduct, getProductById } from "./controllers/products/productController.js";
// favorite product controllers
import { addFavoriteProduct, getFavoriteProducts } from "./controllers/products/favouriteProductController.js";

// middleware
import { emailSaver, otpSaver , emailSender  , generateJWT } from "./middlewares/authentication_user/signupMiddleware.js";

// initializing packages
const app = express();
dotenv.config();

// global variables
const PORT = process.env.PORT || 7000;

// Middleware
const domain = "http://localhost:3000"; // frontend domain

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json());

app.use(cookieParser({
    secure: false
}));

// app.use(cors());
let corsData = {
    origin: domain,
    credentials: true
}
app.use(cors(corsData));

// Enable CORS for all routes
app.use(cookieParser());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', domain);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello, this is Deep Beauty Parlour server!');
});

// user authentication api's
app.post('/signup-email' ,emailSaver, otpSaver , emailSender  , generateJWT,  signupController); // route for saving email to database , sending otp on it and saving otp in the database.
app.post('/signup-otp', otpController)  // route for matching user entered otp with the actual otp stored in database
app.post('/signup-password' , passwordController)  // route for saving password in database
app.post("/login" ,loginController)  // route for token generation on registered email used in login 
app.post("/login-password",loginPasswordController) // route for matching password in the login and resetting passwords
app.post('/authentication-resend-otp',resendOtpController)  // route for resending the otp

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
