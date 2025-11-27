# Fixed Rate Bond Application on Canton - Project Overview

## Executive Summary

This is a production-ready DAML application for managing fixed rate bonds on the Canton distributed ledger. The application provides complete lifecycle management including issuance, trading, coupon payments, and redemption at maturity.

### Key Features

✅ **Complete Bond Lifecycle**: From issuance to maturity  
✅ **Secure Trading**: Buyer-initiated trade offers with seller acceptance  
✅ **Automated Coupon Payments**: Periodic interest payments to bond holders  
✅ **Data Integrity**: Comprehensive validation and safety guarantees  
✅ **Privacy Preserving**: Only relevant parties see bond details  
✅ **Audit Trail**: Complete transaction history on Canton ledger  

## Architecture

### DAML Smart Contracts

The application consists of 5 main templates:

1. **Bond** - Core bond representation with all characteristics
2. **BondIssuanceRequest** - Two-party agreement for bond creation
3. **BondTradeOffer** - Buyer-initiated trading mechanism
4. **CouponPayment** - Record of interest payments
5. **BondRedemption** - Record of principal repayment at maturity

### Authorization Model

```
Bond Template:
  ├─ Signatory: Issuer (guarantees authenticity)
  └─ Observer: Current Investor (can view details)

BondIssuanceRequest:
  ├─ Signatory: Issuer (creates request)
  └─ Observer: Investor (can accept/reject)

BondTradeOffer:
  ├─ Signatory: Buyer (proposes purchase)
  └─ Observer: Seller (can accept)

CouponPayment & BondRedemption:
  ├─ Signatory: Issuer (creates payment record)
  └─ Observer: Investor (receives payment)
```

## Business Workflows

### 1. Bond Issuance Workflow

```
[Issuer] Creates BondIssuanceRequest
    ↓
[Investor] Reviews terms
    ↓
[Investor] Accepts → Bond contract created
    OR
[Investor] Rejects → Request archived
```

**Authorization**: 
- Issuer unilaterally creates request
- Investor must explicitly accept

### 2. Coupon Payment Workflow

```
[Issuer] Exercises PayCoupon on Bond
    ↓
System calculates: (denomination × couponRate) / frequency
    ↓
Creates CouponPayment record
    ↓
Updates Bond with next payment date
```

**Authorization**: 
- Only issuer can trigger payment
- Payment goes to current bond holder

**Frequency Support**:
- Annual (frequency = 1)
- Semi-annual (frequency = 2)
- Quarterly (frequency = 4)
- Monthly (frequency = 12)

### 3. Trading Workflow

```
[Buyer] Creates BondTradeOffer with price
    ↓
[Seller] Reviews offer
    ↓
[Seller] Accepts → Exercises AcceptTradeOffer
    ↓
System transfers bond to buyer
```

**Authorization**:
- Buyer proposes trade and commits to price
- Seller must own the bond to accept
- Transfer atomic with acceptance

### 4. Redemption Workflow

```
Bond reaches maturity date
    ↓
[Issuer] Exercises RedeemBond
    ↓
Creates BondRedemption record
    ↓
Returns principal to current holder
```

**Authorization**:
- Only issuer can redeem
- Only at or after maturity date

## Data Model

### Bond Fields

| Field | Type | Description |
|-------|------|-------------|
| issuer | Party | Bond issuer (corporation/government) |
| investor | Party | Current bond holder |
| isin | Text | International Securities ID |
| currency | Text | Currency (USD, EUR, etc.) |
| denomination | Decimal | Face value |
| issueDate | Date | When bond was issued |
| maturityDate | Date | When bond matures |
| couponRate | Decimal | Annual rate (0.05 = 5%) |
| couponFrequency | Int | Payments per year |
| nextCouponDate | Date | Next scheduled payment |
| outstandingPrincipal | Decimal | Remaining principal |

### Validation Rules

All monetary values enforced by DAML's `ensure` clause:

- ✅ denomination > 0
- ✅ 0 ≤ couponRate ≤ 1
- ✅ couponFrequency > 0
- ✅ outstandingPrincipal > 0
- ✅ maturityDate > issueDate
- ✅ nextCouponDate ≤ maturityDate

## Security & Privacy

### Authorization Guarantees

1. **Bond Creation**: Requires both issuer signature and investor acceptance
2. **Coupon Payments**: Only issuer can trigger
3. **Transfers**: Only current investor can initiate
4. **Trading**: Requires mutual agreement (buyer proposes, seller accepts)
5. **Redemption**: Only issuer at maturity

### Privacy Guarantees

1. **Visibility**: Only issuer and current investor see bond details
2. **Trade Offers**: Only buyer and seller see offer terms
3. **Payments**: Only issuer and recipient see payment records
4. **History**: Complete audit trail maintained on ledger

### Safety Properties

Guaranteed by DAML runtime:

- **Atomicity**: All state changes are atomic
- **No Double Spending**: A bond can't be transferred twice
- **Immutability**: Transaction history cannot be altered
- **Authorization**: All actions require proper signatures
- **Data Integrity**: Validation rules always enforced

## Deployment

### Local Development

```bash
cd daml-bond-app
./deploy.sh
```

### Canton Configuration

The `canton.conf` file provides:
- 1 sync domain (bondDomain)
- 2 participants (issuerParticipant, investorParticipant)
- Automatic DAR upload
- Initial party allocation

### Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Production Canton setup
- Party management
- User authentication
- API integration
- Monitoring and operations

## API Integration

### Ledger API (Python)

```python
from bond_client import BondClient

issuer = BondClient("Issuer")
await issuer.issue_bond_request(
    investor="Investor1",
    isin="US1234567890",
    denomination=100000.0,
    coupon_rate=0.05
)
```

### Ledger API (TypeScript)

```typescript
import { BondClient } from './bond-client';

const issuer = new BondClient('Issuer');
await issuer.issueBondRequest({
    investor: 'Investor1',
    isin: 'US1234567890',
    denomination: 100000.0,
    couponRate: 0.05
});
```

### JSON API (REST)

```bash
curl -X POST http://localhost:7575/v1/create \
  -H "Content-Type: application/json" \
  -d '{"templateId": "FixedRateBond:BondIssuanceRequest", ...}'
```

See [examples/README.md](examples/README.md) for complete API documentation.

## Testing

### Unit Tests (DAML Script)

```bash
# Test basic issuance
daml script --dar .daml/dist/fixed-rate-bond-1.0.0.dar \
  --script-name BondSetup:setup --ide-ledger

# Test full lifecycle
daml script --dar .daml/dist/fixed-rate-bond-1.0.0.dar \
  --script-name BondSetup:testBondLifecycle --ide-ledger
```

### Integration Tests

Python and TypeScript client examples include full workflow tests:

```bash
cd examples
python python-client.py  # Tests all workflows
```

## Performance Characteristics

### Transaction Throughput

- **Bond Issuance**: ~2 transactions (request + acceptance)
- **Coupon Payment**: 1 transaction (creates payment, updates bond)
- **Trading**: ~2 transactions (offer + acceptance)
- **Redemption**: 1 transaction

### Ledger Storage

- **Bond Contract**: ~500 bytes
- **Payment Record**: ~300 bytes
- **Trade Offer**: ~400 bytes

### Scalability

- Multiple bonds can be managed concurrently
- No shared state between different bonds
- Horizontal scaling via Canton's architecture

## Production Considerations

### Operational Requirements

1. **Automated Coupon Triggers**: Set up scheduled jobs to trigger payments
2. **Monitoring**: Track bond maturities and payment schedules
3. **Backup**: Regular ledger exports for disaster recovery
4. **Alerting**: Notify on failed transactions or missed payments

### Compliance & Regulatory

1. **Audit Trail**: Complete transaction history on immutable ledger
2. **Reporting**: Query ACS for regulatory reports
3. **KYC/AML**: Integrate party verification in issuance workflow
4. **Privacy**: GDPR-compliant (on-chain data is pseudonymous)

### Future Enhancements

#### Phase 2 Features
- [ ] Floating rate bonds
- [ ] Zero-coupon bonds
- [ ] Callable bonds (issuer can redeem early)
- [ ] Putable bonds (investor can force early redemption)

#### Phase 3 Features
- [ ] Bond defaults and restructuring
- [ ] Accrued interest calculations
- [ ] Yield-to-maturity calculations
- [ ] Integration with payment systems
- [ ] Secondary market price discovery

#### Phase 4 Features
- [ ] Bond indices and ETFs
- [ ] Credit default swaps
- [ ] Interest rate derivatives
- [ ] Cross-currency bonds

## Project Structure

```
daml-bond-app/
├── daml.yaml                    # DAML project configuration
├── canton.conf                  # Canton network configuration
├── deploy.sh                    # Deployment script
├── README.md                    # Getting started guide
├── OVERVIEW.md                  # This file
├── DEPLOYMENT.md                # Deployment guide
├── daml/
│   ├── FixedRateBond.daml      # Core bond templates
│   └── BondSetup.daml          # Test scripts
├── examples/
│   ├── python-client.py         # Python client
│   ├── typescript-client.ts     # TypeScript client
│   ├── requirements.txt         # Python dependencies
│   ├── package.json             # Node dependencies
│   └── README.md                # API documentation
└── .daml/
    └── dist/
        └── fixed-rate-bond-1.0.0.dar  # Compiled artifact
```

## Technical Specifications

### DAML SDK
- **Version**: 3.4.0-snapshot.20251013.0
- **LF Version**: Compatible with Canton 3.x

### Dependencies
- `daml-prim`: Core DAML primitives
- `daml-stdlib`: Standard library
- `daml-script`: Testing framework

### Canton Requirements
- **Minimum Version**: Canton 3.0
- **Recommended**: Canton 3.4 or later
- **Deployment**: Single domain, multi-participant

## Support & Documentation

### Resources

- **DAML Documentation**: https://docs.daml.com
- **Canton Documentation**: https://docs.daml.com/canton
- **Project README**: [README.md](README.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **API Examples**: [examples/README.md](examples/README.md)

### Getting Help

For questions or issues:
1. Check the troubleshooting section in DEPLOYMENT.md
2. Review example client code in `examples/`
3. Contact support@cantonware.com

## License

Copyright 2025 Cantonware

## Contributors

Built with ❤️ by the Cantonware team using Canton and DAML.

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Status**: Production Ready ✅

