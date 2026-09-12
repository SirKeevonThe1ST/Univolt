import { useFocusEffect, useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton, SyncBar } from '../components/PrimaryButton';
import { StatusBadge } from '../components/StatusBadge';
import { colors, radii, spacing, type } from '../components/theme';
import { useRecords } from '../context/RecordsContext';
import type { RootStackParamList } from '../navigation';
import { getPatient, getVitalsForPatient } from '../services/database';
import type { Patient, VitalsRecord } from '../types';

export function PatientProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'PatientProfile'>>();
  const { unsyncedCount, mockSync } = useRecords();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [vitals, setVitals] = useState<VitalsRecord[]>([]);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(async () => {
    const [p, v] = await Promise.all([
      getPatient(route.params.patientId),
      getVitalsForPatient(route.params.patientId),
    ]);
    setPatient(p);
    setVitals(v);
  }, [route.params.patientId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onSync = async () => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 600));
    await mockSync();
    await load();
    setSyncing(false);
  };

  if (!patient) {
    return (
      <View style={styles.screen}>
        <Text style={styles.meta}>Loading local record…</Text>
      </View>
    );
  }

  const chronological = [...vitals].reverse();
  const maxHr = Math.max(120, ...chronological.map((v) => v.heartRate));

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.name}>{patient.name}</Text>
      <Text style={styles.meta}>
        {patient.age} years · {patient.sex} · {patient.village || 'No location'}
      </Text>
      {patient.contact ? <Text style={styles.meta}>Contact: {patient.contact}</Text> : null}

      <PrimaryButton
        label="Start vitals scan"
        onPress={() => navigation.navigate('VitalsScan', { patientId: patient.id })}
      />

      <SyncBar unsynced={unsyncedCount} onSync={onSync} syncing={syncing} />

      <Text style={styles.section}>Heart rate over visits</Text>
      {chronological.length < 2 ? (
        <Text style={styles.meta}>Need two or more scans for a trend line. Latest values still list below.</Text>
      ) : (
        <View style={styles.chart}>
          {chronological.map((v) => (
            <View key={v.id} style={styles.barCol}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: `${Math.round((v.heartRate / maxHr) * 100)}%` }]} />
              </View>
              <Text style={styles.barLabel}>{v.heartRate}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.section}>Saved scans</Text>
      {vitals.length === 0 ? (
        <Text style={styles.meta}>No vitals yet. Run a fingertip scan to create the first record.</Text>
      ) : (
        vitals.map((v) => (
          <View key={v.id} style={styles.visit}>
            <View style={{ flex: 1 }}>
              <Text style={styles.visitHr}>{v.heartRate} BPM</Text>
              <Text style={styles.meta}>
                {new Date(v.capturedAt).toLocaleString()} · HRV {v.hrvMs ?? '—'} ms
              </Text>
              <Text style={styles.meta}>
                Quality {Math.round(v.signalQuality * 100)}% · {v.synced ? 'Marked synced' : 'Not synced (offline)'}
              </Text>
            </View>
            <StatusBadge status={v.status} />
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, gap: 14, paddingBottom: 40 },
  name: { color: colors.text, fontSize: type.title, fontWeight: '800' },
  meta: { color: colors.muted, fontSize: 15, lineHeight: 21 },
  section: { color: colors.text, fontSize: type.h2, fontWeight: '800', marginTop: 8 },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    height: 140,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  barCol: { flex: 1, alignItems: 'center', gap: 6, height: '100%' },
  barTrack: {
    flex: 1,
    width: '70%',
    backgroundColor: colors.cardAlt,
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: { width: '100%', backgroundColor: colors.accent, borderRadius: 8 },
  barLabel: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  visit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  visitHr: { color: colors.text, fontSize: 22, fontWeight: '800' },
});
