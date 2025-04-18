# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port (assure-toi qu'il correspond à celui dans index.js)
EXPOSE 4002

# Start the app
CMD ["node", "index.js"]
