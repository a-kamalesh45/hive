# Query Management System - Backend

Backend API for the Query Management System built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration

```bash
cp .env.example .env
```

3. Configure your `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/query-management
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Running the Server

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in .env)

## API Endpoints

### Authentication
- `POST /api/signup` - Register a new user
- `POST /api/login` - Login user

### Queries
- `POST /api/add-query` - Create a new query

### Health Check
- `GET /health` - Server health status

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/query-management |
| JWT_SECRET | Secret key for JWT tokens | (required) |
| JWT_EXPIRES_IN | JWT token expiration time | 7d |
| PORT | Server port | 5000 |
| NODE_ENV | Environment mode | development |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |

## Project Structure

```
backend/
├── config/
│   └── db.js           # Database configuration
├── controllers/
│   ├── LoginController.js
│   ├── SignUpController..js
│   └── AddQueryController.js
├── models/
│   ├── User.js
│   └── Query.js
├── routes/
│   └── api.js          # API routes
├── .env                # Environment variables (not in git)
├── .env.example        # Environment template
├── .gitignore
├── package.json
└── server.js           # Main server file
```

## Security Notes

- Never commit `.env` file to version control
- Use strong JWT secrets in production
- Always use HTTPS in production
- Keep dependencies updated

## Generating a Secure JWT Secret

Run this command to generate a strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## License

ISC
