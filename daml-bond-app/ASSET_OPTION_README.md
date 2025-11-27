# Asset Option Application

A complete DAML implementation of financial options that allows holders to buy assets at predetermined strike prices before expiry dates. Built with DAML Autopilot.

## Overview

This application implements call options for any type of asset on the Canton network. An option gives the holder the right (but not the obligation) to purchase an underlying asset at a fixed strike price before the option expires.

### Key Features

- **Strike Price Control**: Lock in purchase prices for any asset type
- **Time-Bound Options**: Automatic expiry enforcement
- **Exercise & Settlement**: Complete workflow from option creation to asset transfer
- **Secondary Market Trading**: Transfer options between parties
- **Multi-Asset Support**: Works with bonds, stocks, tokens, or any DAML contract
- **Premium Pricing**: Built-in premium payment tracking

## Use Cases

### 1. Stock Purchase Options
Grant the right to buy company shares at a fixed price:
- **Grant**: Right to buy 100 TechCorp shares at $50/share
- **Premium**: $500 paid upfront
- **Expiry**: December 31, 2026
- **Benefit**: Holder can exercise if market price rises above $50

### 2. Bond Purchase Rights
Lock in favorable bond pricing:
- **Grant**: Right to buy $100k corporate bond at $95k (5% discount)
- **Premium**: $5,000
- **Expiry**: June 30, 2026
- **Benefit**: Secure bonds at below-market prices

### 3. Token Option Trading
Options can be traded in secondary markets:
- **Original**: Buy 1,000 tokens at $10k (pay $1k premium)
- **Secondary Sale**: Sell option to new buyer for $1.5k
- **Result**: Original buyer profits, new buyer gains purchase rights

## Architecture

### Templates

1. **AssetOptionProposal**
   - Issuer creates option offer
   - Holder can accept or reject
   - Includes all option terms

2. **AssetOption**
   - Active option contract
   - Can be exercised before expiry
   - Transferable to other parties

3. **OptionExercise**
   - Created when holder exercises
   - Awaits settlement by issuer

4. **OptionSettlement**
   - Final settlement record
   - Confirms asset transfer completion

5. **OptionTradeOffer**
   - Secondary market trading
   - Transfer options between parties

### Workflows

#### Option Creation
```daml
Issuer → AssetOptionProposal → Holder accepts → AssetOption
```

#### Option Exercise
```daml
AssetOption → Holder exercises → OptionExercise → Issuer settles → OptionSettlement
```

#### Secondary Trading
```daml
AssetOption → OptionTradeOffer → Buyer accepts → AssetOption (new holder)
```

## Quick Start

### Prerequisites
- DAML SDK 2.8.0 or later
- Canton network access

### Build the Application

```bash
cd daml-bond-app
daml build
```

### Run Test Scripts

**Basic Setup**:
```bash
daml script \
  --dar .daml/dist/*.dar \
  --script-name AssetOptionSetup:setup
```

**Full Exercise Workflow**:
```bash
daml script \
  --dar .daml/dist/*.dar \
  --script-name AssetOptionSetup:testOptionExercise
```

**Secondary Market Trading**:
```bash
daml script \
  --dar .daml/dist/*.dar \
  --script-name AssetOptionSetup:testOptionTrading
```

**Test Expiry Enforcement**:
```bash
daml script \
  --dar .daml/dist/*.dar \
  --script-name AssetOptionSetup:testOptionExpiry
```

**Multi-Option Portfolio**:
```bash
daml script \
  --dar .daml/dist/*.dar \
  --script-name AssetOptionSetup:testOptionPortfolio
```

## Code Examples

### Creating an Option

```daml
-- Define underlying asset
let asset = AssetDetails with
      assetId = "BOND-XYZ-2030"
      assetType = "Bond"
      description = "$100k 5% Corporate Bond"
      quantity = 100000.0

-- Issuer creates option proposal
proposalCid <- submit issuer do
  createCmd AssetOptionProposal with
    issuer
    holder = investor
    underlying = asset
    strikePrice = 95000.0    -- Buy at $95k
    currency = "USD"
    expiryDate = date 2026 Jun 30
    optionType = "Call"
    premium = 5000.0         -- Pay $5k premium
    issueDate = date 2025 Nov 27

-- Investor accepts and pays premium
optionCid <- submit investor do
  exerciseCmd proposalCid AcceptOption
```

### Exercising an Option

```daml
-- Investor exercises option before expiry
exerciseCid <- submit investor do
  exerciseCmd optionCid ExerciseOption with
    currentDate = date 2026 Mar 15

-- Issuer settles by transferring asset
settlementCid <- submit issuer do
  exerciseCmd exerciseCid SettleExercise with
    assetContractId = "BOND-CONTRACT-123"
```

### Trading an Option

```daml
-- Create trade offer
let optionData = OptionData with
      issuer
      underlying = asset
      strikePrice = 95000.0
      expiryDate = date 2026 Jun 30
      optionType = "Call"

tradeOfferCid <- submit originalHolder do
  createCmd OptionTradeOffer with
    optionData
    seller = originalHolder
    buyer = newBuyer
    offerPrice = 6000.0   -- Selling at premium
    currency = "USD"

-- New buyer accepts trade
newOptionCid <- submit newBuyer do
  exerciseCmd tradeOfferCid AcceptOptionTrade with
    optionCid
```

## Key Concepts

### Strike Price
The predetermined price at which the holder can purchase the underlying asset. This price is locked in when the option is created.

### Premium
The upfront cost paid by the option holder to the issuer for the right to buy the asset. This is paid regardless of whether the option is exercised.

### Expiry Date
The last date on which the option can be exercised. After this date, the option becomes worthless and cannot be exercised.

### Exercise
The act of invoking the option's right to purchase the asset at the strike price. This converts the option into an exercise contract awaiting settlement.

### Settlement
The final step where the issuer transfers the actual asset to the holder in exchange for the strike price.

## Testing

All test scripts are located in `AssetOptionSetup.daml`:

| Test Script | Description |
|------------|-------------|
| `setup` | Basic option creation and acceptance |
| `testOptionExercise` | Full lifecycle: create → exercise → settle |
| `testOptionTrading` | Secondary market transfer |
| `testOptionExpiry` | Verifies expiry enforcement (should fail) |
| `testOptionPortfolio` | Managing multiple options |

## API Integration

### Python Client Example

```python
from dazl import Network

network = Network()
network.set_config(url='http://localhost:6865')

@network.ledger_ready()
async def create_option(client):
    # Create option proposal
    await client.create('AssetOption:AssetOptionProposal', {
        'issuer': 'Alice',
        'holder': 'Bob',
        'underlying': {
            'assetId': 'STOCK-001',
            'assetType': 'Stock',
            'description': '100 shares',
            'quantity': '100.0'
        },
        'strikePrice': '5000.0',
        'currency': 'USD',
        'expiryDate': '2026-12-31',
        'optionType': 'Call',
        'premium': '500.0',
        'issueDate': '2025-11-27'
    })
```

### TypeScript Client Example

```typescript
import { Ledger } from '@daml/ledger';

const ledger = new Ledger({ token: 'your-token' });

// Create option proposal
await ledger.create(AssetOptionProposal, {
  issuer: 'Alice',
  holder: 'Bob',
  underlying: {
    assetId: 'STOCK-001',
    assetType: 'Stock',
    description: '100 shares',
    quantity: '100.0'
  },
  strikePrice: '5000.0',
  currency: 'USD',
  expiryDate: '2026-12-31',
  optionType: 'Call',
  premium: '500.0',
  issueDate: '2025-11-27'
});
```

## Security Considerations

### Authorization
- Only the issuer and holder are signatories on option contracts
- Exercise requires holder authorization
- Settlement requires issuer authorization
- Both parties must agree to cancel an option

### Expiry Enforcement
The contract enforces that options cannot be exercised after expiry:
```daml
assertMsg "Option has expired" (currentDate <= expiryDate)
```

### Price Validation
All monetary values must be positive:
```daml
ensure strikePrice > 0.0 && premium >= 0.0
```

## Production Deployment

### Canton Configuration

```hocon
canton {
  participants {
    participant1 {
      ledger-api {
        address = "0.0.0.0"
        port = 6865
      }
    }
  }
}
```

### Deploy to Canton

```bash
# Build DAR
daml build

# Deploy to Canton
canton -c canton.conf
```

## Limitations & Future Enhancements

### Current Limitations
- Only call options (buy rights) are fully implemented
- Put options (sell rights) structure exists but needs testing
- American-style exercise only (can exercise any time before expiry)
- No automatic exercise at expiry

### Potential Enhancements
- **European Options**: Only exercisable at expiry date
- **Automatic Exercise**: Auto-exercise in-the-money options at expiry
- **Put Options**: Complete implementation for selling rights
- **Option Chains**: Multiple strike prices for same underlying
- **Greeks Calculation**: Delta, gamma, theta, vega tracking
- **Margin Requirements**: Collateral management for option writers

## Support

For questions or issues:
- GitHub: [https://github.com/ChainSafe/canton-ci](https://github.com/ChainSafe/canton-ci)
- Documentation: See `daml-bond-app/` directory

## License

Open source - see repository for license details.

---

**Generated by DAML Autopilot** - Production-ready DAML applications in a single chat session.

