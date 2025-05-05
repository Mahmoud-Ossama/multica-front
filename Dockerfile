# Build stage
FROM node:18-alpine AS build

# Set working directory for build
WORKDIR /build

# Copy package.json first for better caching
COPY package.json ./

# Install dependencies
RUN npm install --no-package-lock

# Copy source code
COPY . ./

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

# Log the contents of directories to debug
RUN echo "Contents of /app:" && ls -la /app && \
    echo "Contents of /app/public (if exists):" && ls -la /app/public || echo "public directory not found"

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]
