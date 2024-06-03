# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.0.0

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

# Copy package.json and package-lock.json before running npm ci
COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the necessary port
EXPOSE 3007

# Define the command to run the application
CMD ["node", "main.js", "${WALLET}", "${OPTION}", "${OPTION_VALUE}"]

