import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { NewPatientInput, NewVitalsInput, PatientListItem } from '../types';
import {
  createPatient,
  getPatients,
  getUnsyncedCount,
  initDatabase,
  markAllVitalsSynced,
  saveVitals,
} from '../services/database';

type RecordsContextValue = {
  ready: boolean;
  patients: PatientListItem[];
  unsyncedCount: number;
  refresh: () => Promise<void>;
  addPatient: (input: NewPatientInput) => Promise<number>;
  addVitals: (input: NewVitalsInput) => Promise<number>;
  mockSync: () => Promise<void>;
};

const RecordsContext = createContext<RecordsContextValue | null>(null);

export function RecordsProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [unsyncedCount, setUnsyncedCount] = useState(0);

  const refresh = useCallback(async () => {
    const [list, unsynced] = await Promise.all([getPatients(), getUnsyncedCount()]);
    setPatients(list);
    setUnsyncedCount(unsynced);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await initDatabase();
      if (cancelled) return;
      await refresh();
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const addPatient = useCallback(
    async (input: NewPatientInput) => {
      const id = await createPatient(input);
      await refresh();
      return id;
    },
    [refresh]
  );

  const addVitals = useCallback(
    async (input: NewVitalsInput) => {
      const id = await saveVitals(input);
      await refresh();
      return id;
    },
    [refresh]
  );

  const mockSync = useCallback(async () => {
    await markAllVitalsSynced();
    await refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ ready, patients, unsyncedCount, refresh, addPatient, addVitals, mockSync }),
    [ready, patients, unsyncedCount, refresh, addPatient, addVitals, mockSync]
  );

  return <RecordsContext.Provider value={value}>{children}</RecordsContext.Provider>;
}

export function useRecords() {
  const ctx = useContext(RecordsContext);
  if (!ctx) throw new Error('useRecords must be used inside RecordsProvider');
  return ctx;
}
