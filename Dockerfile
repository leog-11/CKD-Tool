# Use the official Bun image from Oven
FROM oven/bun:latest

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN bun install

# Copy the rest of the project files
COPY . .

# Expose a port (optional, if you add a server later)
EXPOSE 3000

# Command to run the app
CMD ["bun", "run", "start"]