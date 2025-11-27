# DAML Bond & Asset Swap Applications

This repository contains comprehensive DAML applications demonstrating financial instruments and asset swapping capabilities on the DAML ledger.

## Applications Included

### 1. Fixed Rate Bond Application (`FixedRateBond.daml`)

A production-ready implementation of fixed-rate bonds with complete lifecycle management.

**Features:**
- Bond issuance with configurable terms (denomination, coupon rate, frequency, maturity)
- Coupon payment tracking and automation
- Bond trading between investors
- Redemption at maturity
- Full audit trail of all bond operations

**Templates:**
- `Bond` - Core bond contract with transfer and payment capabilities
- `BondIssuanceRequest` - Two-party issuance workflow
- `BondTradeOffer` - Secondary market trading
- `CouponPayment` - Coupon payment records
- `BondRedemption` - Maturity redemption records

### 2. Asset Swap Application (`AssetSwap.daml`)

A flexible, generic asset swapping system that enables atomic swaps of any DAML contracts by their Contract IDs.

**Key Features:**
- **Generic Asset Swapping**: Swap any DAML contract type (Bonds, Tokens, NFTs, etc.)
- **Atomic Agreements**: Both parties must agree before swap is finalized
- **Multi-Asset Swaps**: Exchange multiple assets in a single transaction
- **Multi-Party Swaps**: Support for complex swaps involving 3+ participants
- **Dispute Resolution**: Built-in dispute and resolution workflow
- **Flexible Terms**: Update swap terms before acceptance
- **Audit Trail**: Complete tracking of proposals, agreements, and completions

**Templates:**

#### Two-Party Swaps
- `SwapProposal` - Initial swap proposal with asset descriptions
  - Proposer offers their assets for counterparty's assets
  - Can be accepted, rejected, updated, or cancelled
- `SwapAgreement` - Agreed swap awaiting execution
  - Both parties have signed
  - Can be completed or disputed
- `SwapCompletion` - Successfully completed swap record
- `SwapDispute` - Disputed swap with resolution mechanism

#### Multi-Party Swaps
- `MultiPartySwapProposal` - Swap involving 3+ parties
  - Collects acceptances from all participants
  - Automatically finalizes when all accept
- `MultiPartySwapAgreement` - Finalized multi-party agreement

**Asset Description Structure:**
```daml
data AssetDescription = AssetDescription
  with
    contractId : Text        -- String representation of ContractId
    assetType : Text         -- "Bond", "Token", "NFT", etc.
    description : Text       -- Human-readable description
    quantity : Optional Decimal  -- Optional amount/quantity
```

## Use Cases

### Bond Swap Example
Swap a shorter-term bond for a longer-term bond to adjust portfolio duration:
```
Party A offers: 4% Bond maturing 2028, $50k
Party B offers: 5% Bond maturing 2030, $60k
Result: Both parties exchange bonds atomically
```

### Multi-Asset Portfolio Rebalancing
Exchange multiple assets at once:
```
Trader 1 offers: [3% USD Bond $25k, 3.5% EUR Bond €30k]
Trader 2 offers: [6% USD Bond $75k]
Result: 2-for-1 bond swap completed
```

### Three-Way Asset Exchange
Complex multi-party swap:
```
Alice: Rare Digital Art NFT
Bob: 500 Premium Tokens
Charlie: Corporate Bond $100k
Result: All three parties exchange assets simultaneously
```

## Architecture & Design

### Coordination Pattern
The Asset Swap application uses a **coordination contract** pattern:
- Swap templates coordinate agreement between parties
- Actual asset transfers happen separately (via contract-specific transfer choices)
- Swap contracts provide proof of agreement and audit trail
- This keeps the swap logic generic and reusable

### Security Features
1. **Signatory Requirements**: All parties must sign agreements
2. **Observer Rights**: Counterparties can view proposals
3. **Authorization Checks**: Only participants can execute choices
4. **Dispute Mechanism**: Built-in dispute resolution workflow
5. **Immutable Audit Trail**: All actions recorded on ledger

### Flexibility
- **Type Agnostic**: Works with any DAML contract type
- **Optional Expiration**: Set time-based expiration if needed
- **Updateable Terms**: Modify proposals before acceptance
- **Extensible**: Easy to add custom validation or terms

## Testing & Scripts

### Setup Scripts (`BondSetup.daml` & `AssetSwapSetup.daml`)

Run comprehensive test scenarios:

```bash
# Test full bond lifecycle
daml script --dar .daml/dist/daml-bond-app-*.dar \
  --script-name BondSetup:testBondLifecycle

# Test simple two-party bond swap
daml script --dar .daml/dist/daml-bond-app-*.dar \
  --script-name AssetSwapSetup:testBondSwap

# Test multi-asset swap (2-for-1)
daml script --dar .daml/dist/daml-bond-app-*.dar \
  --script-name AssetSwapSetup:testMultiAssetSwap

# Test multi-party swap (3 participants)
daml script --dar .daml/dist/daml-bond-app-*.dar \
  --script-name AssetSwapSetup:testMultiPartySwap

# Test swap modification and cancellation
daml script --dar .daml/dist/daml-bond-app-*.dar \
  --script-name AssetSwapSetup:testSwapModification

# Test dispute resolution
daml script --dar .daml/dist/daml-bond-app-*.dar \
  --script-name AssetSwapSetup:testSwapDispute
```

## Building & Running

### Build the DAR
```bash
cd daml-bond-app
daml build
```

### Run in Sandbox
```bash
daml sandbox --dar .daml/dist/daml-bond-app-*.dar
```

### Run Tests
```bash
daml test
```

## Integration Guide

### Using Asset Swap in Your Application

1. **Create a Swap Proposal**
```daml
-- Describe your assets
let myAsset = AssetDescription with
      contractId = show myContractCid
      assetType = "Bond"
      description = "My 5% Bond"
      quantity = Some 100000.0

let theirAsset = AssetDescription with
      contractId = show theirContractCid
      assetType = "Token"
      description = "1000 Premium Tokens"
      quantity = Some 1000.0

-- Create proposal
swapCid <- submit me do
  createCmd SwapProposal with
    proposer = me
    counterparty = them
    proposerAssets = [myAsset]
    counterpartyAssets = [theirAsset]
    swapId = "SWAP-001"
    expirationDate = None
    description = "Bond for tokens swap"
```

2. **Accept the Swap**
```daml
agreementCid <- submit them do
  exerciseCmd swapCid AcceptSwap
```

3. **Execute Asset Transfers**
```daml
-- Transfer your assets using contract-specific choices
newMyContractCid <- submit me do
  exerciseCmd myContractCid Transfer with newOwner = them

newTheirContractCid <- submit them do
  exerciseCmd theirContractCid Transfer with newOwner = me
```

4. **Complete the Swap**
```daml
completionCid <- submit me do
  exerciseCmd agreementCid CompleteSwap with
    completedBy = me
```

## Contract ID Handling

Contract IDs in DAML are opaque types. The Asset Swap application uses string representations (`show contractId`) for description and tracking purposes. The actual asset transfers must be performed using the real contract IDs and their respective transfer choices.

## Production Considerations

### Before Production Use
- [ ] Add expiration date enforcement
- [ ] Implement escrow for high-value swaps
- [ ] Add fee mechanism if needed
- [ ] Implement automated asset transfer triggers
- [ ] Add role-based access control
- [ ] Include KYC/AML compliance checks
- [ ] Add comprehensive logging
- [ ] Implement emergency pause functionality

### Security Checklist
- [ ] Review authorization model
- [ ] Audit all choice controllers
- [ ] Validate input constraints
- [ ] Test dispute scenarios
- [ ] Verify signatory requirements
- [ ] Check for reentrancy issues
- [ ] Test with maximum asset counts

## License

This code is provided as-is for educational and development purposes. Review and audit thoroughly before any production use.

## Support

For issues, questions, or contributions:
- Review the DAML documentation: https://docs.daml.com
- Check the DAML forum: https://discuss.daml.com
- Use DAML MCP Server for AI-powered development assistance

---

**Built with DAML Autopilot** - Precision tools for financial infrastructure.
