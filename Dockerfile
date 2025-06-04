FROM node:20-alpine AS backend-builder

# Set working directory for backend
WORKDIR /app

# Copy backend package files
COPY back-library/package*.json ./
RUN npm install

# Copy backend source code
COPY back-library/ ./

# Build the backend first
RUN npm run build

# Frontend build stage
FROM node:20-alpine AS frontend-builder

# Set working directory for frontend
WORKDIR /app

# Copy frontend package files
COPY front-library/package*.json ./
RUN npm install

# Copy frontend source code
COPY front-library/ ./

# Build the frontend
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files from backend
COPY --from=backend-builder /app/package*.json ./

# Install production dependencies only
RUN npm install --only=production

# Copy built backend
COPY --from=backend-builder /app/dist ./dist

# Create public directory for static files
RUN mkdir -p public

# Copy built frontend to public directory
COPY --from=frontend-builder /app/dist ./public

EXPOSE 3000

CMD ["node", "dist/main"]