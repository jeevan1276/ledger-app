import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { getDb } from './db/database';

export default function App() {
  const [status, setStatus] = useState('testing...');

  useEffect(() => {
    async function verify() {
      // Step 1: confirm normal open still works
      await getDb();

      // Step 2: try opening WITHOUT the key — must throw
      try {
        const badDb = await SQLite.openDatabaseAsync('ledger.db');
        await badDb.execAsync('SELECT count(*) FROM sqlite_master;');
        setStatus('❌ FAIL — DB opened without key, not encrypted');
      } catch (e) {
        setStatus('✅ PASS — DB rejected access without key, encryption confirmed');
      }
    }
    verify().catch((e) => setStatus(`error: ${e}`));
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ textAlign: 'center', padding: 20 }}>{status}</Text>
    </View>
  );
}