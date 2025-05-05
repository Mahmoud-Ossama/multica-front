# Build stage
FROM node:18-alpine AS build

# Set working directory for build
WORKDIR /build

# Copy package files
COPY multaqa-frontend-main/multaqa-frontend-main/package.json ./
COPY multaqa-frontend-main/multaqa-frontend-main/package-lock.json* ./

# Install dependencies
RUN npm install --no-package-lock

# Copy source code
COPY multaqa-frontend-main/multaqa-frontend-main/ ./

# Build the React application
RUN npm run build

# Runtime stage
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy server.js
COPY server.js ./

# Copy built React app from build stage
COPY --from=build /build/build ./public

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]
