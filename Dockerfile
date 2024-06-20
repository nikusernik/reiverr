# Use ARM64 node image for pre-production stage
FROM node:18-alpine as pre-production

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy package files
COPY package.json .
COPY package-lock.json .

COPY backend/package.json ./backend/package.json
COPY backend/package-lock.json ./backend/package-lock.json

# Install dependencies
RUN npm i
RUN npm ci --prefix backend

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use ARM64 node image for production stage
FROM node:18-alpine as production

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy built files and dependencies from pre-production stage
COPY --from=pre-production /usr/src/app/backend/dist ./dist
COPY --from=pre-production /usr/src/app/backend/node_modules ./node_modules

# Copy package files
COPY backend/package.json .
COPY backend/package-lock.json .

# Create config directory and symbolic link
RUN mkdir -p ./config
RUN ln -s /usr/src/app/config /config

# Start the application in production mode
CMD [ "npm", "run", "start:prod" ]

# Uncomment for development stage
# FROM node:18 as development
#
# ENV NODE_ENV=development
#
# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app
#
# COPY package.json .
# COPY package-lock.json .
#
# RUN npm i
#
# RUN mkdir -p ./config
#
# RUN ln -s /usr/src/app/config /config
#
# CMD [ "npm", "run", "dev" ]
