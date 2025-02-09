# Build stage for static site
FROM node:20.16.0-slim AS builder

WORKDIR /build

# Install htmlc and other build dependencies
RUN npm install -g @sojs_coder/htmlc@1.3.5

# Copy only package files first to leverage cache
COPY server/package.json ./server/
COPY static/roms/package*.json ./static/roms/
COPY package*.json ./

# Install dependencies
RUN cd server && npm install
RUN cd static/roms && npm install
RUN npm install

# Copy source files
COPY . .

# Build static site
RUN node generate_sitemap.js
RUN cd static/roms && node build.js
RUN htmlc static --out=build
RUN node modify_gitattr.js && \
    cp .gitattributes build/.gitattributes

# Production stage
FROM node:20.16.0-slim

WORKDIR /usr/local/ccported

# Install nginx and clean up in one layer
RUN apt-get update && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/* && \
    rm /etc/nginx/sites-enabled/default

# Copy nginx config
COPY server/nginx.conf /etc/nginx/sites-enabled/

# Copy built static files
COPY --from=builder /build/build /usr/share/nginx/html/

# Create IS_HOSTED.txt
RUN echo "===is_hosted===" > /usr/share/nginx/html/IS_HOSTED.txt

# Copy only the necessary server files
COPY server/package.json ./
RUN npm install --production

COPY server/client.js ./
COPY server/index.js ./

# Set environment variables
ENV node_env=production \
    port=3000

# Expose ports
EXPOSE 80 3000

# Start nginx and node
CMD sh -c "service nginx start && node index.js"