#!/usr/bin/env bash
set -euo pipefail

# Bootstrap script for Ubuntu-based EC2 instances
# Installs Docker Engine, Docker Compose plugin, and prepares ~/deploy directory.

echo "==> Updating apt and installing prerequisites"
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg lsb-release

echo "==> Installing Docker Engine"
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "==> Enabling docker service"
sudo systemctl enable --now docker

echo "==> Adding current user to docker group (may require re-login)"
if id -nG "$USER" | grep -qw docker; then
  echo "user $USER already in docker group"
else
  sudo usermod -aG docker "$USER"
  echo "added $USER to docker group (re-login required to apply group membership)"
fi

echo "==> Creating deploy directory"
mkdir -p ~/deploy
echo "bootstrap complete"

echo "Next steps:"
echo " - ensure EC2 has IAM role for ECR pull (recommended) or provide AWS credentials"
echo " - upload docker-compose.prod.yml and .env to ~/deploy (workflow can copy it)"
echo " - run: docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d"
