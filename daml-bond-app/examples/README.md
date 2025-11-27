# Client Examples - Fixed Rate Bond Application

This directory contains example client implementations for interacting with the Fixed Rate Bond application.

## Available Clients

### Python Client (`python-client.py`)

A complete Python implementation using the `dazl` library for Ledger API interaction.

#### Installation

```bash
pip install -r requirements.txt
```

#### Usage

```bash
# Ensure Canton is running and the bond application is deployed
python python-client.py
```

#### Features

- Issue bonds
- Accept bond issuance
- Pay coupons
- Transfer bonds
- Create and accept trade offers
- Query active bonds and coupon payments

### TypeScript Client (`typescript-client.ts`)

A TypeScript implementation using the `@daml/ledger` library.

#### Installation

```bash
npm install
```

#### Code Generation

Generate TypeScript types from DAML code:

```bash
cd ..
daml codegen js -o examples/daml-types .daml/dist/fixed-rate-bond-1.0.0.dar
```

#### Usage

```bash
npm start
```

## API Overview

### BondClient Class

Both implementations provide a `BondClient` class with the following methods:

#### Issuer Operations

- `issueBondRequest()` - Create a new bond issuance request
- `payCoupon()` - Pay coupon to current bond holder
- `redeemBond()` - Redeem bond at maturity

#### Investor Operations

- `acceptBondIssuance()` - Accept a bond issuance request
- `transferBond()` - Transfer bond to another party
- `createTradeOffer()` - Create an offer to buy a bond
- `acceptTradeOffer()` - Accept a trade offer to sell a bond

#### Query Operations

- `listActiveBonds()` - List all active bonds
- `listCouponPayments()` - List all coupon payments
- `listTradeOffers()` - List active trade offers

## Example Workflows

### 1. Bond Issuance

```python
# Issuer creates request
request_cid = await issuer_client.issue_bond_request(
    investor="Investor1",
    isin="US1234567890",
    currency="USD",
    denomination=100000.0,
    issue_date=date(2025, 1, 1),
    maturity_date=date(2030, 1, 1),
    coupon_rate=0.05,
    coupon_frequency=2
)

# Investor accepts
bond_cid = await investor_client.accept_bond_issuance(request_cid)
```

### 2. Coupon Payment

```python
# Issuer pays coupon
await issuer_client.pay_coupon(bond_cid)

# View payments
payments = await investor_client.list_coupon_payments()
```

### 3. Bond Trading

```python
# Buyer creates offer
offer_cid = await buyer_client.create_trade_offer(
    seller="Investor1",
    price=102000.0,
    currency="USD",
    bond_data={
        "issuer": "Issuer",
        "isin": "US1234567890",
        "denomination": "100000.0",
        "maturityDate": "2030-01-01"
    }
)

# Seller accepts
new_bond_cid = await seller_client.accept_trade_offer(offer_cid, bond_cid)
```

## Authentication

Both clients require authentication with the Canton ledger. Update the following:

### Python

The `dazl` library handles authentication automatically when using Canton's development mode.

For production, configure JWT tokens:

```python
network = Network()
network.set_config(
    url=f"http://{host}:{port}",
    access_token="YOUR_JWT_TOKEN"
)
```

### TypeScript

Update the `TOKEN` constant in `typescript-client.ts`:

```typescript
const TOKEN = 'YOUR_JWT_TOKEN_HERE';
```

To generate a token, use Canton console:

```scala
participant.ledger_api.users.rights.grant(
  userId = "user1",
  actAs = Set("Investor1")
)

participant.ledger_api.auth.get_token("user1")
```

## Configuration

### Connection Settings

Both clients connect to `localhost:4002` by default. Modify these values:

**Python:**
```python
LEDGER_HOST = "your-canton-host"
LEDGER_PORT = 4002
```

**TypeScript:**
```typescript
const LEDGER_HOST = 'your-canton-host';
const LEDGER_PORT = 4002;
```

## REST API Alternative

For non-Python/TypeScript clients, use Canton's JSON API:

### Start JSON API

```bash
canton json-api \
  --ledger-host localhost \
  --ledger-port 4002 \
  --http-port 7575
```

### Example: Create Bond Request

```bash
curl -X POST http://localhost:7575/v1/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
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

### Example: Exercise Choice

```bash
curl -X POST http://localhost:7575/v1/exercise \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "templateId": "FixedRateBond:Bond",
    "contractId": "CONTRACT_ID_HERE",
    "choice": "PayCoupon",
    "argument": {}
  }'
```

## WebSocket Streaming

Subscribe to contract updates in real-time:

### Python (using websockets)

```python
import websockets
import json

async def stream_bonds():
    uri = "ws://localhost:7575/v1/stream/query"
    async with websockets.connect(uri) as websocket:
        # Subscribe to Bond contracts
        await websocket.send(json.dumps({
            "templateIds": ["FixedRateBond:Bond"]
        }))
        
        # Receive updates
        async for message in websocket:
            event = json.loads(message)
            print(f"Bond update: {event}")
```

### TypeScript

```typescript
const ws = new WebSocket('ws://localhost:7575/v1/stream/query');

ws.onopen = () => {
  ws.send(JSON.stringify({
    templateIds: ['FixedRateBond:Bond']
  }));
};

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log('Bond update:', update);
};
```

## Error Handling

Common errors and solutions:

1. **Connection Refused**
   - Ensure Canton is running
   - Check host and port configuration

2. **Authorization Failed**
   - Verify JWT token is valid
   - Check party has correct permissions

3. **Contract Not Found**
   - Contract may have been archived
   - Query ACS to find active contracts

4. **Choice Authorization Failed**
   - Verify the party has rights to exercise the choice
   - Check signatory/controller requirements

## Testing

Run integration tests:

```bash
# Python
pytest test_bond_client.py

# TypeScript
npm test
```

## Production Considerations

1. **Connection Pooling**: Reuse connections for better performance
2. **Error Retry Logic**: Implement exponential backoff for transient failures
3. **Logging**: Add comprehensive logging for audit trails
4. **Monitoring**: Track transaction success rates and latencies
5. **Security**: Use TLS for all connections in production

## Support

For issues or questions:
- Check the [Deployment Guide](../DEPLOYMENT.md)
- Refer to [DAML Documentation](https://docs.daml.com)
- Visit [Canton Documentation](https://docs.daml.com/canton/index.html)

