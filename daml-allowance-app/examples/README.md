# Client Examples

This directory contains example client implementations for the Kids Allowance App.

## Prerequisites

Before running these examples:

1. **Build the DAML application**:
   ```bash
   cd ..
   daml build
   ```

2. **Deploy to Canton**:
   ```bash
   ../deploy.sh
   # Or manually start Canton and upload the DAR
   ```

3. **Initialize the system**:
   ```bash
   daml script \
     --dar ../.daml/dist/allowance-app-1.0.0.dar \
     --script-name AllowanceSetup:setupAllowanceSystem \
     --ledger-host localhost \
     --ledger-port 6865
   ```

## Python Client Example

### Installation

```bash
pip install -r requirements.txt
```

### Dependencies

- `dazl>=7.0.0` - Python SDK for DAML

### Usage

```bash
python python-client.py
```

### What It Demonstrates

The Python client shows how to:

1. **View all allowance accounts** - Query and display balances
2. **Pay weekly allowances** - Exercise the PayWeeklyAllowance choice
3. **Make bonus payments** - Give one-time payments with reasons
4. **Handle withdrawals** - Children spending their allowance
5. **Create tasks** - Set up chores with rewards
6. **View tasks** - Query active tasks
7. **Complete tasks** - Mark tasks as done
8. **Approve tasks** - Parent approval and payment

### Code Structure

```python
async with network.aio_party(PARENT) as client:
    # Query contracts
    accounts = client.find_active('Allowance:AllowanceAccount')
    
    # Exercise choice
    await client.exercise(
        contract_id,
        'PayWeeklyAllowance',
        {'today': date.today()}
    )
```

### Customization

Edit these variables in `python-client.py`:

- `LEDGER_HOST` - Canton host (default: localhost)
- `LEDGER_PORT` - Ledger API port (default: 6865)
- `PARENT`, `EMMA`, `JAMES` - Party identifiers

## TypeScript Client Example

### Installation

```bash
npm install
```

### Dependencies

- `@daml/ledger` - TypeScript SDK for DAML
- `@daml/types` - Type definitions
- `typescript` - TypeScript compiler
- `ts-node` - TypeScript execution

### Usage

```bash
npm start
```

Or with ts-node directly:

```bash
npx ts-node typescript-client.ts
```

### What It Demonstrates

The TypeScript client shows how to:

1. **Connect to the ledger** - Create Ledger instance
2. **Query contracts** - Fetch AllowanceAccount, Task contracts
3. **Exercise choices** - Call contract methods
4. **Create contracts** - Create new Task contracts
5. **Type-safe operations** - Leverage TypeScript types

### Code Structure

```typescript
const ledger = new Ledger({ token: PARENT, httpBaseUrl: LEDGER_URL });

// Query
const accounts = await ledger.query(AllowanceAccount);

// Exercise
await ledger.exercise(
  AllowanceAccount.PayWeeklyAllowance,
  account.contractId,
  { today }
);
```

### Customization

Edit these constants in `typescript-client.ts`:

- `LEDGER_HOST` - Canton host
- `LEDGER_PORT` - Ledger API port
- `PARENT`, `EMMA`, `JAMES` - Party identifiers

### Type Generation

To generate TypeScript types from the DAR:

```bash
daml codegen js ../.daml/dist/allowance-app-1.0.0.dar -o daml-ts
```

Update imports to reference the generated types.

## Common Operations

### View Current Balances

**Python**:
```python
await view_all_accounts(network)
```

**TypeScript**:
```typescript
await viewAllAccounts(ledger);
```

### Pay Weekly Allowance

**Python**:
```python
await pay_weekly_allowance(network, 'Emma')
```

**TypeScript**:
```typescript
await payWeeklyAllowance(ledger, 'Emma');
```

### Make Bonus Payment

**Python**:
```python
await make_bonus_payment(network, 'James', 10.0, 'Great report card!')
```

**TypeScript**:
```typescript
await makeBonusPayment(ledger, 'James', '10.0', 'Great report card!');
```

### Child Withdrawal

**Python**:
```python
await child_withdraw(network, 'Emma', 5.0, 'Ice cream')
```

**TypeScript**:
```typescript
await childWithdraw(ledger, 'Emma', '5.0', 'Ice cream');
```

### Create and Complete Task

**Python**:
```python
await create_task(network, 'James', 'Clean room', 5.0)
await complete_task(network, 'James', 'Clean room')
```

**TypeScript**:
```typescript
await createTask(ledger, 'James', 'Clean room', '5.0');
await completeTask(ledger, 'James', 'Clean room');
```

## Authentication

These examples use simple party-based authentication suitable for development.

For production deployments, implement proper authentication:

1. **JWT Tokens** - Use JSON Web Tokens for secure access
2. **OAuth 2.0** - Integrate with identity providers
3. **User Management** - Map users to DAML parties
4. **TLS** - Enable transport layer security

## Error Handling

Common errors and solutions:

### Connection Refused

```
Error: Connection refused to localhost:6865
```

**Solution**: Make sure Canton is running:
```bash
canton daemon -c ../canton.conf
```

### Party Not Found

```
Error: Party 'Parent' not found
```

**Solution**: Run the setup script first:
```bash
daml script --dar ../.daml/dist/allowance-app-1.0.0.dar \
  --script-name AllowanceSetup:setupAllowanceSystem \
  --ledger-host localhost --ledger-port 6865
```

### Contract Not Found

```
Error: Contract not found
```

**Solution**: The contract may have been archived. Query active contracts first:
```python
accounts = client.find_active('Allowance:AllowanceAccount')
```

### Insufficient Balance

```
Error: Insufficient balance
```

**Solution**: This is a business logic error. Check the child's balance before withdrawal.

## Building Your Own Client

### 1. Choose Your Language

- **Python**: Best for data analysis, automation, backend services
- **TypeScript**: Best for web apps, mobile apps, full-stack development
- **Java**: Available with Java bindings (not shown here)

### 2. Connect to the Ledger

Configure the Ledger API endpoint (default: localhost:6865)

### 3. Authenticate

Use party tokens for authentication (development) or JWT (production)

### 4. Query Contracts

Find active contracts using template queries

### 5. Exercise Choices

Call contract methods to perform actions

### 6. Handle Events

Subscribe to transaction streams for real-time updates

## Advanced Topics

### Real-Time Updates

Subscribe to transaction events:

**Python**:
```python
async with network.aio_party(PARENT) as client:
    async for event in client.stream_acs():
        # Handle contract created/archived events
        pass
```

**TypeScript**:
```typescript
const stream = ledger.streamQuery(AllowanceAccount);
for await (const event of stream) {
  // Handle events
}
```

### Batch Operations

Process multiple operations efficiently:

```python
# Pay allowances to all children
for account in accounts:
    await client.exercise(account_id, 'PayWeeklyAllowance', {...})
```

### Error Recovery

Implement retry logic with exponential backoff:

```python
from tenacity import retry, wait_exponential

@retry(wait=wait_exponential(min=1, max=10))
async def pay_allowance_with_retry(...):
    # Your code here
```

### Logging and Monitoring

Add structured logging:

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info(f"Paying allowance to {child_name}")
```

## Testing

### Unit Tests

Test individual functions:

```python
import pytest

@pytest.mark.asyncio
async def test_pay_allowance():
    # Setup
    # Execute
    # Assert
    pass
```

### Integration Tests

Test against a test ledger:

```bash
# Start test Canton
canton daemon -c test-canton.conf

# Run tests
pytest test_allowance.py
```

## Production Considerations

Before deploying to production:

1. **Security**
   - Enable TLS/HTTPS
   - Implement proper authentication
   - Use secure party management
   - Validate all inputs

2. **Reliability**
   - Add error handling and retries
   - Implement circuit breakers
   - Use persistent storage in Canton
   - Set up monitoring and alerting

3. **Performance**
   - Cache query results
   - Batch operations where possible
   - Use connection pooling
   - Optimize database queries

4. **Compliance**
   - Log all financial transactions
   - Implement audit trails
   - Consider data retention policies
   - Follow financial regulations (if applicable)

## Resources

- **DAML Documentation**: https://docs.daml.com
- **Python SDK (dazl)**: https://github.com/digital-asset/dazl-client
- **TypeScript SDK**: https://docs.daml.com/app-dev/bindings-ts/
- **Canton Documentation**: https://docs.daml.com/canton/

## Support

For issues or questions:

1. Check the main [README.md](../README.md)
2. Review [QUICKSTART.md](../QUICKSTART.md)
3. Read [WORKFLOW.md](../WORKFLOW.md)
4. Consult DAML documentation

---

**Happy coding!** 🚀

