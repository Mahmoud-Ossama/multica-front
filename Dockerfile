# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json
COPY package.json ./

# Install dependencies without creating a package-lock.json
RUN npm install --no-package-lock

# Copy the rest of the code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Start nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
