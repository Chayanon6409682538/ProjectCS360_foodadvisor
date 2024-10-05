#!/bin/bash

echo "Installing Node.js and npm"
sudo yum install curl -y
curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo -E bash - 
sudo yum install -y nodejs

# Verify installation node and npm
node -v
npm -v

echo "Installing Yarn..."
curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
sudo yum update
sudo yum install yarn -y

yarn --version

publicIPv4=$(curl ipinfo.io/ip)
secret=$(openssl rand -base64 32)

# Create an env file for API
apiENVLocation=./api/.env
echo HOST=0.0.0.0 > $apiENVLocation
echo PORT=1337 >> $apiENVLocation
echo STRAPI_ADMIN_CLIENT_URL=http://${publicIPv4}:3000 >> $apiENVLocation
echo STRAPI_ADMIN_CLIENT_PREVIEW_SECRET=${secret} >> $apiENVLocation

# Create an env file for Client
clientENVLocation=./client/.env
echo NEXT_PUBLIC_API_URL=http://${publicIPv4}:1337 > $clientENVLocation
echo PREVIEW_SECRET=${secret}  >> $clientENVLocation

echo "Starting the Strapi server..."
cd api
yarn && yarn seed && yarn build && yarn start &
cd ..

cd client
yarn && yarn build && yarn start &

echo "Strapi server is now running!"
echo "You can access to strapi backend at http://${publicIPv4}:1337"
echo "You can access to web application at http://${publicIPv4}:3000"
