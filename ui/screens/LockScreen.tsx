import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View, Vibration,
} from 'react-native';
import { useLock } from '../context/LockContext';
import { PIN_LENGTH } from '../../domain/constants';

const KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

export default function LockScreen() {
  const { isPinConfigured, setupPin, unlockWithPin, unlockWithBiometric } = useLock();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [setupStage, setSetupStage] = useState<'enter' | 'confirm'>('enter');
  const [error, setError] = useState('');

  // Auto-trigger biometric when lock screen mounts (unlock flow only)
  useEffect(() => {
    if (isPinConfigured) {
      unlockWithBiometric();
    }
  }, []);

  function handleKey(key: string) {
    setError('');
    if (key === '⌫') {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (pin.length >= PIN_LENGTH) return;
    const next = pin + key;
    setPin(next);

    if (next.length === PIN_LENGTH) {
      // Small delay so user sees the last dot fill before action fires
      setTimeout(() => handleComplete(next), 100);
    }
  }

  async function handleComplete(completed: string) {
    if (!isPinConfigured) {
      // Setup flow
      if (setupStage === 'enter') {
        setConfirmPin(completed);
        setPin('');
        setSetupStage('confirm');
      } else {
        if (completed === confirmPin) {
          await setupPin(completed);
        } else {
          Vibration.vibrate(400);
          setError('PINs do not match — try again');
          setPin('');
          setConfirmPin('');
          setSetupStage('enter');
        }
      }
    } else {
      // Unlock flow
      const success = await unlockWithPin(completed);
      if (!success) {
        Vibration.vibrate(400);
        setError('Wrong PIN');
        setPin('');
      }
    }
  }

  const title = !isPinConfigured
    ? setupStage === 'enter' ? 'Set a PIN' : 'Confirm PIN'
    : 'Enter PIN';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {/* PIN dots */}
      <View style={styles.dots}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i < pin.length && styles.dotFilled]}
          />
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Numpad */}
      <View style={styles.pad}>
        {KEYS.map((key, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.key, key === '' && styles.keyEmpty]}
            onPress={() => key && handleKey(key)}
            disabled={key === ''}
            activeOpacity={0.6}
          >
            <Text style={styles.keyText}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Biometric button — only on unlock screen */}
      {isPinConfigured && (
        <TouchableOpacity onPress={unlockWithBiometric} style={styles.biometric}>
          <Text style={styles.biometricText}>Use Biometric</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 32 },
  dots: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: '#333' },
  dotFilled: { backgroundColor: '#333' },
  error: { color: 'red', marginBottom: 12, fontSize: 14 },
  pad: { flexDirection: 'row', flexWrap: 'wrap', width: 270, marginTop: 16 },
  key: { width: 90, height: 70, justifyContent: 'center', alignItems: 'center' },
  keyEmpty: { opacity: 0 },
  keyText: { fontSize: 24, fontWeight: '400' },
  biometric: { marginTop: 24 },
  biometricText: { color: '#007AFF', fontSize: 16 },
});