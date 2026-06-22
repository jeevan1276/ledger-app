import * as SQLite from 'expo-sqlite';
import { getOrCreateDbKey } from '../services/storage';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;

  const key = await getOrCreateDbKey();
  const db = await SQLite.openDatabaseAsync('ledger.db');
  await db.execAsync(`PRAGMA key = '${key}'`);

  // Forces SQLCipher to actually validate the key now, not on first real query
  await db.execAsync('SELECT count(*) FROM sqlite_master;');

  dbInstance = db;
  return dbInstance;
}