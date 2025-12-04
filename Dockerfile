# Build stage for client
FROM node:20-alpine AS client-builder

WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install client dependencies
RUN npm ci

# Copy client source
COPY client/ ./

# Set API URL for build - will be proxied through nginx
ENV NEXT_PUBLIC_API_URL=/api

# Build the Next.js app (standalone mode)
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install supervisor and nginx
RUN apk add --no-cache supervisor nginx

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

# Create nginx config
RUN mkdir -p /run/nginx
RUN echo 'worker_processes 1;' > /etc/nginx/nginx.conf && \
    echo 'events { worker_connections 1024; }' >> /etc/nginx/nginx.conf && \
    echo 'http {' >> /etc/nginx/nginx.conf && \
    echo '    include /etc/nginx/mime.types;' >> /etc/nginx/nginx.conf && \
    echo '    default_type application/octet-stream;' >> /etc/nginx/nginx.conf && \
    echo '    sendfile on;' >> /etc/nginx/nginx.conf && \
    echo '    keepalive_timeout 65;' >> /etc/nginx/nginx.conf && \
    echo '    server {' >> /etc/nginx/nginx.conf && \
    echo '        listen 80;' >> /etc/nginx/nginx.conf && \
    echo '        server_name _;' >> /etc/nginx/nginx.conf && \
    echo '        location /api {' >> /etc/nginx/nginx.conf && \
    echo '            proxy_pass http://127.0.0.1:5000;' >> /etc/nginx/nginx.conf && \
    echo '            proxy_http_version 1.1;' >> /etc/nginx/nginx.conf && \
    echo '            proxy_set_header Upgrade $http_upgrade;' >> /etc/nginx/nginx.conf && \
    echo '            proxy_set_header Connection "upgrade";' >> /etc/nginx/nginx.conf && \
    echo '            proxy_set_header Host $host;' >> /etc/nginx/nginx.conf && \
    echo '            proxy_set_header X-Real-IP $remote_addr;' >> /etc/nginx/nginx.conf && \
    echo '            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;' >> /etc/nginx/nginx.conf && \
    echo '            proxy_set_header X-Forwarded-Proto $scheme;' >> /etc/nginx/nginx.conf && \
    echo '        }' >> /etc/nginx/nginx.conf && \
    echo '        location / {' >> /etc/nginx/nginx.conf && \
    echo '            proxy_pass http://127.0.0.1:3000;' >> /etc/nginx/nginx.conf && \
    echo '            proxy_http_version 1.1;' >> /etc/nginx/nginx.conf && \
    echo '            proxy_set_header Upgrade $http_upgrade;' >> /etc/nginx/nginx.conf && \
    echo '            proxy_set_header Connection "upgrade";' >> /etc/nginx/nginx.conf && \
    echo '            proxy_set_header Host $host;' >> /etc/nginx/nginx.conf && \
    echo '            proxy_set_header X-Real-IP $remote_addr;' >> /etc/nginx/nginx.conf && \
    echo '            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;' >> /etc/nginx/nginx.conf && \
    echo '            proxy_set_header X-Forwarded-Proto $scheme;' >> /etc/nginx/nginx.conf && \
    echo '        }' >> /etc/nginx/nginx.conf && \
    echo '    }' >> /etc/nginx/nginx.conf && \
    echo '}' >> /etc/nginx/nginx.conf

# Create supervisor config
RUN mkdir -p /etc/supervisor.d
RUN echo '[supervisord]' > /etc/supervisor.d/app.ini && \
    echo 'nodaemon=true' >> /etc/supervisor.d/app.ini && \
    echo '' >> /etc/supervisor.d/app.ini && \
    echo '[program:nginx]' >> /etc/supervisor.d/app.ini && \
    echo 'command=nginx -g "daemon off;"' >> /etc/supervisor.d/app.ini && \
    echo 'autostart=true' >> /etc/supervisor.d/app.ini && \
    echo 'autorestart=true' >> /etc/supervisor.d/app.ini && \
    echo 'stdout_logfile=/dev/stdout' >> /etc/supervisor.d/app.ini && \
    echo 'stdout_logfile_maxbytes=0' >> /etc/supervisor.d/app.ini && \
    echo 'stderr_logfile=/dev/stderr' >> /etc/supervisor.d/app.ini && \
    echo 'stderr_logfile_maxbytes=0' >> /etc/supervisor.d/app.ini && \
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

# Expose port 80 for nginx
EXPOSE 80

# Start supervisor
CMD ["supervisord", "-c", "/etc/supervisor.d/app.ini"]
