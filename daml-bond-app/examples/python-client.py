"""
Python Client Example for Fixed Rate Bond Application
Demonstrates how to interact with the bond application via Canton's Ledger API
"""

import asyncio
from datetime import date, timedelta
from dazl import Network, create
import json

# Configuration
LEDGER_HOST = "localhost"
LEDGER_PORT = 4002


class BondClient:
    """Client for interacting with the Fixed Rate Bond application"""

    def __init__(self, party: str, host: str = LEDGER_HOST, port: int = LEDGER_PORT):
        self.party = party
        self.host = host
        self.port = port
        self.network = Network()
        self.network.set_config(url=f"http://{host}:{port}")

    async def issue_bond_request(
        self,
        investor: str,
        isin: str,
        currency: str,
        denomination: float,
        issue_date: date,
        maturity_date: date,
        coupon_rate: float,
        coupon_frequency: int,
    ):
        """Create a bond issuance request"""
        async with self.network.aio_party(self.party) as client:
            result = await client.submit_create(
                "FixedRateBond:BondIssuanceRequest",
                {
                    "issuer": self.party,
                    "investor": investor,
                    "isin": isin,
                    "currency": currency,
                    "denomination": str(denomination),
                    "issueDate": issue_date.isoformat(),
                    "maturityDate": maturity_date.isoformat(),
                    "couponRate": str(coupon_rate),
                    "couponFrequency": coupon_frequency,
                },
            )
            print(f"✅ Bond issuance request created: {result.contract_id}")
            return result.contract_id

    async def accept_bond_issuance(self, request_contract_id: str):
        """Accept a bond issuance request (investor action)"""
        async with self.network.aio_party(self.party) as client:
            result = await client.submit_exercise(
                request_contract_id, "AcceptIssuance", {}
            )
            print(f"✅ Bond issued: {result.contract_id}")
            return result.contract_id

    async def pay_coupon(self, bond_contract_id: str):
        """Pay coupon (issuer action)"""
        async with self.network.aio_party(self.party) as client:
            result = await client.submit_exercise(bond_contract_id, "PayCoupon", {})
            print(f"✅ Coupon paid")
            return result

    async def transfer_bond(self, bond_contract_id: str, new_investor: str):
        """Transfer bond to new investor"""
        async with self.network.aio_party(self.party) as client:
            result = await client.submit_exercise(
                bond_contract_id, "TransferBond", {"newInvestor": new_investor}
            )
            print(f"✅ Bond transferred to {new_investor}: {result.contract_id}")
            return result.contract_id

    async def create_trade_offer(
        self, seller: str, price: float, currency: str, bond_data: dict
    ):
        """Create a trade offer (buyer action)"""
        async with self.network.aio_party(self.party) as client:
            result = await client.submit_create(
                "FixedRateBond:BondTradeOffer",
                {
                    "bondData": bond_data,
                    "seller": seller,
                    "buyer": self.party,
                    "price": str(price),
                    "currency": currency,
                },
            )
            print(f"✅ Trade offer created: {result.contract_id}")
            return result.contract_id

    async def accept_trade_offer(self, offer_contract_id: str, bond_contract_id: str):
        """Accept a trade offer (seller action)"""
        async with self.network.aio_party(self.party) as client:
            result = await client.submit_exercise(
                offer_contract_id,
                "AcceptTradeOffer",
                {"bondCid": bond_contract_id},
            )
            print(f"✅ Trade accepted: {result.contract_id}")
            return result.contract_id

    async def list_active_bonds(self):
        """List all active bonds visible to this party"""
        async with self.network.aio_party(self.party) as client:
            contracts = client.find_active("FixedRateBond:Bond")
            bonds = []
            async for contract in contracts:
                bonds.append(
                    {
                        "contract_id": contract.contract_id,
                        "isin": contract.payload["isin"],
                        "denomination": contract.payload["denomination"],
                        "investor": contract.payload["investor"],
                        "coupon_rate": contract.payload["couponRate"],
                        "maturity_date": contract.payload["maturityDate"],
                    }
                )
            return bonds

    async def list_coupon_payments(self):
        """List all coupon payments visible to this party"""
        async with self.network.aio_party(self.party) as client:
            contracts = client.find_active("FixedRateBond:CouponPayment")
            payments = []
            async for contract in contracts:
                payments.append(
                    {
                        "contract_id": contract.contract_id,
                        "bond": contract.payload["bond"],
                        "investor": contract.payload["investor"],
                        "amount": contract.payload["amount"],
                        "payment_date": contract.payload["paymentDate"],
                    }
                )
            return payments


# Example usage
async def main():
    """Example workflow: Issue bond, pay coupon, trade bond"""

    print("🚀 Starting Fixed Rate Bond workflow...\n")

    # Initialize clients
    issuer_client = BondClient("Issuer")
    investor1_client = BondClient("Investor1")
    investor2_client = BondClient("Investor2")

    # Step 1: Issuer creates bond issuance request
    print("Step 1: Creating bond issuance request...")
    request_cid = await issuer_client.issue_bond_request(
        investor="Investor1",
        isin="US1234567890",
        currency="USD",
        denomination=100000.0,
        issue_date=date.today(),
        maturity_date=date.today() + timedelta(days=365 * 5),  # 5 years
        coupon_rate=0.05,  # 5%
        coupon_frequency=2,  # Semi-annual
    )

    # Step 2: Investor accepts the bond
    print("\nStep 2: Investor accepting bond...")
    bond_cid = await investor1_client.accept_bond_issuance(request_cid)

    # Step 3: View active bonds
    print("\nStep 3: Viewing active bonds...")
    bonds = await issuer_client.list_active_bonds()
    print(f"Active bonds: {json.dumps(bonds, indent=2)}")

    # Step 4: Pay first coupon
    print("\nStep 4: Paying first coupon...")
    await issuer_client.pay_coupon(bond_cid)

    # Step 5: View coupon payments
    print("\nStep 5: Viewing coupon payments...")
    payments = await investor1_client.list_coupon_payments()
    print(f"Coupon payments: {json.dumps(payments, indent=2)}")

    # Step 6: Investor2 creates trade offer
    print("\nStep 6: Investor2 creating trade offer...")
    bond_data = {
        "issuer": "Issuer",
        "isin": "US1234567890",
        "denomination": "100000.0",
        "maturityDate": (date.today() + timedelta(days=365 * 5)).isoformat(),
    }
    offer_cid = await investor2_client.create_trade_offer(
        seller="Investor1", price=102000.0, currency="USD", bond_data=bond_data
    )

    # Step 7: Investor1 accepts trade
    print("\nStep 7: Investor1 accepting trade...")
    new_bond_cid = await investor1_client.accept_trade_offer(offer_cid, bond_cid)

    print("\n✨ Workflow completed successfully!")
    print(f"Bond now owned by Investor2: {new_bond_cid}")


if __name__ == "__main__":
    # Run the example
    asyncio.run(main())

