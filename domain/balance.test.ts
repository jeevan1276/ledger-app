import { computeBalance } from './balance';
import { Transaction } from './types';

// We only need `type` and `amount` for balance logic —
// casting lets us omit irrelevant fields in tests without TS errors
const t = (type: 'credit' | 'payment', amount: number) =>
  ({ type, amount } as Transaction);

test('returns 0 for empty transaction list', () => {
  expect(computeBalance([])).toBe(0);
});
test('single credit increases balance', () => {
  expect(computeBalance([t('credit', 100)])).toBe(100);
});
test('single payment decreases balance', () => {
  expect(computeBalance([t('payment', 50)])).toBe(-50);
});
test('credit then payment nets correctly', () => {
  expect(computeBalance([t('credit', 100), t('payment', 50)])).toBe(50);
});
test('balance can go negative if payments exceed credits', () => {
  expect(computeBalance([t('credit', 100), t('payment', 150)])).toBe(-50);
});