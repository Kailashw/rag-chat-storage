# Use official Node.js image
FROM node:22

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the project
RUN npm run build
RUN npx prisma generate

# Expose the NestJS port
EXPOSE 3000

# Run the app
CMD ["node", "dist/main"]
