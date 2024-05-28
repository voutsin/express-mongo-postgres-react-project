# ./frontend/Dockerfile

# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /frontend

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React application
RUN npm run build

# Expose the port the app runs on
EXPOSE ${FRONTEND_PORT}

# Start the app
CMD ["npm", "start"]