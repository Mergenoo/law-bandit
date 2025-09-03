# Law Bandit Backend

A modern Express.js backend API for the Law Bandit application.

## Features

- 🔐 Authentication system (login, register, logout)
- 👥 User management (CRUD operations)
- 📋 Case management (CRUD operations)
- 🛡️ Security middleware (helmet, CORS, rate limiting)
- 📊 Request logging and compression
- 🏥 Health check endpoint
- ⚡ Error handling and validation

## Quick Start

### Prerequisites

- Node.js (>= 16.0.0)
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Cases
- `GET /api/cases` - Get all cases
- `GET /api/cases/:id` - Get case by ID
- `POST /api/cases` - Create new case
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case

## Environment Variables

Copy `env.example` to `.env` and configure:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Database Configuration (for future use)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=law_bandit
# DB_USER=postgres
# DB_PASSWORD=password

# JWT Configuration (for future use)
# JWT_SECRET=your-super-secret-jwt-key
# JWT_EXPIRES_IN=24h
```

## Project Structure

```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── routes/            # API route handlers
│   ├── index.js       # Main router
│   ├── auth.js        # Authentication routes
│   ├── users.js       # User management routes
│   └── cases.js       # Case management routes
├── middleware/        # Custom middleware (future)
├── models/           # Data models (future)
├── controllers/      # Business logic (future)
├── utils/           # Utility functions (future)
└── tests/           # Test files (future)
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting (100 requests per 15 minutes)
- **Request Validation**: Input validation and sanitization
- **Error Handling**: Global error handler with proper status codes

## Development

### Adding New Routes

1. Create a new route file in `routes/`
2. Export the router
3. Import and mount in `routes/index.js`

Example:
```javascript
// routes/example.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Example route' });
});

module.exports = router;
```

### Adding Middleware

Add middleware in `server.js` before route mounting:

```javascript
app.use('/api/example', require('./routes/example'));
```

## Testing

Run tests with:
```bash
npm test
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure environment variables
3. Run `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
