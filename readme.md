# URL Shortener Service

A full-stack URL shortening service built with TypeScript, featuring a REST API backend and React frontend, containerized with Docker.

## Features

### Backend API
- **POST /shorten** - Create short URLs with optional custom alias and expiration
- **GET /:shortUrl** - Redirect to original URL with click tracking
- **GET /info/:shortUrl** - Get URL information and statistics
- **GET /analytics/:shortUrl** - Get detailed click analytics with IP tracking
- **DELETE /delete/:shortUrl** - Delete short URLs

### Frontend
- Create short URLs with custom aliases
- Set expiration dates for URLs
- View click statistics and analytics
- Copy short URLs to clipboard
- Delete URLs
- Responsive design

### Technical Stack
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Frontend**: React, TypeScript, Axios
- **Containerization**: Docker, Docker Compose
- **Testing**: Jest, Supertest

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local development)

### Run with Docker (Recommended)

1. Clone the repository
2. Run the entire stack with one command:

```bash
docker-compose up --build
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 3001
- Frontend React app on port 3000

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432

## API Documentation

### Create Short URL
```http
POST /shorten
Content-Type: application/json

{
  "originalUrl": "https://example.com",
  "alias": "my-link",        // optional, max 20 chars
  "expiresAt": "2024-12-31T23:59:59Z"  // optional
}
```

### Redirect to Original URL
```http
GET /:shortUrl
```
Redirects to original URL and records click analytics.

### Get URL Information
```http
GET /info/:shortUrl
```
Returns URL details including click count.

### Get Analytics
```http
GET /analytics/:shortUrl
```
Returns detailed click analytics with recent IP addresses.

### Delete URL
```http
DELETE /delete/:shortUrl
```

## Database Schema

### URLs Table
- `id` - Unique identifier
- `shortUrl` - Generated short code
- `originalUrl` - Original URL
- `alias` - Custom alias (optional)
- `createdAt` - Creation timestamp
- `expiresAt` - Expiration timestamp (optional)
- `clickCount` - Number of clicks

### Clicks Table
- `id` - Unique identifier
- `urlId` - Reference to URL
- `ipAddress` - Visitor IP address
- `clickedAt` - Click timestamp

## Development

### Local Development Setup

1. **Backend Setup**:
```bash
cd backend
npm install
cp .env.example .env  # Configure database URL
npx prisma generate
npx prisma db push
npm run dev
```

2. **Frontend Setup**:
```bash
cd frontend
npm install
npm start
```

3. **Database Setup**:
```bash
# Using Docker
docker run --name postgres-url-shortener \
  -e POSTGRES_DB=urlshortener \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 -d postgres:15
```

### Running Tests

```bash
cd backend
npm test
```

Test coverage includes:
- Creating URLs with unique aliases
- URL redirection functionality
- Error handling for duplicate aliases
- Input validation

## Project Structure

```
url-shortener/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── index.ts
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middleware/
│   └── __tests__/
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── public/
    └── src/
        ├── components/
        ├── services/
        └── App.tsx
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/urlshortener
PORT=4000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:4000
```

## Features in Detail

### URL Shortening
- Generates unique 8-character short codes using nanoid
- Supports custom aliases up to 20 characters
- Validates URLs and prevents duplicate aliases
- Optional expiration dates

### Click Analytics
- Records every click with timestamp and IP address
- Tracks total click count per URL
- Provides recent click history
- Shows last 5 unique IP addresses

### Security Features
- Input validation using Joi
- Helmet.js for security headers
- CORS configuration
- SQL injection prevention with Prisma ORM

### Frontend Features
- Responsive design with modern CSS
- Real-time form validation
- Copy to clipboard functionality
- Confirmation dialogs for destructive actions
- Error handling and user feedback

## Deployment

The application is containerized and can be deployed using:
- Docker Compose (recommended for development)
- Kubernetes
- Cloud platforms (AWS, GCP, Azure)

For production deployment:
1. Update environment variables
2. Configure database connection
3. Set up reverse proxy (nginx)
4. Enable HTTPS
5. Configure monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
