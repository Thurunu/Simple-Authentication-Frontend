FROM node:22-alpine3.21

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install project dependencies, including Rollup
RUN npm install && npm install @rollup/rollup-linux-x64-musl

# Copy the rest of the project files
COPY . .

# Expose Vite's default dev server port
EXPOSE 5173

# Run the Vite development server with host binding
CMD ["npm", "run", "dev", "--", "--host"]
