#!/bin/bash

if [ -z "$1" ]; then
  echo "Error: Migration name is required"
  echo "Usage: npm run migration:generate <migration-name>"
  exit 1
fi

nx run backend:migration:generate --name="$1"