# Portfolio Builder - Server

Backend API for the Portfolio Builder application built with Node.js, Express, and MongoDB.

## Features

- User authentication (Register, Login, Logout)
- JWT-based authentication
- Portfolio CRUD operations
- Public portfolio sharing via slugs
- Input validation
- Error handling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI and JWT secret

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)
- `PUT /api/auth/updatedetails` - Update user details (protected)
- `PUT /api/auth/updatepassword` - Update password (protected)

### Portfolios
- `GET /api/portfolios` - Get all user portfolios (protected)
- `POST /api/portfolios` - Create portfolio (protected)
- `GET /api/portfolios/:id` - Get single portfolio (protected)
- `PUT /api/portfolios/:id` - Update portfolio (protected)
- `DELETE /api/portfolios/:id` - Delete portfolio (protected)
- `PUT /api/portfolios/:id/visibility` - Toggle visibility (protected)
- `GET /api/portfolios/public/:slug` - Get public portfolio by slug

### Health
- `GET /api/health` - Server health check
- `GET /` - API info

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRE` - JWT expiration time
- `CLIENT_URL` - Frontend URL for CORS
