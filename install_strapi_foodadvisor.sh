#!/bin/bash

OS="$(uname)"
if [ "$OS" = "Linux" ]; then
    echo "Running on Linux"
# Linux-specific commands
else
    echo "Operating system not supported."
    exit 1
fi

# Install Node.js and npm
echo "Installing Node.js and npm"
sudo yum install curl -y
curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo -E bash - 
sudo apt install -y nodejs || sudo yum install -y nodejs

# Check for Node.js and npm
echo "Checking for Node.js..."
if ! command -v node &> /dev/null
then
    echo "Node.js not found. Please install Node.js and npm, then run
    this script again."
    exit 1
fi

# Verify installation node and npm
node -v
npm -v

# Install Yarn
echo "Installing Yarn..."
sudo apt install yarn -y || sudo yum install yarn -y

#Check Yarn Version
echo "Checking for Yarn..."
if ! command yarn --version &> /dev/null
then
    echo "Yarnnot found. Please install Yarn and run this script again."
    exit 1
fi
yarn --version


# Update system packages
echo "Updating system packages..."
sudo apt update -y || sudo yum update -y


publicIPv4=$(curl ipinfo.io/ip)
secret=$(openssl rand -base64 32)

#Setup .env
#Set public ip backend
touch api/.env
echo HOST=0.0.0.0 > api/.env
echo PORT=1337 >> api/.env
echo STRAPI_ADMIN_CLIENT_URL=http://${publicIPv4}:3000 >> api/.env
echo STRAPI_ADMIN_CLIENT_PREVIEW_SECRET=${secret} >> api/.env

#Set public ip frontend
touch client/.env
echo NEXT_PUBLIC_API_URL=http://${publicIPv4}:1337 > client/.env
echo PREVIEW_SECRET=${secret}  >> client/.env


# Run backend
echo "Starting the Strapi server..."
cd api
yarn && yarn seed && yarn build && yarn start &
cd ..

#Run frontend
cd client
yarn && yarn build && yarn start

#Print successful message
echo "Strapi server is now running!"
echo "You can access to strapi backend at http://${publicIPv4}:1337"
echo "You can access to web application at http://${publicIPv4}:3000"
