# Use an official Node.js runtime as a parent image (LTS version is recommended)
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies (only production ones if you want smaller image size)
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (4040 by default in .env, but exposing it here for documentation)
EXPOSE 4040

# Define the command to run your app
# Using "node src/index.js" directly ensures it doesn't run with nodemon in production
CMD ["node", "src/index.js"]
