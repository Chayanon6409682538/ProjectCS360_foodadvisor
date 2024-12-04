# Stage 1: Build Frontend
FROM node:16 AS frontend-build

WORKDIR /app/client

# Copy only necessary files for frontend
COPY client/package*.json ./
RUN npm install

COPY client/ ./
RUN npm run build

# Stage 2: Build Backend
FROM node:16 AS backend-build

WORKDIR /app/api

# Copy only necessary files for backend
COPY api/package*.json ./
RUN npm install

COPY api/ ./

# Copy built frontend to backend public folder
COPY --from=frontend-build /app/client/out /app/api/public

# Stage 3: Production Image
FROM node:16 AS production

WORKDIR /app

# Copy backend build with integrated frontend
COPY --from=backend-build /app/api ./

# Set environment variables
ENV NODE_ENV=production

# Install production dependencies only
RUN npm install --only=production

# Expose Backend port
EXPOSE 1337

# Expose Frontend port (3000)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
