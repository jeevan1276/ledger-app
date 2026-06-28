import * as SQLite from 'expo-sqlite';
import { getOrCreateDbKey } from '../services/storage';
import { CREATE_TABLES } from './schema';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;

  const key = await getOrCreateDbKey();
  const db = await SQLite.openDatabaseAsync('ledger.db');
  await db.execAsync(`PRAGMA key = '${key}'`);
  await db.execAsync('SELECT count(*) FROM sqlite_master;');

  // Run schema creation on every launch — IF NOT EXISTS makes this safe
  await db.execAsync(CREATE_TABLES);

  dbInstance = db;
  return dbInstance;
}