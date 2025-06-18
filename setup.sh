#!/bin/bash

echo "🚀 Setting up URL Shortener Service..."

# Create project directory structure
echo "📁 Creating project structure..."
mkdir -p backend/src/{controllers,routes,middleware,__tests__}
mkdir -p backend/prisma
mkdir -p frontend/src/{components,services}
mkdir -p frontend/public

# Copy environment files
echo "📝 Setting up environment files..."
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

echo "✅ Project structure created!"
echo ""
echo "Next steps:"
echo "1. Run: docker-compose up --build"
echo "2. Open http://localhost:3000 in your browser"
echo "3. The API will be available at http://localhost:4000"
echo ""
echo "For development without Docker:"
echo "1. Setup PostgreSQL database"
echo "2. Update DATABASE_URL in backend/.env"
echo "3. Run 'npm install' in both backend and frontend folders"
echo "4. Run 'npm run dev' in backend folder"
echo "5. Run 'npm start' in frontend folder"
