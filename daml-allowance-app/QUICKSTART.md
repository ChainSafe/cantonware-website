# Quick Start Guide

Get Emma and James's allowance system running in 5 minutes!

## Prerequisites

Install the DAML SDK if you haven't already:

```bash
# macOS/Linux
curl -sSL https://get.daml.com/ | sh

# Windows
# Download from https://github.com/digital-asset/daml/releases
```

Verify installation:

```bash
daml version
# Should show 3.4.0 or later
```

## Step 1: Build the Application (30 seconds)

```bash
cd daml-allowance-app
daml build
```

You should see:

```
Compiling allowance-app to a DAR.
Created .daml/dist/allowance-app-1.0.0.dar
```

## Step 2: Start Canton (1 minute)

Open a terminal and start the Canton ledger:

```bash
canton daemon -c canton.conf
```

Keep this terminal running. You should see:

```
Canton is running...
Ledger API available at localhost:6865
```

## Step 3: Upload Your Application (30 seconds)

In a new terminal, connect to Canton and upload the DAR:

```bash
canton -c canton.conf
```

In the Canton console:

```scala
participant1.domains.connect_local("local")
participant1.dars.upload(".daml/dist/allowance-app-1.0.0.dar")
```

You should see:

```
Successfully uploaded DAR
```

Type `exit` to leave the Canton console.

## Step 4: Initialize Emma and James's Accounts (30 seconds)

Run the setup script to create allowance accounts:

```bash
daml script \
  --dar .daml/dist/allowance-app-1.0.0.dar \
  --script-name AllowanceSetup:setupAllowanceSystem \
  --ledger-host localhost \
  --ledger-port 6865
```

This creates:
- **Emma's account**: $20 starting balance, $10/week allowance
- **James's account**: $15 starting balance, $8/week allowance

## Step 5: See It In Action (1 minute)

Run the complete workflow example:

```bash
daml script \
  --dar .daml/dist/allowance-app-1.0.0.dar \
  --script-name AllowanceSetup:completeWorkflow \
  --ledger-host localhost \
  --ledger-port 6865
```

Watch the output to see:

1. ✅ Initial balances displayed
2. ✅ Weekly allowances paid
3. ✅ Emma buys something (withdrawal)
4. ✅ Task created for James
5. ✅ James completes task and gets paid
6. ✅ Final balances shown

## What Just Happened?

You just ran a complete allowance management system on a blockchain! Here's what the system can do:

### For Parents (You)

- Pay weekly allowances automatically
- Create tasks with rewards
- Make bonus payments
- View all balances in real-time
- Track spending history

### For Kids (Emma & James)

- See their current balance
- Withdraw money when they spend
- Complete tasks to earn extra
- Full transparency on their account

## Next Steps

### Try Individual Examples

**Pay weekly allowance:**
```bash
daml script \
  --dar .daml/dist/allowance-app-1.0.0.dar \
  --script-name AllowanceSetup:examplePayWeeklyAllowance \
  --ledger-host localhost \
  --ledger-port 6865
```

**Make a bonus payment:**
```bash
daml script \
  --dar .daml/dist/allowance-app-1.0.0.dar \
  --script-name AllowanceSetup:exampleBonusPayment \
  --ledger-host localhost \
  --ledger-port 6865
```

**Child withdrawal:**
```bash
daml script \
  --dar .daml/dist/allowance-app-1.0.0.dar \
  --script-name AllowanceSetup:exampleChildWithdrawal \
  --ledger-host localhost \
  --ledger-port 6865
```

**Task completion:**
```bash
daml script \
  --dar .daml/dist/allowance-app-1.0.0.dar \
  --script-name AllowanceSetup:exampleTaskCompletion \
  --ledger-host localhost \
  --ledger-port 6865
```

### Explore the Code

1. **Core contracts**: `daml/Allowance.daml`
   - See how allowance accounts work
   - Understand the business logic
   - Review the choices available

2. **Setup scripts**: `daml/AllowanceSetup.daml`
   - See how accounts are created
   - Understand the workflow examples
   - Customize initial values

### Build a Client Application

Try the example clients:

**Python:**
```bash
cd examples
pip install -r requirements.txt
python python-client.py
```

**TypeScript:**
```bash
cd examples
npm install
npm start
```

### Customize for Your Family

Edit `daml/AllowanceSetup.daml` to change:

- Starting balances
- Weekly allowance amounts
- Children's names
- Currency

Then rebuild and redeploy:

```bash
daml build
# Restart Canton and re-upload
```

## Common Commands

### View Active Contracts

In Canton console:

```scala
participant1.ledger_api.acs.of_party("Parent")
participant1.ledger_api.acs.of_party("Emma")
participant1.ledger_api.acs.of_party("James")
```

### Stop Canton

In the terminal running Canton, press `Ctrl+C` or:

```bash
pkill -f canton
```

### Clean Rebuild

If you need to start fresh:

```bash
daml clean
daml build
# Restart Canton (it uses in-memory storage, so restarting clears data)
```

## Understanding the Output

When you run the complete workflow, you'll see output like:

```
=== Week 1: Paying Weekly Allowances ===
Emma's balance: $30.0 (was $20 + $10 weekly)
James's balance: $23.0 (was $15 + $8 weekly)

=== Emma buys something ===
Emma withdrew $15.0 for "New toy"
Emma's balance: $15.0

=== Parent creates task for James ===
Created task: "Wash the car" - Reward: $7.0

=== James completes task ===
Task completed, waiting for approval

=== Final Balances ===
Emma's balance: $15.0
James's balance: $30.0 (had $23 + $7 task reward)
```

## Troubleshooting

### Port Already In Use

If Canton won't start due to port conflicts:

1. Edit `canton.conf`
2. Change the ports (6865, 6866, 6867, 6868)
3. Update the `--ledger-port` in your commands

### DAML Compilation Error

Make sure you're in the `daml-allowance-app` directory:

```bash
cd daml-allowance-app
pwd  # Should end with /daml-allowance-app
```

### Script Fails with "Party not found"

The setup script must run first to create the parties:

```bash
daml script \
  --dar .daml/dist/allowance-app-1.0.0.dar \
  --script-name AllowanceSetup:setupAllowanceSystem \
  --ledger-host localhost \
  --ledger-port 6865
```

## Next Learning Resources

- **README.md**: Full documentation
- **WORKFLOW.md**: Detailed workflow explanations
- **daml/Allowance.daml**: See the contract code
- **examples/**: Client integration examples

---

🎉 **Congratulations!** You've successfully deployed a blockchain-based allowance system for Emma and James!

