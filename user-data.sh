#!/bin/bash
set -e  # Stop the script if any command fails

# Update the package manager and install Docker
echo "Updating system packages..."
sudo yum update -y

echo "Installing Docker..."
sudo yum install -y docker

# Enable Docker to start on boot and start the Docker service
echo "Starting Docker service..."
sudo systemctl enable docker
sudo systemctl start docker

# Add the ec2-user to the docker group to allow running Docker without sudo
echo "Adding ec2-user to docker group..."
sudo usermod -aG docker ec2-user

# Fetch the EC2 public IP from the metadata service
EC2_PUBLIC_IP=$(curl -s http://ifconfig.me)

# Generate the PREVIEW_SECRET (a random 32-byte hexadecimal string)
secret=$(openssl rand -base64 32)

# Output the EC2 public IP
echo "Setup complete. Docker container is running."
echo "EC2 Public IP Address: $EC2_PUBLIC_IP"
echo "Generated PREVIEW_SECRET: $secret"

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

# Run the Strapi Docker container
echo "Running Strapi Docker container..."
sudo docker run -d -p 1337:1337 chayanonkhanrit/cs360_foodadvisor_api:latest

# Run the Next.js client Docker container
echo "Running Next.js client Docker container..."
sudo docker run -d -p 3000:3000 chayanonkhanrit/cs360_foodadvisor_client:latest
