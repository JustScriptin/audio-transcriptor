#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No color

# Function to print a list of items
print_items() {
  local items=("$@")
  for item in "${items[@]}"; do
    echo -e "  - ${item}"
  done
}

# Remove all stopped containers
stopped_containers=$(docker ps -a -q -f status=exited)
if [[ ! -z "$stopped_containers" ]]; then
  echo -e "${YELLOW}Removing the following stopped containers:${NC}"
  print_items $stopped_containers
  docker rm $stopped_containers &>/dev/null
  echo -e "${GREEN}Stopped containers removed.${NC}\n"
else
  echo -e "${GREEN}No stopped containers found.${NC}\n"
fi

# Remove all unused images
unused_images=$(docker images -q -f dangling=true)
if [[ ! -z "$unused_images" ]]; then
  echo -e "${YELLOW}Removing the following unused images:${NC}"
  print_items $unused_images
  docker rmi $unused_images &>/dev/null
  echo -e "${GREEN}Unused images removed.${NC}\n"
else
  echo -e "${GREEN}No unused images found.${NC}\n"
fi

# Remove all unused volumes
unused_volumes=$(docker volume ls -q -f dangling=true)
if [[ ! -z "$unused_volumes" ]]; then
  echo -e "${YELLOW}Removing the following unused volumes:${NC}"
  print_items $unused_volumes
  docker volume rm $unused_volumes &>/dev/null
  echo -e "${GREEN}Unused volumes removed.${NC}\n"
else
  echo -e "${GREEN}No unused volumes found.${NC}\n"
fi

# Remove all unused networks
unused_networks=$(docker network ls -q -f dangling=true)
if [[ ! -z "$unused_networks" ]]; then
  echo -e "${YELLOW}Removing the following unused networks:${NC}"
  print_items $unused_networks
  docker network rm $unused_networks &>/dev/null
  echo -e "${GREEN}Unused networks removed.${NC}\n"
else
  echo -e "${GREEN}No unused networks found.${NC}\n"
fi

# Remove build cache (since Docker 17.06.1)
echo -e "${YELLOW}Removing build cache...${NC}"
prune_output=$(docker builder prune --all --force 2>&1)
echo -e "${prune_output}"
echo -e "${GREEN}Build cache removed.${NC}\n"

# Output to show the process is complete
echo -e "${RED}Docker cache and data have been cleared.${NC}"