# Use Node.js as the base image
FROM node:16

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy application code
COPY . .


# Expose the port the app runs on
EXPOSE 1337

# Command to run the application
CMD ["sh", "-c", "yarn seed && yarn build && yarn start"]
