/**
 * TypeScript Client Example for Fixed Rate Bond Application
 * Demonstrates how to interact with the bond application via Canton's Ledger API
 */

import { Ledger } from '@daml/ledger';
import { Party } from '@daml/types';

// Import generated types (run: daml codegen js to generate these)
// import { Bond, BondIssuanceRequest, BondTradeOffer } from './daml/FixedRateBond';

const LEDGER_HOST = 'localhost';
const LEDGER_PORT = 4002;
const TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual token

interface BondIssuanceRequestPayload {
  issuer: Party;
  investor: Party;
  isin: string;
  currency: string;
  denomination: string;
  issueDate: string;
  maturityDate: string;
  couponRate: string;
  couponFrequency: number;
}

interface BondData {
  issuer: Party;
  isin: string;
  denomination: string;
  maturityDate: string;
}

interface BondTradeOfferPayload {
  bondData: BondData;
  seller: Party;
  buyer: Party;
  price: string;
  currency: string;
}

class BondClient {
  private ledger: Ledger;
  private party: Party;

  constructor(party: Party, host: string = LEDGER_HOST, port: number = LEDGER_PORT) {
    this.party = party;
    this.ledger = new Ledger({ 
      token: TOKEN,
      httpBaseUrl: `http://${host}:${port}`
    });
  }

  /**
   * Create a bond issuance request
   */
  async issueBondRequest(
    investor: Party,
    isin: string,
    currency: string,
    denomination: number,
    issueDate: Date,
    maturityDate: Date,
    couponRate: number,
    couponFrequency: number
  ): Promise<string> {
    const payload: BondIssuanceRequestPayload = {
      issuer: this.party,
      investor,
      isin,
      currency,
      denomination: denomination.toString(),
      issueDate: issueDate.toISOString().split('T')[0],
      maturityDate: maturityDate.toISOString().split('T')[0],
      couponRate: couponRate.toString(),
      couponFrequency,
    };

    const result = await this.ledger.create('FixedRateBond:BondIssuanceRequest', payload);
    console.log(`✅ Bond issuance request created: ${result.contractId}`);
    return result.contractId;
  }

  /**
   * Accept a bond issuance request (investor action)
   */
  async acceptBondIssuance(requestContractId: string): Promise<string> {
    const result = await this.ledger.exercise(
      'FixedRateBond:BondIssuanceRequest',
      requestContractId,
      'AcceptIssuance',
      {}
    );
    console.log(`✅ Bond issued: ${result.exerciseResult}`);
    return result.exerciseResult;
  }

  /**
   * Pay coupon (issuer action)
   */
  async payCoupon(bondContractId: string): Promise<any> {
    const result = await this.ledger.exercise(
      'FixedRateBond:Bond',
      bondContractId,
      'PayCoupon',
      {}
    );
    console.log('✅ Coupon paid');
    return result;
  }

  /**
   * Transfer bond to new investor
   */
  async transferBond(bondContractId: string, newInvestor: Party): Promise<string> {
    const result = await this.ledger.exercise(
      'FixedRateBond:Bond',
      bondContractId,
      'TransferBond',
      { newInvestor }
    );
    console.log(`✅ Bond transferred to ${newInvestor}: ${result.exerciseResult}`);
    return result.exerciseResult;
  }

  /**
   * Create a trade offer (buyer action)
   */
  async createTradeOffer(
    seller: Party,
    price: number,
    currency: string,
    bondData: BondData
  ): Promise<string> {
    const payload: BondTradeOfferPayload = {
      bondData,
      seller,
      buyer: this.party,
      price: price.toString(),
      currency,
    };

    const result = await this.ledger.create('FixedRateBond:BondTradeOffer', payload);
    console.log(`✅ Trade offer created: ${result.contractId}`);
    return result.contractId;
  }

  /**
   * Accept a trade offer (seller action)
   */
  async acceptTradeOffer(offerContractId: string, bondContractId: string): Promise<string> {
    const result = await this.ledger.exercise(
      'FixedRateBond:BondTradeOffer',
      offerContractId,
      'AcceptTradeOffer',
      { bondCid: bondContractId }
    );
    console.log(`✅ Trade accepted: ${result.exerciseResult}`);
    return result.exerciseResult;
  }

  /**
   * List all active bonds visible to this party
   */
  async listActiveBonds(): Promise<any[]> {
    const result = await this.ledger.query('FixedRateBond:Bond');
    return result.map((contract) => ({
      contractId: contract.contractId,
      isin: contract.payload.isin,
      denomination: contract.payload.denomination,
      investor: contract.payload.investor,
      couponRate: contract.payload.couponRate,
      maturityDate: contract.payload.maturityDate,
    }));
  }

  /**
   * List all coupon payments visible to this party
   */
  async listCouponPayments(): Promise<any[]> {
    const result = await this.ledger.query('FixedRateBond:CouponPayment');
    return result.map((contract) => ({
      contractId: contract.contractId,
      bond: contract.payload.bond,
      investor: contract.payload.investor,
      amount: contract.payload.amount,
      paymentDate: contract.payload.paymentDate,
    }));
  }
}

// Example usage
async function main() {
  console.log('🚀 Starting Fixed Rate Bond workflow...\n');

  // Initialize clients
  const issuerClient = new BondClient('Issuer' as Party);
  const investor1Client = new BondClient('Investor1' as Party);
  const investor2Client = new BondClient('Investor2' as Party);

  try {
    // Step 1: Issuer creates bond issuance request
    console.log('Step 1: Creating bond issuance request...');
    const today = new Date();
    const maturityDate = new Date();
    maturityDate.setFullYear(today.getFullYear() + 5); // 5 years

    const requestCid = await issuerClient.issueBondRequest(
      'Investor1' as Party,
      'US1234567890',
      'USD',
      100000.0,
      today,
      maturityDate,
      0.05, // 5%
      2 // Semi-annual
    );

    // Step 2: Investor accepts the bond
    console.log('\nStep 2: Investor accepting bond...');
    const bondCid = await investor1Client.acceptBondIssuance(requestCid);

    // Step 3: View active bonds
    console.log('\nStep 3: Viewing active bonds...');
    const bonds = await issuerClient.listActiveBonds();
    console.log('Active bonds:', JSON.stringify(bonds, null, 2));

    // Step 4: Pay first coupon
    console.log('\nStep 4: Paying first coupon...');
    await issuerClient.payCoupon(bondCid);

    // Step 5: View coupon payments
    console.log('\nStep 5: Viewing coupon payments...');
    const payments = await investor1Client.listCouponPayments();
    console.log('Coupon payments:', JSON.stringify(payments, null, 2));

    // Step 6: Investor2 creates trade offer
    console.log('\nStep 6: Investor2 creating trade offer...');
    const bondData: BondData = {
      issuer: 'Issuer' as Party,
      isin: 'US1234567890',
      denomination: '100000.0',
      maturityDate: maturityDate.toISOString().split('T')[0],
    };
    const offerCid = await investor2Client.createTradeOffer(
      'Investor1' as Party,
      102000.0,
      'USD',
      bondData
    );

    // Step 7: Investor1 accepts trade
    console.log('\nStep 7: Investor1 accepting trade...');
    const newBondCid = await investor1Client.acceptTradeOffer(offerCid, bondCid);

    console.log('\n✨ Workflow completed successfully!');
    console.log(`Bond now owned by Investor2: ${newBondCid}`);
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Run the example
main().catch(console.error);

export { BondClient };

