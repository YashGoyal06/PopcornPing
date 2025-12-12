# Stage 1: Build the React Frontend
FROM node:18 as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup the Backend and Serve
FROM node:18
WORKDIR /app
# Copy backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copy backend source code
COPY backend/ ./

# Copy built frontend files from Stage 1 to the backend folder
COPY --from=frontend-build /app/frontend/build ../frontend/build

# Expose Hugging Face's specific port
EXPOSE 7860

# Start the server
CMD ["node", "server.js"]