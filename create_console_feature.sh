#!/bin/bash

# Script to create console feature structure
# Usage: ./create_console_feature.sh <console-name> <console-title> <url-suffix>

CONSOLE_NAME=$1
CONSOLE_TITLE=$2
URL_SUFFIX=$3
PASCAL_CASE=$(echo $CONSOLE_NAME | sed 's/-\([a-z]\)/\U\1/g' | sed 's/^\([a-z]\)/\U\1/')

echo "Creating feature structure for $CONSOLE_NAME ($PASCAL_CASE)"

# Create directories
mkdir -p "src/features/$CONSOLE_NAME/types"
mkdir -p "src/features/$CONSOLE_NAME/composables"
mkdir -p "src/features/$CONSOLE_NAME/components"
mkdir -p "src/features/$CONSOLE_NAME/views"

echo "Directories created successfully"
