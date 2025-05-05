# Use a simple Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json
COPY package.json ./

# Install dependencies
RUN npm install --no-package-lock express

# Copy the rest of the code
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]
