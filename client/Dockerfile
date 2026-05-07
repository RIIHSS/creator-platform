# Stage 1: Build the React app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
# We use a wildcard to ensure both package.json AND package-lock.json are copied if they exist
COPY package*.json ./

# ✅ FIX: Changed 'npm ci' to 'npm install'
# npm ci is very strict and fails if package-lock.json is missing or out of sync.
# npm install will regenerate what it needs and is better for troubleshooting.
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the production-ready static files
RUN npm run build 

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80