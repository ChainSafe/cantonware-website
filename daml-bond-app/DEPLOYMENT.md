# Deployment Guide - Fixed Rate Bond Application

This guide explains how to deploy the Fixed Rate Bond application to Canton.

## Prerequisites

- DAML SDK 3.4.0 or later
- Canton 3.4.0 or later
- Java 11 or later

## Local Development Deployment

### 1. Build the Application

```bash
cd daml-bond-app
daml build
```

This creates `.daml/dist/fixed-rate-bond-1.0.0.dar`

### 2. Run Test Scripts (Local IDE Ledger)

Test the bond issuance:
```bash
daml script --dar .daml/dist/fixed-rate-bond-1.0.0.dar \
  --script-name BondSetup:setup \
  --ide-ledger
```

Test the full lifecycle:
```bash
daml script --dar .daml/dist/fixed-rate-bond-1.0.0.dar \
  --script-name BondSetup:testBondLifecycle \
  --ide-ledger
```

### 3. Start Canton with Local Configuration

```bash
canton -c canton.conf
```

This will:
- Start a local sync domain (`bondDomain`)
- Start two participants: `issuerParticipant` and `investorParticipant`
- Automatically connect participants to the domain
- Upload the DAR file to all participants
- Allocate the initial parties (Issuer, Investor1, Investor2)

### 4. Verify Deployment

In the Canton console:

```scala
// List all uploaded DARs
issuerParticipant.dars.list()

// List all parties
issuerParticipant.parties.list()

// Check domain connection
issuerParticipant.domains.list_connected()
```

## Production Deployment

### 1. Upload DAR to Canton Participant

```scala
// In Canton console
participant.dars.upload("/path/to/fixed-rate-bond-1.0.0.dar")
```

### 2. Allocate Parties

```scala
// Create and enable parties
val issuer = participant.parties.enable("Issuer")
val investor1 = participant.parties.enable("Investor1")
val investor2 = participant.parties.enable("Investor2")
```

### 3. Grant User Rights (if using Canton user management)

```scala
// Create users and grant rights
participant.ledger_api.users.create(
  id = "issuer_user",
  actAs = Set(issuer),
  readAs = Set()
)

participant.ledger_api.users.create(
  id = "investor1_user",
  actAs = Set(investor1),
  readAs = Set()
)
```

### 4. Run Initial Setup Script

```bash
daml script \
  --dar .daml/dist/fixed-rate-bond-1.0.0.dar \
  --script-name BondSetup:setup \
  --ledger-host localhost \
  --ledger-port 4002
```

## API Integration

### Using Ledger API

The bond application can be integrated with external systems via the Canton Ledger API:

#### Connection Details
- **Issuer Participant**: `localhost:4002`
- **Investor Participant**: `localhost:4004`

#### Example: Create Bond Issuance Request (Python)

```python
from dazl import Network, create

async def issue_bond():
    network = Network()
    network.set_config(url='http://localhost:4002')
    
    async with network.aio_party('Issuer') as client:
        await client.submit_create(
            'FixedRateBond:BondIssuanceRequest',
            {
                'issuer': 'Issuer',
                'investor': 'Investor1',
                'isin': 'US1234567890',
                'currency': 'USD',
                'denomination': 100000.0,
                'issueDate': '2025-01-01',
                'maturityDate': '2030-01-01',
                'couponRate': 0.05,
                'couponFrequency': 2
            }
        )
```

### Using JSON API

Canton also provides a JSON API for HTTP-based integration:

```bash
# Start JSON API server
canton json-api \
  --ledger-host localhost \
  --ledger-port 4002 \
  --http-port 7575
```

Then interact via HTTP:

```bash
# Create bond issuance request
curl -X POST http://localhost:7575/v1/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "templateId": "FixedRateBond:BondIssuanceRequest",
    "payload": {
      "issuer": "Issuer",
      "investor": "Investor1",
      "isin": "US1234567890",
      "currency": "USD",
      "denomination": "100000.0",
      "issueDate": "2025-01-01",
      "maturityDate": "2030-01-01",
      "couponRate": "0.05",
      "couponFrequency": 2
    }
  }'
```

## Monitoring and Operations

### View Active Bonds

```scala
// In Canton console
participant.ledger_api.acs.filter(
  partyId = issuer,
  templateFilter = "FixedRateBond:Bond"
)
```

### View Coupon Payments

```scala
participant.ledger_api.acs.filter(
  partyId = issuer,
  templateFilter = "FixedRateBond:CouponPayment"
)
```

### Trigger Coupon Payment

From application code or Canton console:

```scala
// Get bond contract ID
val bonds = participant.ledger_api.acs.filter(issuer, "FixedRateBond:Bond")
val bondCid = bonds.head.contractId

// Exercise PayCoupon
participant.ledger_api.commands.submit(
  actAs = Seq(issuer),
  commands = Seq(
    exerciseCommand(bondCid, "PayCoupon", emptyRecord)
  )
)
```

## Backup and Recovery

### Export Ledger State

```bash
# Export ACS (Active Contract Set)
participant.export_acs("/path/to/backup/acs.json")
```

### Monitor Transaction Throughput

```scala
// View recent transactions
participant.ledger_api.transactions.flat(
  parties = Set(issuer),
  completeAfter = 100
)
```

## Troubleshooting

### Common Issues

1. **DAR Upload Failed**
   - Check DAML SDK version compatibility
   - Verify Canton participant is running
   - Check network connectivity

2. **Party Not Found**
   - Ensure parties are properly allocated
   - Verify party IDs match exactly (case-sensitive)

3. **Authorization Failures**
   - Check user rights are properly granted
   - Verify actAs and readAs permissions

4. **Contract Not Found**
   - Contract may have been archived
   - Query the ACS to see active contracts
   - Check if correct participant is being queried

### Enable Debug Logging

Add to Canton configuration:

```hocon
canton {
  monitoring.logging.api.message-payloads = true
  monitoring.logging.api.max-method-length = 1000
}
```

## Security Considerations

1. **Network Security**: Use TLS for production deployments
2. **Authentication**: Enable Canton authentication and authorization
3. **Access Control**: Properly manage party allocations and user rights
4. **Audit Trail**: All transactions are immutably recorded on the ledger
5. **Private Data**: Contract observers are limited to relevant parties only

## Performance Tuning

For high-throughput scenarios:

1. Use persistent storage instead of in-memory
2. Configure appropriate database connection pools
3. Enable command deduplication
4. Use batch submissions for multiple commands
5. Monitor Canton metrics and adjust resources

## Next Steps

- Integrate with frontend application
- Set up automated coupon payment triggers
- Implement pricing and yield calculations
- Add regulatory reporting features
- Set up monitoring and alerting

