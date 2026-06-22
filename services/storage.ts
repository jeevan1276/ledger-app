import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const DB_KEY_STORAGE_KEY = 'db_encryption_key';

/**
 * Returns the SQLCipher key for the local database — generates a random
 * 256-bit key on first call and persists it in the OS keychain/keystore.
 * Every later call returns the same key.
 */
export async function getOrCreateDbKey(): Promise<string> {
  const existing = await SecureStore.getItemAsync(DB_KEY_STORAGE_KEY);
  if (existing) return existing;

  const randomBytes = await Crypto.getRandomBytesAsync(32);
  const newKey = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  await SecureStore.setItemAsync(DB_KEY_STORAGE_KEY, newKey);
  return newKey;
}