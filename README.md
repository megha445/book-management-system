# 📚 Book Management System

A RESTful API for managing library books and borrowing operations with JWT authentication, role-based access control, and email notifications.

## 🚀 Features

- **Authentication & Authorization** - JWT-based with Admin/User roles
- **Book Management** - CRUD operations for books
- **Borrowing System** - Borrow/return books with fine calculation
- **User Management** - Activate/deactivate user accounts
- **Email Notifications** - Overdue book alerts
- **Input Validation** - Express-validator for data integrity
- **Security** - bcrypt, rate limiting, helmet
- **API Documentation** - Swagger UI
- **Pagination** - Efficient data loading

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Email:** Nodemailer
- **Validation:** Express-validator
- **Security:** bcrypt, helmet, express-rate-limit
- **Documentation:** Swagger

## 📁 Project Structure
```
book-management-system/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # Database schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, validation, error handling
│   ├── utils/           # Helper functions
│   └── app.js           # Entry point
├── .env.example         # Environment variables template
└── package.json
```

## ⚙️ Installation

1. Clone the repository
```bash
git clone https://github.com/megha445/book-management-system.git
cd book-management-system
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/book_management
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

5. Start MongoDB
```bash
mongod
```

6. Run the application
```bash
# Development
npm run dev

# Production
npm start
```

## 📖 API Documentation

Access Swagger documentation at: `http://localhost:5000/api-docs`

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### User Management (Admin)
- `GET /api/auth/users` - Get all users
- `GET /api/auth/users/:id` - Get user by ID
- `PUT /api/auth/users/:id/activate` - Activate user
- `PUT /api/auth/users/:id/deactivate` - Deactivate user

### Books
- `GET /api/books` - Get all books (with search, filter, pagination)
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create book (Admin only)
- `PUT /api/books/:id` - Update book (Admin only)
- `DELETE /api/books/:id` - Delete book (Admin only)

### Borrowing
- `POST /api/borrow` - Borrow a book
- `PUT /api/borrow/:id/return` - Return a book
- `GET /api/borrow/my-history` - Get user's borrow history
- `GET /api/borrow` - Get all borrow records (Admin only)
- `GET /api/borrow/check-overdue` - Check overdue books (Admin only)

## 🔒 Security Features

- Password hashing with bcrypt
- JWT authentication
- Rate limiting (5 login attempts per 15 minutes)
- Input validation and sanitization
- Helmet for security headers
- Role-based access control

## 👨‍💻 Author

**Megha Shyam**
- GitHub: [megha445](https://github.com/megha445)

## 📄 License

This project is open source and available under the MIT License.