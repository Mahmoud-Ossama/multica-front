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

# Create a health check file in the build directory
RUN echo "OK" > build/health.txt

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a simple health check script
RUN echo "#!/bin/sh\n\
curl -s -f http://localhost/health.txt || exit 1" > /usr/local/bin/healthcheck.sh && \
    chmod +x /usr/local/bin/healthcheck.sh

HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=3 \
  CMD /usr/local/bin/healthcheck.sh

# Start nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
