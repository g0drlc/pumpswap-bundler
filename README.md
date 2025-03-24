# PumpSwap Bundler

A TypeScript-based transaction bundler for PumpSwap DEX that provides efficient transaction bundling with MEV protection through Jito bundles.

## Features

- 📦 Transaction bundling with configurable limits
- ⚡ Automatic compute budget instructions
- 🔒 MEV protection through Jito bundles
- 📊 Transaction size management
- 🧹 Bundle clearing and reset functionality
- ⚙️ Configurable parameters

## Prerequisites

- Node.js v16 or higher
- npm or yarn
- Solana wallet with SOL for transactions
- Helius RPC key
- Jito bundle access

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pumpswap-sdk
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PRIVATE_KEY=your_private_key
HELIUS_RPC_KEY=your_helius_rpc_key
```

## Configuration

The bundler can be configured with the following parameters:

```typescript
interface BundleConfig {
    maxTransactions: number;    // Maximum transactions per bundle
    tipAmount: number;         // Amount to tip validators
    computeUnits: number;      // Compute units for transactions
    computeUnitPrice: number;  // Price per compute unit
}
```

Example configuration:
```typescript
const config: BundleConfig = {
    maxTransactions: 4,        // Maximum 4 transactions per bundle
    tipAmount: 0.0001,        // 0.0001 SOL tip
    computeUnits: 300000,     // 300,000 compute units
    computeUnitPrice: 696969  // Price per compute unit
};
```

## Usage

1. Import and initialize the bundler:
```typescript
import { PumpSwapBundler } from './src/bundler';

const config: BundleConfig = {
    maxTransactions: 4,
    tipAmount: 0.0001,
    computeUnits: 300000,
    computeUnitPrice: 696969
};

const bundler = new PumpSwapBundler(config);
```

2. Add transactions to the bundle:
```typescript
// Add transactions
bundler.addTransaction(transaction1);
bundler.addTransaction(transaction2);
```

3. Send the bundle:
```typescript
const uuid = await bundler.sendBundle(poolId, signer);
console.log('Bundle sent with UUID:', uuid);
```

4. Clear the bundle:
```typescript
bundler.clear();
```

## API Reference

### Methods

#### `addTransaction(transaction: VersionedTransaction): void`
Adds a transaction to the bundle.
- Throws error if bundle is full
- Automatically adds compute budget instructions

#### `sendBundle(poolId: PublicKey, signer: Keypair): Promise<string>`
Sends the bundle to the network.
- Returns bundle UUID
- Clears bundle after sending
- Throws error if bundle is empty

#### `getSize(): number`
Returns current number of transactions in bundle.

#### `clear(): void`
Clears all transactions from the bundle.

## How It Works

1. Transactions are added to the bundle with size limits
2. Each transaction gets compute budget instructions
3. Bundle is created and sent through Jito
4. MEV protection is applied
5. Bundle is cleared after sending

## Safety Features

- Transaction limit enforcement
- Compute budget management
- MEV protection
- Error handling for empty bundles
- Automatic bundle clearing

## Important Notes

1. Make sure you have enough SOL for:
   - Transaction fees
   - Compute budget
   - Validator tips
2. Monitor bundle size to avoid limits
3. Consider network congestion when setting parameters
4. Use appropriate compute units for your transactions

## Example with PumpSwap SDK

```typescript
import { PumpSwapBundler } from './src/bundler';
import { PumpSwapSDK } from './src/pumpswap';

async function main() {
    // Initialize bundler
    const bundler = new PumpSwapBundler({
        maxTransactions: 4,
        tipAmount: 0.0001,
        computeUnits: 300000,
        computeUnitPrice: 696969
    });

    // Initialize PumpSwap SDK
    const sdk = new PumpSwapSDK();

    // Create buy transaction
    const buyTx = await sdk.createBuyTransaction(/* params */);
    bundler.addTransaction(buyTx);

    // Create sell transaction
    const sellTx = await sdk.createSellTransaction(/* params */);
    bundler.addTransaction(sellTx);

    // Send bundle
    const uuid = await bundler.sendBundle(poolId, signer);
    console.log('Bundle sent:', uuid);
}
```

## License

MIT License

# PumpSwap SDK
# To Get Start
1. `npm i`

2. Paste your private key and Helius RPC key in .env.copy

3. rename it to .env

# Usage

### buy/sell on PumpSwap
```typescript
import {wallet_1} from "./constants";
import {PumpSwapSDK} from './pumpswap';
async function main() {
    const mint = "your-pumpfun-token-address";
    const sol_amt = 0.99; // buy 1 SOL worth of token using WSOL
    const sell_percentage = 0.5; // sell 50% of the token
    const pumpswap_sdk = new PumpSwapSDK();
    await pumpswap_sdk.buy(new PublicKey(mint), wallet_1.publicKey, sol_amt); // 0.99 sol
    await pumpswap_sdk.sell_percentage(new PublicKey(mint), wallet_1.publicKey, sell_percentage);
    await pumpswap_sdk.sell_exactAmount(new PublicKey(mint), wallet_1.publicKey, 1000); // 1000 token
}
```

### Fetch the price
```typescript
import {getPrice} from './pool';
async function main() {
    const mint = new PublicKey("your-pumpfun-token-address");   
    console.log(await getPrice(mint));
}
```

### Fetch the pool
```typescript
import {getPumpSwapPool} from './pool';
async function main() {
    const mint = new PublicKey("your-pumpfun-token-address");   
    console.log(await getPumpSwapPool(mint));
}
```
## Telegram Contact [@g0drlc](https://t.me/g0drlc)

