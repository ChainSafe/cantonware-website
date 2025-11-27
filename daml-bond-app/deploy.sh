#!/bin/bash
# Deployment script for Fixed Rate Bond Application on Canton

set -e

echo "🔨 Building DAML project..."
daml build

echo "✅ Build complete!"
echo "📦 DAR file: .daml/dist/fixed-rate-bond-1.0.0.dar"

echo ""
echo "🚀 Deployment Options:"
echo ""
echo "Option 1: Local Canton (for development/testing)"
echo "  canton -c canton.conf"
echo ""
echo "Option 2: Remote Canton deployment"
echo "  1. Upload DAR via Canton console:"
echo "     participant.dars.upload(\".daml/dist/fixed-rate-bond-1.0.0.dar\")"
echo "  2. Allocate parties:"
echo "     participant.parties.enable(\"Issuer\")"
echo "     participant.parties.enable(\"Investor1\")"
echo "     participant.parties.enable(\"Investor2\")"
echo ""
echo "Option 3: Run test scripts"
echo "  daml script --dar .daml/dist/fixed-rate-bond-1.0.0.dar --script-name BondSetup:setup --ide-ledger"
echo "  daml script --dar .daml/dist/fixed-rate-bond-1.0.0.dar --script-name BondSetup:testBondLifecycle --ide-ledger"
echo ""

