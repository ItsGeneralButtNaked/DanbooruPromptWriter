# Use Node.js LTS (20 is stable)
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy dependency files first for better caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .

# Set env var so app knows it's inside Docker
ENV DOCKERIZED=true

# Expose the app's port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
