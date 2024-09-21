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
sudo apt install curl -y
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs || sudo yum install -y nodejs

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

# Install Git
#echo "Installing Git..."
#sudo apt-get install -y git || sudo yum install -y git

# Check for Git
#echo "Checking for Git..."
#if ! command -v git &> /dev/null
#then
 #echo "Git not found. Please install Git and run this script again."
 #exit 1
#fi
#git --version

# Update system packages
echo "Updating system packages..."
sudo apt-get update -y || sudo yum update -y

# Clone the foodadvisor repository
#echo "Cloning the Foodadvisor repository..."
#git clone https://github.com/Chayanon6409682538/ProjectCS360_foodadvisor.git


# Navigate to directory
#cd ProjectCS360_foodadvisor

# Install project dependencies
#echo "Installing project dependencies..."
#yarn install

#Set public ip
cd client
echo "Enter your Public ip:"
read ip
echo NEXT_PUBLIC_API_URL=http://${ip}:1337 > .env
echo PREVIEW_SECRET=ARNFCb9zrC9ZHm5hZzCigWivD40icS4s  >> .env
#cat >> .env <<EOL
#NEXT_PUBLIC_API_URL==http://$ip:1337

cd ..

# Run backend
echo "Starting the Strapi server..."
cd api
yarn && yarn seed && yarn build && yarn start &
cd ..

#Run frontend
cd client
yarn && yarn build && yarn start

# Print successful message
#echo "Strapi server is now running!"
#echo "You can access it at http://${ip}:1337 or via the public EC2 IP"
