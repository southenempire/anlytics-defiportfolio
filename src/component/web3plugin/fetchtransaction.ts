import { Connection, ParsedTransactionWithMeta, ParsedInstruction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

export interface SimplifiedTransactionDetail {
  message: string;
  status: 'success' | 'failure';
  signature: string;
  date: string;
}

export const useFetchTransactions = () => {
  const { publicKey } = useWallet();

  const parseTransaction = (tx: ParsedTransactionWithMeta): string => {
    const instructions = tx.transaction.message.instructions;
    const userPubkey = publicKey?.toBase58();

    let operations = new Set<string>();
    let involvedPrograms = new Set<string>();

    const parseTokenTransfer = (ix: ParsedInstruction) => {
      if (ix.parsed.info.source === userPubkey) {
        operations.add('send');
      } else if (ix.parsed.info.destination === userPubkey) {
        operations.add('receive');
      }
    };

    const parseSystemTransfer = (ix: ParsedInstruction) => {
      if (ix.parsed.info.source === userPubkey) {
        operations.add('send');
      } else if (ix.parsed.info.destination === userPubkey) {
        operations.add('receive');
      }
    };

    for (const ix of instructions) {
      if ('programId' in ix) {
        involvedPrograms.add(ix.programId.toBase58());
      }

      if ('parsed' in ix) {
        if (ix.program === 'spl-token') {
          if (['transfer', 'transferChecked'].includes(ix.parsed.type)) {
            parseTokenTransfer(ix);
          }
        } else if (ix.program === 'system') {
          if (ix.parsed.type === 'transfer') {
            parseSystemTransfer(ix);
          }
        }
      }
    }

    const knownSwapPrograms = [
      'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB',
      '9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP',
      'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc',
    ];

    if (knownSwapPrograms.some(program => involvedPrograms.has(program))) {
      operations.add('swap');
    }

    if (operations.has('swap')) {
      return "Swapped";
    } else if (operations.has('send') && operations.has('receive')) {
      return "Swapped";
    } else if (operations.has('send')) {
      return "Sent";
    } else if (operations.has('receive')) {
      return "Received";
    } else {
      if (involvedPrograms.has('ComputeBudget111111111111111111111111111111')) {
        return "App Integration";
      } else if (involvedPrograms.has('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')) {
        return "App Integration";
      } else if (involvedPrograms.has('11111111111111111111111111111111')) {
        return "App Integration";
      } else {
        return "App Integration";
      }
    }
  };

  const fetchTransactions = async (
connection: Connection, limit: number = 10, _pubkey: unknown, _p0: string | undefined): Promise<SimplifiedTransactionDetail[]> => {
    if (!publicKey) {
      throw new Error("Wallet not connected");
    }

    let rateLimitCount = 0;
    const MAX_RETRIES = 3;
    const BASE_DELAY_MS = 500;

    const fetchWithRetry = async (fn: () => Promise<any>, retries = MAX_RETRIES): Promise<any> => {
      try {
        return await fn();
      } catch (error: any) {
        if (error.message.includes('429') && retries > 0) {
          rateLimitCount++;
          const delay = BASE_DELAY_MS * Math.pow(2, MAX_RETRIES - retries);
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchWithRetry(fn, retries - 1);
        }
        throw error;
      }
    };

    try {
      const signatures = await fetchWithRetry(() => 
        connection.getSignaturesForAddress(publicKey, { limit })
      );

      const transactions: SimplifiedTransactionDetail[] = [];

      for (const { signature, slot, err } of signatures) {
        try {
          const tx = await fetchWithRetry(() => 
            connection.getParsedTransaction(signature, { maxSupportedTransactionVersion: 0 })
          );

          if (tx) {
            const message = parseTransaction(tx);
            const timestamp = await fetchWithRetry(() => connection.getBlockTime(slot)) ?? 0;
            const date = new Date(timestamp * 1000).toLocaleDateString();

            transactions.push({
              message,
              status: err ? 'failure' : 'success',
              signature,
              date
            });
          }
        } catch (error) {
          console.error(`Failed to process transaction ${signature}:`, error);
          continue;
        }

        // Add small delay between transaction processing
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      return transactions;
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      throw error;
    }
  };

  return fetchTransactions;
};