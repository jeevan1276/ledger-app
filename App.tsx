import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { LockProvider, useLock } from './ui/context/LockContext';
import LockScreen from './ui/screens/LockScreen';
import { getDb } from './db/database';

function AppContent() {
  const { isLocked, isPinConfigured, isLoading } = useLock();

  if (isLoading) return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
  if (!isPinConfigured || isLocked) return <LockScreen />;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Ledger App — Unlocked ✓</Text>
    </View>
  );
}

export default function App() {
  useEffect(() => {
    // Warm up the DB connection on launch so the first real query isn't slow
    getDb().catch(console.error);
  }, []);

  return (
    <LockProvider>
      <AppContent />
    </LockProvider>
  );
}