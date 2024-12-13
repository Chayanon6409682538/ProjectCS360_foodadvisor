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
