import React, {
  createContext, useCallback, useContext,
  useEffect, useState,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as lockService from '../../services/lockService';

type LockContextType = {
  isLocked: boolean;
  isPinConfigured: boolean;
  isLoading: boolean;
  setupPin: (pin: string) => Promise<void>;
  unlockWithPin: (pin: string) => Promise<boolean>;
  unlockWithBiometric: () => Promise<boolean>;
};

const LockContext = createContext<LockContextType | null>(null);

export function LockProvider({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(true);
  const [isPinConfigured, setIsPinConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const pinSet = await lockService.isPinSet();
      setIsPinConfigured(pinSet);
      setIsLoading(false);
      if (pinSet) {
        // Try biometric immediately on launch — fastest path for the user
        const available = await lockService.isBiometricAvailable();
        if (available) {
          const success = await lockService.authenticateWithBiometric();
          if (success) setIsLocked(false);
        }
      }
    }
    init();
  }, []);

  useEffect(() => {
    // Lock whenever app leaves foreground
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'background' || state === 'inactive') {
        setIsLocked(true);
      }
    });
    return () => sub.remove();
  }, []);

  const setupPin = useCallback(async (pin: string) => {
    await lockService.setupPin(pin);
    setIsPinConfigured(true);
    setIsLocked(false);
  }, []);

  const unlockWithPin = useCallback(async (pin: string): Promise<boolean> => {
    const success = await lockService.verifyPin(pin);
    if (success) setIsLocked(false);
    return success;
  }, []);

  const unlockWithBiometric = useCallback(async (): Promise<boolean> => {
    const success = await lockService.authenticateWithBiometric();
    if (success) setIsLocked(false);
    return success;
  }, []);

  return (
    <LockContext.Provider value={{
      isLocked, isPinConfigured, isLoading,
      setupPin, unlockWithPin, unlockWithBiometric,
    }}>
      {children}
    </LockContext.Provider>
  );
}

export function useLock(): LockContextType {
  const ctx = useContext(LockContext);
  if (!ctx) throw new Error('useLock must be used inside LockProvider');
  return ctx;
}