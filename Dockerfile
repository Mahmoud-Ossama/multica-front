# Use a simple Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json
COPY package.json ./

# Install dependencies
RUN npm install --no-package-lock

# Copy the rest of the code
COPY . .

# Build the app
RUN npm run build

# Install serve to deliver the static content
RUN npm install -g serve

# Create a health check file
RUN echo "OK" > build/health.txt

# Expose port
EXPOSE 3000

# Start server
CMD ["serve", "-s", "build", "-l", "3000"]
