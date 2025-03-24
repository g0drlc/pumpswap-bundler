import { 
    PublicKey, 
    Keypair, 
    VersionedTransaction, 
    TransactionMessage,
    SystemProgram,
    LAMPORTS_PER_SOL,
    ComputeBudgetProgram
} from '@solana/web3.js';
import { Bundle } from './jito/types';
import { sendBundle } from './jito/bundle';
import { logger } from './utils';
import { connection } from './constants';

interface BundleConfig {
    maxTransactions: number;
    tipAmount: number;
    computeUnits: number;
    computeUnitPrice: number;
}

export class PumpSwapBundler {
    private config: BundleConfig;
    private transactions: VersionedTransaction[] = [];

    constructor(config: BundleConfig) {
        this.config = config;
    }

    /**
     * Add a transaction to the bundle
     */
    public addTransaction(transaction: VersionedTransaction): void {
        if (this.transactions.length >= this.config.maxTransactions) {
            throw new Error(`Bundle cannot exceed ${this.config.maxTransactions} transactions`);
        }
        this.transactions.push(transaction);
    }

    /**
     * Add compute budget instructions to a transaction
     */
    private addComputeBudgetInstructions(transaction: VersionedTransaction): void {
        const computeBudgetIx = [
            ComputeBudgetProgram.setComputeUnitLimit({
                units: this.config.computeUnits,
            }),
            ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: this.config.computeUnitPrice
            })
        ];

        const messageV0 = new TransactionMessage({
            payerKey: transaction.message.staticAccountKeys[0],
            recentBlockhash: transaction.message.recentBlockhash,
            instructions: [...computeBudgetIx, ...transaction.message.compiledInstructions],
        }).compileToV0Message();

        transaction.message = messageV0;
    }

    /**
     * Create and send a bundle
     */
    public async sendBundle(poolId: PublicKey, signer: Keypair): Promise<string> {
        if (this.transactions.length === 0) {
            throw new Error('No transactions to bundle');
        }

        // Add compute budget instructions to each transaction
        this.transactions.forEach(tx => this.addComputeBudgetInstructions(tx));

        // Create bundle
        const bundle = new Bundle(this.transactions, this.config.maxTransactions);

        // Get latest blockhash
        const latestBlockhash = await connection.getLatestBlockhash();

        // Send bundle
        const uuid = await sendBundle(
            false, // isSell
            latestBlockhash.blockhash,
            this.transactions[0], // First transaction
            poolId,
            signer
        );

        // Clear transactions after sending
        this.transactions = [];

        return uuid;
    }

    /**
     * Get current bundle size
     */
    public getSize(): number {
        return this.transactions.length;
    }

    /**
     * Clear all transactions from the bundle
     */
    public clear(): void {
        this.transactions = [];
    }
}

// Example usage
async function main() {
    const config: BundleConfig = {
        maxTransactions: 4,
        tipAmount: 0.0001,
        computeUnits: 300000,
        computeUnitPrice: 696969
    };

    const bundler = new PumpSwapBundler(config);
    
    // Add transactions to bundle
    // bundler.addTransaction(transaction1);
    // bundler.addTransaction(transaction2);
    
    // Send bundle
    // const uuid = await bundler.sendBundle(poolId, signer);
    // console.log('Bundle sent with UUID:', uuid);
} 