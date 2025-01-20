require('dotenv').config();
const { ethers } = require('ethers');

async function main() {
    console.log('\nChecking your setup...\n');

    // Check environment variables
    console.log('1. Checking environment variables:');
    const requiredEnvVars = ['INFURA_PROJECT_ID', 'PRIVATE_KEY', 'ETHERSCAN_API_KEY'];
    requiredEnvVars.forEach(varName => {
        if (process.env[varName]) {
            console.log(`   ✓ ${varName} is set`);
        } else {
            console.log(`   ✗ ${varName} is not set`);
        }
    });

    // Check network connection
    console.log('\n2. Checking network connection:');
    try {
        const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
        const network = await provider.getNetwork();
        console.log(`   ✓ Connected to ${network.name}`);
    } catch (error) {
        console.log('   ✗ Failed to connect to network:', error.message);
    }

    // Check wallet balance
    console.log('\n3. Checking wallet balance:');
    try {
        const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const balance = await provider.getBalance(wallet.address);
        console.log(`   Wallet address: ${wallet.address}`);
        console.log(`   Balance: ${ethers.formatEther(balance)} ETH`);
        if (balance === 0n) {
            console.log('   ⚠️  Warning: Wallet has no ETH. Please get some from a faucet.');
        }
    } catch (error) {
        console.log('   ✗ Failed to check balance:', error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });