# Kids Allowance Management App

A DAML application for managing weekly allowances and pocket money for kids (Emma & James).

## Overview

This application provides a complete solution for managing children's allowances on the blockchain, with features for:

- **Weekly Allowances**: Automated weekly payments to each child's account
- **Balance Tracking**: Real-time visibility of each child's balance
- **Withdrawals**: Children can spend their money with tracked transactions
- **Tasks & Rewards**: Create tasks/chores that children can complete for extra money
- **Bonus Payments**: One-time payments for special occasions (birthdays, achievements, etc.)
- **Transparent History**: All transactions recorded on the blockchain

## Features

### Core Functionality

1. **AllowanceAccount Contract**
   - Tracks child's current balance
   - Records weekly allowance amount
   - Maintains payment history
   - Supports multiple currencies

2. **Task Management**
   - Parents create tasks with rewards
   - Children mark tasks complete
   - Parent approval required before payment
   - Optional due dates

3. **Financial Operations**
   - Weekly allowance payments
   - Bonus payments with reasons
   - Withdrawal tracking
   - Balance adjustments

### Business Benefits

- **Transparency**: All parties can see the current state
- **Education**: Teaches kids about money management
- **Automation**: Weekly payments can be scheduled
- **Trust**: Blockchain ensures no disputes about balances
- **History**: Complete audit trail of all transactions

## Project Structure

```
daml-allowance-app/
├── daml/
│   ├── Allowance.daml          # Core contracts
│   └── AllowanceSetup.daml     # Setup and example scripts
├── examples/
│   ├── python-client.py        # Python SDK example
│   ├── typescript-client.ts    # TypeScript SDK example
│   ├── requirements.txt        # Python dependencies
│   └── package.json            # Node.js dependencies
├── daml.yaml                   # DAML project configuration
├── canton.conf                 # Canton configuration
├── deploy.sh                   # Deployment script
├── README.md                   # This file
├── QUICKSTART.md              # Quick start guide
└── WORKFLOW.md                # Detailed workflow documentation
```

## Quick Start

### Prerequisites

- DAML SDK 3.4.0 or later
- Canton (included with DAML SDK)
- Optional: Python 3.8+ or Node.js 16+ for client examples

### 1. Build the Application

```bash
cd daml-allowance-app
daml build
```

### 2. Deploy to Canton

```bash
./deploy.sh
```

Or manually:

```bash
# Start Canton
canton daemon -c canton.conf

# In another terminal, upload the DAR
canton -c canton.conf
> participant1.domains.connect_local("local")
> participant1.dars.upload(".daml/dist/allowance-app-1.0.0.dar")
```

### 3. Run Setup Script

Initialize the system with Emma and James's accounts:

```bash
daml script \
  --dar .daml/dist/allowance-app-1.0.0.dar \
  --script-name AllowanceSetup:setupAllowanceSystem \
  --ledger-host localhost \
  --ledger-port 6865
```

### 4. Run Example Workflows

See the complete workflow in action:

```bash
daml script \
  --dar .daml/dist/allowance-app-1.0.0.dar \
  --script-name AllowanceSetup:completeWorkflow \
  --ledger-host localhost \
  --ledger-port 6865
```

## Usage Examples

### Pay Weekly Allowance

```bash
daml script \
  --dar .daml/dist/allowance-app-1.0.0.dar \
  --script-name AllowanceSetup:examplePayWeeklyAllowance \
  --ledger-host localhost \
  --ledger-port 6865
```

### Child Withdrawal

```bash
daml script \
  --dar .daml/dist/allowance-app-1.0.0.dar \
  --script-name AllowanceSetup:exampleChildWithdrawal \
  --ledger-host localhost \
  --ledger-port 6865
```

### Task Completion

```bash
daml script \
  --dar .daml/dist/allowance-app-1.0.0.dar \
  --script-name AllowanceSetup:exampleTaskCompletion \
  --ledger-host localhost \
  --ledger-port 6865
```

### Bonus Payment

```bash
daml script \
  --dar .daml/dist/allowance-app-1.0.0.dar \
  --script-name AllowanceSetup:exampleBonusPayment \
  --ledger-host localhost \
  --ledger-port 6865
```

## Client SDK Examples

### Python Client

```bash
cd examples
pip install -r requirements.txt
python python-client.py
```

See `examples/python-client.py` for detailed examples of:
- Viewing account balances
- Paying allowances
- Creating and completing tasks
- Making withdrawals

### TypeScript Client

```bash
cd examples
npm install
npm start
```

See `examples/typescript-client.ts` for TypeScript/JavaScript integration examples.

## Contract Reference

### AllowanceAccount

Main contract tracking a child's allowance account.

**Fields:**
- `parent`: Party controlling the account
- `child`: Party who owns the allowance
- `childName`: Human-readable name
- `balance`: Current balance
- `weeklyAmount`: Weekly allowance amount
- `lastPaymentDate`: When last allowance was paid
- `currency`: Currency code

**Choices:**
- `PayWeeklyAllowance`: Pay the weekly allowance (must wait 7 days)
- `MakeBonusPayment`: One-time bonus payment with reason
- `WithdrawMoney`: Child spends money
- `AdjustWeeklyAmount`: Change the weekly amount
- `AddFunds`: Add money to account
- `ViewBalance`: Query current balance

### Task

Represents a chore or task that can be completed for money.

**Fields:**
- `parent`: Party who created the task
- `child`: Party who should complete it
- `childName`: Human-readable name
- `description`: What needs to be done
- `reward`: Amount paid on completion
- `dueDate`: Optional deadline
- `currency`: Currency code

**Choices:**
- `CompleteTask`: Child marks task as done
- `CancelTask`: Parent cancels the task

### TaskCompletion

Represents a completed task awaiting approval.

**Fields:**
- All fields from Task
- `completionDate`: When task was completed
- `approved`: Approval status

**Choices:**
- `ApproveAndPay`: Parent approves and pays reward
- `RejectCompletion`: Parent rejects with reason

## Configuration

### Initial Allowances

Edit `daml/AllowanceSetup.daml` to customize:

```daml
-- Emma's account
emmaAccount <- submit parent do
  createCmd AllowanceAccount with
    parent
    child = emma
    childName = "Emma"
    balance = 20.0          -- Starting balance
    weeklyAmount = 10.0     -- Weekly allowance
    lastPaymentDate = startDate
    currency = "USD"
```

### Canton Settings

Edit `canton.conf` to change ports or storage:

```hocon
ledger-api {
  address = "localhost"
  port = 6865  # Change this if needed
}
```

## Testing

Run all example scripts to verify functionality:

```bash
# Run complete workflow
daml script \
  --dar .daml/dist/allowance-app-1.0.0.dar \
  --script-name AllowanceSetup:completeWorkflow \
  --ledger-host localhost \
  --ledger-port 6865
```

Expected output shows:
- Initial balances for Emma and James
- Weekly allowance payments
- Withdrawals and task completions
- Final updated balances

## Troubleshooting

### "Must wait at least 7 days"

The `PayWeeklyAllowance` choice enforces a 7-day waiting period. In the setup script, adjust the dates:

```daml
let nextWeek = date 2025 Dec 4  -- Must be 7+ days after lastPaymentDate
```

### "Insufficient balance"

Child cannot withdraw more than their current balance. Check balance first:

```bash
# View balances in Canton console
participant1.ledger_api.acs.of_party("Parent")
```

### Canton won't start

Check if ports are already in use:

```bash
lsof -i :6865  # Ledger API port
lsof -i :6866  # Admin API port
```

Kill existing processes or change ports in `canton.conf`.

## Future Enhancements

Potential features to add:

- [ ] Recurring tasks (weekly chores)
- [ ] Savings goals with progress tracking
- [ ] Interest on savings
- [ ] Parental spending limits/approvals
- [ ] Multiple children support (extensible)
- [ ] Mobile app interface
- [ ] Push notifications for payments
- [ ] Export to CSV for tax records

## License

This is a sample application for educational purposes.

## Support

For questions or issues:
1. Check the [QUICKSTART.md](QUICKSTART.md) guide
2. Review [WORKFLOW.md](WORKFLOW.md) for detailed workflows
3. Examine the example scripts in `daml/AllowanceSetup.daml`
4. Check DAML documentation: https://docs.daml.com

---

**Built with DAML** - The smart contract language for building composable business processes on a blockchain.

