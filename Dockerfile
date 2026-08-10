# ==========================================
# Build Stage: Compile TypeScript to JavaScript
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json tsconfig.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm ci

# Copy application source code
COPY . .

# Compile TypeScript to JavaScript (outputs to ./dist)
RUN npm run build

# ==========================================
# Production Stage: Minimal Runtime Image
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy dependency manifests
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production

# Copy compiled JavaScript code from the builder stage
COPY --from=builder /app/dist ./dist

# Standard start command (overridden by entrypoint in docker-compose)
CMD ["node", "dist/index.js"]