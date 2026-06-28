import { Transaction } from './types';

// Pure function — no side effects, no mutation, no DB access.
// Takes a list of transactions for ONE contact, returns their net balance.
// Positive = they owe you (more credits than payments)
// Negative = you owe them (more payments than credits)
export function computeBalance(transactions: Transaction[]): number {
  return transactions.reduce((balance, txn) => {
    if (txn.type === 'credit') return balance + txn.amount;
    if (txn.type === 'payment') return balance - txn.amount;
    return balance;
  }, 0);
}