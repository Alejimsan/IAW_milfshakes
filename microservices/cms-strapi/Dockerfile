FROM node:18-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ postgresql-client

# Copy package files
COPY package*.json ./

# Install dependencies with production flag
RUN npm install --production

# Copy application code
COPY . .

# Build Strapi admin panel
RUN npm run build

# Create data directory for SQLite fallback
RUN mkdir -p .tmp/data

# Expose Strapi port
EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:1337/admin', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start Strapi
CMD ["npm", "start"]
