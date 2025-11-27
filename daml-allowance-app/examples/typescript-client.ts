/**
 * Kids Allowance App - TypeScript Client Example
 * 
 * This example demonstrates how to interact with the Allowance App
 * using the DAML JavaScript/TypeScript SDK.
 */

import { Ledger } from '@daml/ledger';
import { AllowanceAccount, Task, TaskCompletion } from './allowance-app-1.0.0';

// Configuration
const LEDGER_HOST = 'localhost';
const LEDGER_PORT = 6865;
const LEDGER_URL = `http://${LEDGER_HOST}:${LEDGER_PORT}`;

// Party identifiers
const PARENT = 'Parent';
const EMMA = 'Emma';
const JAMES = 'James';

/**
 * View all allowance accounts
 */
async function viewAllAccounts(ledger: Ledger): Promise<void> {
  console.log('\n=== Viewing All Allowance Accounts ===');
  
  const accounts = await ledger.query(AllowanceAccount);
  
  for (const account of accounts) {
    console.log(`\n${account.payload.childName}'s Account:`);
    console.log(`  Balance: $${account.payload.balance}`);
    console.log(`  Weekly Amount: $${account.payload.weeklyAmount}`);
    console.log(`  Last Payment: ${account.payload.lastPaymentDate}`);
    console.log(`  Currency: ${account.payload.currency}`);
  }
}

/**
 * Parent pays weekly allowance to a child
 */
async function payWeeklyAllowance(
  ledger: Ledger,
  childName: string
): Promise<void> {
  console.log(`\n=== Paying Weekly Allowance to ${childName} ===`);
  
  const accounts = await ledger.query(AllowanceAccount);
  const account = accounts.find(a => a.payload.childName === childName);
  
  if (!account) {
    console.error(`Account not found for ${childName}`);
    return;
  }
  
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
  await ledger.exercise(
    AllowanceAccount.PayWeeklyAllowance,
    account.contractId,
    { today }
  );
  
  console.log(`✓ Paid $${account.payload.weeklyAmount} to ${childName}`);
}

/**
 * Parent makes a bonus payment to a child
 */
async function makeBonusPayment(
  ledger: Ledger,
  childName: string,
  amount: string,
  reason: string
): Promise<void> {
  console.log(`\n=== Making Bonus Payment to ${childName} ===`);
  
  const accounts = await ledger.query(AllowanceAccount);
  const account = accounts.find(a => a.payload.childName === childName);
  
  if (!account) {
    console.error(`Account not found for ${childName}`);
    return;
  }
  
  await ledger.exercise(
    AllowanceAccount.MakeBonusPayment,
    account.contractId,
    { amount, reason }
  );
  
  console.log(`✓ Paid bonus of $${amount} to ${childName}`);
  console.log(`  Reason: ${reason}`);
}

/**
 * Child withdraws money from their account
 */
async function childWithdraw(
  ledger: Ledger,
  childName: string,
  amount: string,
  description: string
): Promise<void> {
  console.log(`\n=== ${childName} Withdrawing Money ===`);
  
  const accounts = await ledger.query(AllowanceAccount);
  const account = accounts.find(a => a.payload.childName === childName);
  
  if (!account) {
    console.error(`Account not found for ${childName}`);
    return;
  }
  
  await ledger.exercise(
    AllowanceAccount.WithdrawMoney,
    account.contractId,
    { amount, description }
  );
  
  console.log(`✓ ${childName} withdrew $${amount}`);
  console.log(`  For: ${description}`);
}

/**
 * Parent creates a task for a child
 */
async function createTask(
  ledger: Ledger,
  childName: string,
  description: string,
  reward: string,
  dueDays: number = 7
): Promise<void> {
  console.log(`\n=== Creating Task for ${childName} ===`);
  
  const childParty = childName === 'Emma' ? EMMA : JAMES;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + dueDays);
  const dueDateStr = dueDate.toISOString().split('T')[0];
  
  await ledger.create(Task, {
    parent: PARENT,
    child: childParty,
    childName,
    description,
    reward,
    dueDate: dueDateStr,
    currency: 'USD'
  });
  
  console.log(`✓ Created task for ${childName}`);
  console.log(`  Task: ${description}`);
  console.log(`  Reward: $${reward}`);
  console.log(`  Due: ${dueDateStr}`);
}

/**
 * View all tasks or tasks for a specific child
 */
async function viewTasks(
  ledger: Ledger,
  childName?: string
): Promise<void> {
  console.log('\n=== Viewing Tasks ===');
  
  const tasks = await ledger.query(Task);
  
  for (const task of tasks) {
    if (!childName || task.payload.childName === childName) {
      console.log(`\nTask for ${task.payload.childName}:`);
      console.log(`  Description: ${task.payload.description}`);
      console.log(`  Reward: $${task.payload.reward}`);
      console.log(`  Due: ${task.payload.dueDate || 'No due date'}`);
    }
  }
}

/**
 * Child marks a task as complete
 */
async function completeTask(
  ledger: Ledger,
  childName: string,
  taskDescription: string
): Promise<void> {
  console.log(`\n=== ${childName} Completing Task ===`);
  
  const tasks = await ledger.query(Task);
  const task = tasks.find(
    t => t.payload.childName === childName && 
         t.payload.description === taskDescription
  );
  
  if (!task) {
    console.error(`Task not found: ${taskDescription}`);
    return;
  }
  
  const completionDate = new Date().toISOString().split('T')[0];
  
  await ledger.exercise(
    Task.CompleteTask,
    task.contractId,
    { completionDate }
  );
  
  console.log(`✓ ${childName} completed: ${taskDescription}`);
  console.log(`  Waiting for parent approval...`);
}

/**
 * Parent approves a completed task and pays reward
 */
async function approveTask(
  ledger: Ledger,
  childName: string,
  taskDescription: string
): Promise<void> {
  console.log(`\n=== Approving Task for ${childName} ===`);
  
  // Find the task completion
  const completions = await ledger.query(TaskCompletion);
  const completion = completions.find(
    c => c.payload.childName === childName && 
         c.payload.description === taskDescription
  );
  
  if (!completion) {
    console.error(`Task completion not found: ${taskDescription}`);
    return;
  }
  
  // Find the child's allowance account
  const accounts = await ledger.query(AllowanceAccount);
  const account = accounts.find(a => a.payload.childName === childName);
  
  if (!account) {
    console.error(`Account not found for ${childName}`);
    return;
  }
  
  await ledger.exercise(
    TaskCompletion.ApproveAndPay,
    completion.contractId,
    { allowanceAccountCid: account.contractId }
  );
  
  console.log(`✓ Approved task and paid $${completion.payload.reward} to ${childName}`);
}

/**
 * Main example workflow
 */
async function main(): Promise<void> {
  // Create ledger connection
  const ledger = new Ledger({ token: PARENT, httpBaseUrl: LEDGER_URL });
  
  try {
    // View initial state
    await viewAllAccounts(ledger);
    
    // Example 1: Pay weekly allowance
    await payWeeklyAllowance(ledger, 'Emma');
    
    // Example 2: Make bonus payment
    await makeBonusPayment(ledger, 'James', '10.0', 'Great report card!');
    
    // Example 3: Child withdrawal
    await childWithdraw(ledger, 'Emma', '5.0', 'Ice cream with friends');
    
    // Example 4: Create and complete task
    await createTask(ledger, 'James', 'Clean your room', '5.0');
    await viewTasks(ledger);
    
    // View final state
    await viewAllAccounts(ledger);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export {
  viewAllAccounts,
  payWeeklyAllowance,
  makeBonusPayment,
  childWithdraw,
  createTask,
  viewTasks,
  completeTask,
  approveTask
};

