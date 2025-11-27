# Quick Start Guide - Fixed Rate Bond Application

Get up and running with the Fixed Rate Bond application in 5 minutes!

## Prerequisites

- DAML SDK 3.4.0 or later ([Install](https://docs.daml.com/getting-started/installation.html))
- Canton 3.4.0 or later (optional, for local deployment)

## Step 1: Build the Application (30 seconds)

```bash
cd daml-bond-app
daml build
```

✅ Expected output: `.daml/dist/fixed-rate-bond-1.0.0.dar`

## Step 2: Run Tests (1 minute)

Test the bond issuance workflow:

```bash
daml script --dar .daml/dist/fixed-rate-bond-1.0.0.dar \
  --script-name BondSetup:setup \
  --ide-ledger
```

✅ Expected output: `"Bond successfully issued!"`

Test the complete lifecycle:

```bash
daml script --dar .daml/dist/fixed-rate-bond-1.0.0.dar \
  --script-name BondSetup:testBondLifecycle \
  --ide-ledger
```

✅ Expected output:
```
"Step 1: Bond issued to Investor1"
"Step 2: First coupon paid"
"Step 3: Trade offer created by buyer"
"Step 4: Bond transferred to Investor2"
"Step 5: Second coupon paid to new investor"
```

## Step 3: Explore the Code (2 minutes)

### Main Bond Template

```daml
-- daml/FixedRateBond.daml

template Bond
  with
    issuer : Party
    investor : Party
    isin : Text
    denomination : Decimal
    couponRate : Decimal
    -- ... more fields
  where
    signatory issuer
    observer investor
    
    choice TransferBond : ContractId Bond
    choice PayCoupon : (ContractId Bond, ContractId CouponPayment)
    choice RedeemBond : ContractId BondRedemption
```

### Key Workflows

1. **Issuance**: `BondIssuanceRequest` → Investor accepts → `Bond` created
2. **Coupon**: Issuer exercises `PayCoupon` → `CouponPayment` created
3. **Trading**: Buyer creates `BondTradeOffer` → Seller accepts → Bond transferred
4. **Maturity**: Issuer exercises `RedeemBond` → `BondRedemption` created

## Step 4: Deploy to Canton (Optional, 2 minutes)

If you have Canton installed:

```bash
canton -c canton.conf
```

This will:
- Start a local Canton network
- Upload the bond application
- Allocate parties (Issuer, Investor1, Investor2)

## Step 5: Try the Client Examples (Optional)

### Python Client

```bash
cd examples
pip install -r requirements.txt
python python-client.py
```

### TypeScript Client

```bash
cd examples
npm install
npm start
```

## What's Next?

### Learn More
- 📖 [README.md](README.md) - Detailed feature documentation
- 🏗️ [OVERVIEW.md](OVERVIEW.md) - Architecture and design
- 🚀 [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment guide
- 💻 [examples/README.md](examples/README.md) - API integration guide

### Customize the Application

1. **Add New Bond Types**
   - Edit `daml/FixedRateBond.daml`
   - Add new templates or choices
   - Rebuild with `daml build`

2. **Modify Coupon Calculation**
   - Update the `PayCoupon` choice in `Bond` template
   - Add accrued interest, day count conventions, etc.

3. **Add Regulatory Features**
   - Create new templates for compliance
   - Add KYC/AML verification workflows

### Integrate with Your Application

Choose your integration method:

1. **Ledger API** (Python/TypeScript) - Full type safety
2. **JSON API** (REST) - Language agnostic
3. **WebSocket** - Real-time updates

See [examples/README.md](examples/README.md) for code samples.

## Common Issues

### Build Failed

```bash
# Check DAML SDK version
daml version

# Update to latest
daml install latest
```

### Script Execution Failed

```bash
# Ensure you're using --ide-ledger flag
daml script --dar <dar-file> --script-name <script> --ide-ledger
```

### Canton Connection Failed

```bash
# Check if Canton is running
ps aux | grep canton

# Check configuration
cat canton.conf
```

## Example: Create Your First Bond

```bash
# 1. Build
daml build

# 2. Start DAML Studio (optional - for interactive development)
daml studio

# 3. Run the setup script
daml script \
  --dar .daml/dist/fixed-rate-bond-1.0.0.dar \
  --script-name BondSetup:setup \
  --ide-ledger

# 4. View the output
# You should see: "Bond successfully issued!"
```

## Understanding the Output

When you run tests, you'll see:

```
[DA.Internal.Prelude:555]: "Bond successfully issued!"
```

This means:
- ✅ Bond issuance request was created
- ✅ Investor accepted the request
- ✅ Bond contract is now active on the ledger

## Architecture at a Glance

```
┌─────────────────────────────────────────┐
│         DAML Smart Contracts            │
│  (FixedRateBond.daml)                  │
│                                         │
│  • Bond                                 │
│  • BondIssuanceRequest                 │
│  • BondTradeOffer                      │
│  • CouponPayment                       │
│  • BondRedemption                      │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│      Canton Distributed Ledger          │
│                                         │
│  • Issuer Participant                  │
│  • Investor Participants               │
│  • Sync Domain                         │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│         Client Applications             │
│                                         │
│  • Python Client (dazl)                │
│  • TypeScript Client (@daml/ledger)    │
│  • JSON API (REST)                     │
└─────────────────────────────────────────┘
```

## Key Concepts

### DAML Templates
Think of templates as smart contract classes. Each template defines:
- **Data**: Fields like `denomination`, `couponRate`
- **Authorization**: Who can create/view (`signatory`, `observer`)
- **Actions**: What can be done (`choice`)

### Choices
Actions that parties can take on contracts:
- `TransferBond` - Investor transfers to another party
- `PayCoupon` - Issuer pays interest
- `RedeemBond` - Issuer returns principal at maturity

### Parties
Pseudonymous identities on the ledger:
- `Issuer` - Creates and manages bonds
- `Investor` - Holds bonds and receives payments

### Contract IDs
Unique identifiers for active contracts:
- Used to reference specific bond instances
- Required when exercising choices

## Quick Reference

### Build Commands

```bash
daml build                    # Compile DAML to DAR
daml clean                    # Clean build artifacts
daml studio                   # Open in IDE
```

### Test Commands

```bash
# Run specific script
daml script --dar <dar> --script-name <module>:<function> --ide-ledger

# Run with specific participant
daml script --dar <dar> --script-name <script> --ledger-host localhost --ledger-port 4002
```

### Canton Commands

```bash
canton -c canton.conf         # Start Canton
canton -c canton.conf --auto-connect-local  # With auto-connect
canton daemon                 # Run as daemon
```

## Need Help?

- 📧 Email: support@cantonware.com
- 📚 Docs: https://docs.daml.com
- 🐛 Issues: Check DEPLOYMENT.md troubleshooting section

## Next Steps

1. ✅ Complete this quick start
2. 📖 Read [OVERVIEW.md](OVERVIEW.md) for architecture details
3. 🚀 Follow [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
4. 💻 Explore [examples/](examples/) for API integration
5. 🎨 Customize the application for your use case

---

**Time to complete**: 5 minutes  
**Difficulty**: Beginner  
**Prerequisites**: DAML SDK installed

Happy building! 🚀
