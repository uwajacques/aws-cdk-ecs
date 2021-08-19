# Build AdonisJS
FROM node:16-alpine as builder

# Set directory for all files
WORKDIR /home/node
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --production


# Install prod packages on different step
FROM node:16-alpine as installer
WORKDIR /home/node
COPY package*.json ./
RUN npm ci --only=production


# Build final runtime container
FROM node:16-alpine

ENV NODE_ENV=production
ENV ENV_SILENT=true
ENV HOST=0.0.0.0
ENV APP_NAME=adonis-app
ENV CACHE_VIEWS=true
ENV SESSION_DRIVER=cookie
ENV PORT=3333
ENV APP_KEY=

# Install deps required for this project
RUN apk add --no-cache ffmpeg
# Use non-root user
USER node

# Set working directory
WORKDIR /home/node
COPY --from=builder /home/node/build ./build
COPY --from=installer /home/node/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3333
# Start server up
CMD [ "node", "./build/server.js" ]
