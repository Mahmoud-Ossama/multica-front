# Use a minimal Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only the necessary server file
COPY server.js ./

# Print Node.js version for debugging
RUN node --version && \
    echo "Current directory: $(pwd)" && \
    ls -la

# Expose port
EXPOSE 8080

# Use CMD instead of ENTRYPOINT to allow Railway to override if needed
CMD ["node", "server.js"]
