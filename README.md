# FashionStore - E-commerce Platform

A modern e-commerce platform for fashion products built with React frontend and Node.js backend.

## Features

### Customer Side
- 🛍️ **Product Browsing**: Browse products by category, brand, and search functionality
- 🛒 **Shopping Cart**: Add, remove, and manage items in cart
- 👤 **User Authentication**: Register, login, and profile management
- 📦 **Order Management**: Place orders and track order status
- 💳 **Checkout Process**: Complete purchase with multiple payment options
- 📱 **Responsive Design**: Mobile-friendly interface
- 🔍 **Advanced Search**: Search products with filters and sorting

### Admin Side
- 📊 **Dashboard**: Analytics and overview of sales, orders, and customers
- 🎯 **Product Management**: Add, edit, and delete products with image upload
- 📋 **Order Management**: Process orders and update status
- 👥 **User Management**: Manage customer accounts and admin users
- 📂 **Category Management**: Organize products by categories
- 📈 **Analytics**: Sales reports and performance metrics

### Landing Page
- 🎨 **Modern Design**: Beautiful landing page with 2 sections for model product images
- 🚀 **Hero Section**: Eye-catching hero with call-to-action
- 📱 **Responsive Layout**: Works perfectly on all devices
- ✨ **Animations**: Smooth animations using Framer Motion

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - SQL database
- **JWT** - Authentication
- **Multer** - File upload handling
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fashion-ecommerce
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/fashion-ecommerce
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately
   npm run server    # Backend on port 5000
   npm run client    # Frontend on port 3000
   ```

## Project Structure

```
fashion-ecommerce/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/             # Database configuration
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── uploads/            # File uploads
│   └── index.js
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Orders
- `GET /api/orders/my-orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/analytics` - Sales analytics
- `GET /api/admin/low-stock` - Low stock products

## Features in Detail

### Landing Page Sections
1. **Hero Section**: Features 2 sections with model product images
   - First section: Summer Collection & Accessories
   - Second section: Casual Wear & Formal Collection
   - Animated gradients and hover effects
   - Call-to-action buttons

2. **Category Section**: Browse products by category
   - Pakaian (Clothing)
   - Sepatu (Shoes)
   - Aksesoris (Accessories)
   - Tas (Bags)

3. **Featured Products**: Showcase trending items
4. **Newsletter**: Email subscription

### User Authentication
- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes for customers and admins
- Session management

### Shopping Cart
- Persistent cart storage in localStorage
- Add/remove items with size and color options
- Quantity management
- Real-time total calculation

### Admin Dashboard
- Sales analytics and charts
- Order management with status updates
- Product inventory management
- Customer management
- Low stock alerts

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@fashionstore.com or create an issue in the repository. 
