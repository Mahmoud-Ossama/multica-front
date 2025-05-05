# Use a simple Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install Express first to make sure it's available
RUN npm init -y && npm install express

# Copy server file
COPY server.js ./

# Create a minimal index.html for testing
RUN mkdir -p build && echo '<html><body><h1>Multaqa Frontend</h1><p>Health check test</p></body></html>' > build/index.html

# Expose port
EXPOSE 8080

# Add debugging
RUN echo "Current directory: $(pwd)" && ls -la

# Start server
CMD ["node", "server.js"]
