# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=16.16.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="NodeJS"

# NodeJS app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
# Install node modules

COPY --link package.json package-lock.json .env .
RUN npm install

# Copy application code
COPY --link . .

# Final stage for app image
#FROM base
FROM gcr.io/distroless/nodejs
WORKDIR /app
# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
CMD [ "server.js" ]