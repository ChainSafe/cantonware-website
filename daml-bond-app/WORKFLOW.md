# Asset Swap Workflow Diagrams

Visual guide to understanding the Asset Swap application workflows.

## Two-Party Atomic Swap Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     TWO-PARTY ATOMIC SWAP                            │
└─────────────────────────────────────────────────────────────────────┘

Party A (Alice)                                      Party B (Bob)
     │                                                      │
     │  Owns: Bond #1 (CID: 001)                          │  Owns: Token Batch (CID: 002)
     │        5% Bond, $50k                                │        1000 Gold Tokens
     │                                                      │
     ▼                                                      │
┌──────────────────┐                                       │
│ Create Proposal  │                                       │
│                  │                                       │
│ Offer: Bond #1   │                                       │
│ Want: Tokens     │                                       │
│ SwapId: SWAP-001 │                                       │
└──────┬───────────┘                                       │
       │                                                    │
       │    ═══════════════════════════════════►          │
       │         SwapProposal Created                      │
       │         (Signatory: Alice)                        │
       │         (Observer: Bob)                           ▼
       │                                            ┌──────────────────┐
       │                                            │ Review Proposal  │
       │                                            │                  │
       │                                            │ Alice offers:    │
       │                                            │  Bond #1         │
       │                                            │ Bob must provide:│
       │                                            │  1000 Tokens     │
       │                                            │                  │
       │                                            │ Decision: Accept │
       │                                            └──────┬───────────┘
       │                                                   │
       │         ◄═══════════════════════════════         │
       │           AcceptSwap Exercised                   │
       ▼                                                   ▼
┌──────────────────────────────────────────────────────────────┐
│              SwapAgreement Created                            │
│              (Signatory: Alice, Bob)                          │
│                                                               │
│  Status: Both parties agreed to swap                         │
│  Ready for asset transfer execution                          │
└──────────────────────────────────────────────────────────────┘
       │                                                   │
       │   Execute Transfer                Execute Transfer
       │   Bond #1: Alice → Bob            Tokens: Bob → Alice
       │                                                   │
       ▼                                                   ▼
┌──────────────────┐                              ┌──────────────────┐
│ TransferBond     │                              │ TransferTokens   │
│ newOwner = Bob   │                              │ newOwner = Alice │
└──────┬───────────┘                              └──────┬───────────┘
       │                                                  │
       │                                                  │
       │              Both transfers complete             │
       │                                                  │
       ▼                                                  │
┌──────────────────────────────────────────────────────────────┐
│  Either party exercises CompleteSwap                         │
│  completedBy = Alice or Bob                                  │
└──────────────────────────────────────────────────────────────┘
       │                                                   │
       ▼                                                   ▼
┌──────────────────────────────────────────────────────────────┐
│              SwapCompletion Created                           │
│              (Signatory: Alice, Bob)                          │
│                                                               │
│  Final State:                                                │
│  • Alice owns: 1000 Gold Tokens (previously Bob's)          │
│  • Bob owns: Bond #1 (previously Alice's)                   │
│  • Immutable audit trail on ledger                          │
└──────────────────────────────────────────────────────────────┘
```

## Multi-Asset Swap Workflow (2-for-1)

```
┌─────────────────────────────────────────────────────────────────────┐
│                   MULTI-ASSET SWAP (2-for-1)                         │
└─────────────────────────────────────────────────────────────────────┘

Trader 1                                              Trader 2
    │                                                     │
    │  Owns:                                             │  Owns:
    │  • Bond A: 3% USD, $25k                           │  • Bond C: 6% USD, $75k
    │  • Bond B: 3.5% EUR, €30k                         │
    │                                                     │
    ▼                                                     │
┌──────────────────────────┐                            │
│ Create Multi-Asset Swap  │                            │
│                          │                            │
│ Offer:                   │                            │
│  - Bond A (CID: 101)     │                            │
│  - Bond B (CID: 102)     │                            │
│                          │                            │
│ Want:                    │                            │
│  - Bond C (CID: 201)     │                            │
│                          │                            │
│ SwapId: MULTI-001        │                            │
└──────┬───────────────────┘                            │
       │                                                  │
       │  ═══════════════════════════════════►          │
       │    SwapProposal (Multiple Assets)               │
       │                                                  ▼
       │                                         ┌────────────────────┐
       │                                         │ Review Proposal    │
       │                                         │                    │
       │                                         │ Receive: 2 bonds   │
       │                                         │ Give: 1 bond       │
       │                                         │ Total value match? │
       │                                         │                    │
       │                                         │ Decision: Accept   │
       │                                         └──────┬─────────────┘
       │                                                │
       │    ◄═══════════════════════════════           │
       │         AcceptSwap                             │
       ▼                                                ▼
┌──────────────────────────────────────────────────────────────┐
│            SwapAgreement Created                              │
│                                                               │
│  Asset Mapping:                                              │
│  Trader 1 → Trader 2: Bond A, Bond B                        │
│  Trader 2 → Trader 1: Bond C                                │
└──────────────────────────────────────────────────────────────┘
       │                                                │
       │  Transfer Bond A → Trader 2                    │
       │  Transfer Bond B → Trader 2                    │
       │                         Transfer Bond C → Trader 1
       │                                                │
       ▼                                                ▼
┌──────────────────────────────────────────────────────────────┐
│            SwapCompletion                                     │
│                                                               │
│  Final State:                                                │
│  • Trader 1: Bond C                                          │
│  • Trader 2: Bond A + Bond B                                 │
└──────────────────────────────────────────────────────────────┘
```

## Three-Party Circular Swap

```
┌─────────────────────────────────────────────────────────────────────┐
│                   THREE-PARTY CIRCULAR SWAP                          │
└─────────────────────────────────────────────────────────────────────┘

       Alice                    Bob                    Charlie
         │                       │                         │
         │  NFT Art #42         │  500 Tokens            │  $100k Bond
         │  (CID: 301)          │  (CID: 401)            │  (CID: 501)
         │                       │                         │
         ▼                       │                         │
┌─────────────────────┐         │                         │
│ Initiate            │         │                         │
│ MultiPartySwap      │         │                         │
│                     │         │                         │
│ Participants:       │         │                         │
│  - Bob              │         │                         │
│  - Charlie          │         │                         │
│                     │         │                         │
│ Assets:             │         │                         │
│  Alice: NFT Art     │         │                         │
│  Bob: Tokens        │         │                         │
│  Charlie: Bond      │         │                         │
│                     │         │                         │
│ SwapId: 3WAY-001    │         │                         │
└─────┬───────────────┘         │                         │
      │                         │                         │
      │  ════════════════════►  │                         │
      │    Proposal Created     │                         │
      │    Acceptances: []      │                         │
      │                         ▼                         │
      │                  ┌──────────────┐                │
      │                  │ Bob Reviews  │                │
      │                  │              │                │
      │                  │ Give: Tokens │                │
      │                  │ Get: NFT Art │                │
      │                  │              │                │
      │                  │ Accept       │                │
      │                  └──────┬───────┘                │
      │                         │                         │
      │  ◄═══════════════════   │                         │
      │   Bob Accepted          │                         │
      │   Acceptances: [Bob]    │   ══════════════════►  │
      │                         │   Awaiting Charlie      │
      │                         │                         ▼
      │                         │                  ┌──────────────┐
      │                         │                  │Charlie Review│
      │                         │                  │              │
      │                         │                  │Give: Bond    │
      │                         │                  │Get: Tokens   │
      │                         │                  │              │
      │                         │                  │Accept        │
      │                         │                  └──────┬───────┘
      │                         │                         │
      │  ◄════════════════════════════════════════════   │
      │   Charlie Accepted (Final Acceptance)             │
      │   Acceptances: [Bob, Charlie]                     │
      ▼                         ▼                         ▼
┌──────────────────────────────────────────────────────────────┐
│       MultiPartySwapAgreement Created (Automatic)             │
│       (Signatory: Alice, Observer: Bob, Charlie)              │
│                                                               │
│  All participants have agreed                                │
│  Asset circulation:                                          │
│   Alice → Bob:     NFT Art                                   │
│   Bob → Charlie:   Tokens                                    │
│   Charlie → Alice: Bond                                      │
└──────────────────────────────────────────────────────────────┘
      │                         │                         │
      │  Transfer NFT → Bob     │                         │
      │                  Transfer Tokens → Charlie        │
      │                                   Transfer Bond → Alice
      │                         │                         │
      ▼                         ▼                         ▼
┌──────────────────────────────────────────────────────────────┐
│          CompleteMultiPartySwap                               │
│                                                               │
│  Final State:                                                │
│   • Alice: $100k Bond (from Charlie)                         │
│   • Bob: NFT Art (from Alice)                                │
│   • Charlie: 500 Tokens (from Bob)                           │
└──────────────────────────────────────────────────────────────┘
```

## Dispute Resolution Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DISPUTE RESOLUTION WORKFLOW                       │
└─────────────────────────────────────────────────────────────────────┘

Swap Agreement Exists
(Both parties signed)
      │
      │  Assets transfer initiated
      │
      ▼
┌──────────────────┐
│ Issue Detected   │
│                  │
│ Example:         │
│ • Wrong CID      │
│ • Asset mismatch │
│ • Transfer failed│
└──────┬───────────┘
       │
       │  Party A exercises DisputeSwap
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│              SwapDispute Created                              │
│              (Signatory: Disputing Party)                     │
│              (Observer: Other Party)                          │
│                                                               │
│  Dispute Details:                                            │
│  • Disputing Party: Alice                                    │
│  • Reason: "Assets were not as described"                   │
│  • Timestamp: Recorded                                       │
└──────────────────────────────────────────────────────────────┘
       │
       │  Investigation & Discussion
       │  (Off-ledger communication)
       │
       ▼
┌──────────────────┐                    ┌──────────────────┐
│  Party B         │                    │  Alternative:    │
│  Exercises       │                    │  Remain Disputed │
│  ResolveDispute  │                    │                  │
│                  │                    │  Further Action  │
│  Resolution:     │                    │  May Be Required │
│  "Issue resolved"│                    └──────────────────┘
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Dispute Archived │
│                  │
│ Resolution       │
│ Recorded         │
└──────────────────┘
```

## State Transition Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CONTRACT STATE TRANSITIONS                        │
└─────────────────────────────────────────────────────────────────────┘

                          [START]
                             │
                             ▼
                    ┌─────────────────┐
                    │  SwapProposal   │◄───────────┐
                    │  (Signatory: A) │            │
                    └────┬──┬──┬──────┘            │
                         │  │  │                   │
         ┌───────────────┘  │  └────────────┐     │
         │                  │               │     │
         │ UpdateSwapTerms  │ CancelSwap    │     │
         │                  │               │     │
         └──────────────────┘               │     │ (New proposal)
                            │               │     │
                   AcceptSwap (by B)        │     │
                            │               │     │
                            ▼               ▼     │
                    ┌─────────────────┐  [END]   │
                    │ SwapAgreement   │          │
                    │ (Sign: A, B)    │          │
                    └────┬────┬───────┘          │
                         │    │                   │
              CompleteSwap    DisputeSwap        │
                    │         │                   │
                    │         ▼                   │
                    │    ┌─────────────┐         │
                    │    │ SwapDispute │         │
                    │    │ (Sign: A/B) │         │
                    │    └──────┬──────┘         │
                    │           │                 │
                    │     ResolveDispute         │
                    │           │                 │
                    │           ▼                 │
                    │         [END]              │
                    │                             │
                    ▼                             │
            ┌─────────────────┐                  │
            │ SwapCompletion  │                  │
            │  (Sign: A, B)   │                  │
            └────────┬────────┘                  │
                     │                            │
              ArchiveCompletion                  │
                     │                            │
                     ▼                            │
                  [END]───────────────────────────┘
                           (Can create new)


Legend:
┌─────────┐
│Template │  = DAML Template/Contract
└─────────┘

─────►     = Choice Execution / State Transition

[STATE]    = Terminal State
```

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     INTEGRATION ARCHITECTURE                         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        Your Application                              │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Custom Asset │  │ Custom Asset │  │ Custom Asset │             │
│  │   Type A     │  │   Type B     │  │   Type C     │             │
│  │              │  │              │  │              │             │
│  │ (e.g., Bond) │  │ (e.g., Token)│  │ (e.g., NFT)  │             │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘             │
│         │                 │                 │                       │
│         └─────────────────┴─────────────────┘                       │
│                           │                                          │
│                           │ Describe as AssetDescription            │
│                           │                                          │
└───────────────────────────┼──────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   Asset Swap Module                                  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Coordination Layer                                         │    │
│  │                                                             │    │
│  │  • SwapProposal          (Coordinate agreements)           │    │
│  │  • SwapAgreement         (Track acceptance)                │    │
│  │  • MultiPartySwapProposal (Multi-party coordination)       │    │
│  │  • SwapDispute           (Handle issues)                   │    │
│  │  • SwapCompletion        (Record completion)               │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
└───────────────────────────┬──────────────────────────────────────────┘
                            │
                            │ Provides coordination
                            │ for asset transfers
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DAML Ledger                                   │
│                                                                      │
│  • Immutable audit trail                                            │
│  • Multi-party authorization                                        │
│  • Smart contract execution                                         │
│  • Privacy guarantees                                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Key Takeaways

1. **Coordination Pattern**: Asset Swap provides coordination between parties, not actual asset transfer
2. **Flexibility**: Works with any DAML asset type through generic `AssetDescription`
3. **Atomic Agreements**: Both parties must sign before any action
4. **Multi-Party Support**: Scale from 2-party to N-party swaps
5. **Dispute Handling**: Built-in workflow for resolving issues
6. **Audit Trail**: Every step recorded immutably on the ledger

## Next Steps

- Try the examples in `QUICKSTART.md`
- Explore test scenarios in `AssetSwapSetup.daml`
- Read the full documentation in `README.md`
- Build your own asset types and integrate with the swap system

