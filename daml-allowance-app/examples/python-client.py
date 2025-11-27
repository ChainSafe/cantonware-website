#!/usr/bin/env python3
"""
Kids Allowance App - Python Client Example

This example demonstrates how to interact with the Allowance App
using the DAML Python SDK.
"""

from dazl import Network, create
import asyncio
from datetime import date, timedelta

# Configuration
LEDGER_HOST = 'localhost'
LEDGER_PORT = 6865

# Party identifiers
PARENT = 'Parent'
EMMA = 'Emma'
JAMES = 'James'


async def view_all_accounts(network: Network):
    """View all allowance accounts"""
    print("\n=== Viewing All Allowance Accounts ===")
    
    async with network.aio_party(PARENT) as client:
        # Query all AllowanceAccount contracts
        accounts = client.find_active('Allowance:AllowanceAccount')
        
        async for cid, account in accounts.items():
            print(f"\n{account['childName']}'s Account:")
            print(f"  Balance: ${account['balance']}")
            print(f"  Weekly Amount: ${account['weeklyAmount']}")
            print(f"  Last Payment: {account['lastPaymentDate']}")
            print(f"  Currency: {account['currency']}")


async def pay_weekly_allowance(network: Network, child_name: str):
    """Parent pays weekly allowance to a child"""
    print(f"\n=== Paying Weekly Allowance to {child_name} ===")
    
    async with network.aio_party(PARENT) as client:
        # Find the child's account
        accounts = client.find_active('Allowance:AllowanceAccount')
        
        async for cid, account in accounts.items():
            if account['childName'] == child_name:
                today = date.today()
                
                # Exercise PayWeeklyAllowance choice
                await client.exercise(
                    cid,
                    'PayWeeklyAllowance',
                    {'today': today}
                )
                
                print(f"✓ Paid ${account['weeklyAmount']} to {child_name}")
                break


async def make_bonus_payment(network: Network, child_name: str, amount: float, reason: str):
    """Parent makes a bonus payment to a child"""
    print(f"\n=== Making Bonus Payment to {child_name} ===")
    
    async with network.aio_party(PARENT) as client:
        # Find the child's account
        accounts = client.find_active('Allowance:AllowanceAccount')
        
        async for cid, account in accounts.items():
            if account['childName'] == child_name:
                # Exercise MakeBonusPayment choice
                await client.exercise(
                    cid,
                    'MakeBonusPayment',
                    {
                        'amount': str(amount),
                        'reason': reason
                    }
                )
                
                print(f"✓ Paid bonus of ${amount} to {child_name}")
                print(f"  Reason: {reason}")
                break


async def child_withdraw(network: Network, child_name: str, amount: float, description: str):
    """Child withdraws money from their account"""
    print(f"\n=== {child_name} Withdrawing Money ===")
    
    # Determine which party to use
    child_party = EMMA if child_name == 'Emma' else JAMES
    
    async with network.aio_party(child_party) as client:
        # Find the child's account
        accounts = client.find_active('Allowance:AllowanceAccount')
        
        async for cid, account in accounts.items():
            if account['childName'] == child_name:
                # Exercise WithdrawMoney choice
                await client.exercise(
                    cid,
                    'WithdrawMoney',
                    {
                        'amount': str(amount),
                        'description': description
                    }
                )
                
                print(f"✓ {child_name} withdrew ${amount}")
                print(f"  For: {description}")
                break


async def create_task(network: Network, child_name: str, description: str, reward: float, due_days: int = 7):
    """Parent creates a task for a child"""
    print(f"\n=== Creating Task for {child_name} ===")
    
    child_party = EMMA if child_name == 'Emma' else JAMES
    due_date = date.today() + timedelta(days=due_days)
    
    async with network.aio_party(PARENT) as client:
        # Create Task contract
        await client.create(
            'Allowance:Task',
            {
                'parent': PARENT,
                'child': child_party,
                'childName': child_name,
                'description': description,
                'reward': str(reward),
                'dueDate': due_date,
                'currency': 'USD'
            }
        )
        
        print(f"✓ Created task for {child_name}")
        print(f"  Task: {description}")
        print(f"  Reward: ${reward}")
        print(f"  Due: {due_date}")


async def view_tasks(network: Network, child_name: str = None):
    """View all tasks or tasks for a specific child"""
    print("\n=== Viewing Tasks ===")
    
    async with network.aio_party(PARENT) as client:
        # Query all Task contracts
        tasks = client.find_active('Allowance:Task')
        
        async for cid, task in tasks.items():
            if child_name is None or task['childName'] == child_name:
                print(f"\nTask for {task['childName']}:")
                print(f"  Description: {task['description']}")
                print(f"  Reward: ${task['reward']}")
                print(f"  Due: {task.get('dueDate', 'No due date')}")


async def complete_task(network: Network, child_name: str, task_description: str):
    """Child marks a task as complete"""
    print(f"\n=== {child_name} Completing Task ===")
    
    child_party = EMMA if child_name == 'Emma' else JAMES
    
    async with network.aio_party(child_party) as client:
        # Find the task
        tasks = client.find_active('Allowance:Task')
        
        async for cid, task in tasks.items():
            if task['childName'] == child_name and task['description'] == task_description:
                # Exercise CompleteTask choice
                await client.exercise(
                    cid,
                    'CompleteTask',
                    {'completionDate': date.today()}
                )
                
                print(f"✓ {child_name} completed: {task_description}")
                print(f"  Waiting for parent approval...")
                break


async def main():
    """Main example workflow"""
    network = Network()
    network.set_config(url=f'http://{LEDGER_HOST}:{LEDGER_PORT}')
    
    async with network:
        # View initial state
        await view_all_accounts(network)
        
        # Example 1: Pay weekly allowance
        await pay_weekly_allowance(network, 'Emma')
        
        # Example 2: Make bonus payment
        await make_bonus_payment(network, 'James', 10.0, 'Great report card!')
        
        # Example 3: Child withdrawal
        await child_withdraw(network, 'Emma', 5.0, 'Ice cream with friends')
        
        # Example 4: Create and complete task
        await create_task(network, 'James', 'Clean your room', 5.0)
        await view_tasks(network)
        
        # View final state
        await view_all_accounts(network)


if __name__ == '__main__':
    asyncio.run(main())

