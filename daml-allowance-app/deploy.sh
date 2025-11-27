#!/bin/bash

# Deployment script for Kids Allowance App
set -e

echo "======================================"
echo "Kids Allowance App - Deployment"
echo "======================================"

# Build the DAR file
echo "Building DAR file..."
daml build

# Start Canton (if not already running)
echo "Starting Canton..."
canton daemon -c canton.conf &
CANTON_PID=$!

# Wait for Canton to be ready
echo "Waiting for Canton to start..."
sleep 10

# Upload DAR to Canton
echo "Uploading DAR to Canton..."
DAR_FILE=".daml/dist/allowance-app-1.0.0.dar"

# Use Canton console to upload and initialize
canton -c canton.conf <<EOF
participant1.domains.connect_local("local")
participant1.dars.upload("$DAR_FILE")
EOF

echo ""
echo "======================================"
echo "Deployment Complete!"
echo "======================================"
echo ""
echo "Ledger API available at: localhost:6865"
echo "Canton Admin API at: localhost:6866"
echo ""
echo "Next steps:"
echo "1. Run the setup script: daml script --dar .daml/dist/allowance-app-1.0.0.dar --script-name AllowanceSetup:setupAllowanceSystem --ledger-host localhost --ledger-port 6865"
echo "2. Or run examples: daml script --dar .daml/dist/allowance-app-1.0.0.dar --script-name AllowanceSetup:completeWorkflow --ledger-host localhost --ledger-port 6865"
echo ""
echo "To stop Canton: kill $CANTON_PID"

