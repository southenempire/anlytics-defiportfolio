import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export async function getTokenAccounts(walletAddress: PublicKey, connection: Connection) {
    try {
        const tokenAccounts = await connection.getTokenAccountsByOwner(walletAddress, { programId: TOKEN_PROGRAM_ID });
        return tokenAccounts.value.map(({ pubkey, account }) => ({
            address: pubkey.toBase58(),
            balance: account.lamports / 1e9 // Convert lamports to SOL
        }));
    } catch (error) {
        console.error('Error fetching token accounts:', error);
        throw error;
    }
}