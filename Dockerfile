# Build stage for client
FROM node:20-alpine AS client-builder

WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install client dependencies
RUN npm ci

# Copy client source
COPY client/ ./

# Set API URL for build
ENV NEXT_PUBLIC_API_URL=/api

# Build the Next.js app (standalone mode)
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install supervisor for running multiple processes
RUN apk add --no-cache supervisor

# Copy server package files and install dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production

# Copy server source
COPY server/ ./

# Copy Next.js standalone build
WORKDIR /app
COPY --from=client-builder /app/client/.next/standalone ./client/
COPY --from=client-builder /app/client/.next/static ./client/.next/static
COPY --from=client-builder /app/client/public ./client/public

# Create supervisor config
RUN mkdir -p /etc/supervisor.d
RUN echo '[supervisord]' > /etc/supervisor.d/app.ini && \
    echo 'nodaemon=true' >> /etc/supervisor.d/app.ini && \
    echo '' >> /etc/supervisor.d/app.ini && \
    echo '[program:api]' >> /etc/supervisor.d/app.ini && \
    echo 'command=node /app/server/server.js' >> /etc/supervisor.d/app.ini && \
    echo 'directory=/app/server' >> /etc/supervisor.d/app.ini && \
    echo 'autostart=true' >> /etc/supervisor.d/app.ini && \
    echo 'autorestart=true' >> /etc/supervisor.d/app.ini && \
    echo 'stdout_logfile=/dev/stdout' >> /etc/supervisor.d/app.ini && \
    echo 'stdout_logfile_maxbytes=0' >> /etc/supervisor.d/app.ini && \
    echo 'stderr_logfile=/dev/stderr' >> /etc/supervisor.d/app.ini && \
    echo 'stderr_logfile_maxbytes=0' >> /etc/supervisor.d/app.ini && \
    echo 'environment=NODE_ENV=production,PORT=5000' >> /etc/supervisor.d/app.ini && \
    echo '' >> /etc/supervisor.d/app.ini && \
    echo '[program:frontend]' >> /etc/supervisor.d/app.ini && \
    echo 'command=node /app/client/server.js' >> /etc/supervisor.d/app.ini && \
    echo 'directory=/app/client' >> /etc/supervisor.d/app.ini && \
    echo 'autostart=true' >> /etc/supervisor.d/app.ini && \
    echo 'autorestart=true' >> /etc/supervisor.d/app.ini && \
    echo 'stdout_logfile=/dev/stdout' >> /etc/supervisor.d/app.ini && \
    echo 'stdout_logfile_maxbytes=0' >> /etc/supervisor.d/app.ini && \
    echo 'stderr_logfile=/dev/stderr' >> /etc/supervisor.d/app.ini && \
    echo 'stderr_logfile_maxbytes=0' >> /etc/supervisor.d/app.ini && \
    echo 'environment=NODE_ENV=production,PORT=3000,HOSTNAME=0.0.0.0' >> /etc/supervisor.d/app.ini

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV FRONTEND_URL=http://localhost:3000

# Expose port (CapRover will use port 80)
EXPOSE 5000

# Start supervisor
CMD ["supervisord", "-c", "/etc/supervisor.d/app.ini"]
