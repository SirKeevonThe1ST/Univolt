import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { PatientCard } from '../components/PatientCard';
import { PrimaryButton, SyncBar } from '../components/PrimaryButton';
import { colors, spacing, type } from '../components/theme';
import { useRecords } from '../context/RecordsContext';
import type { RootStackParamList } from '../navigation';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { patients, ready, unsyncedCount, mockSync } = useRecords();
  const [syncing, setSyncing] = useState(false);

  const onSync = async () => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 700));
    await mockSync();
    setSyncing(false);
    Alert.alert(
      'Queued for mesh sync',
      'No internet used. When a clinic hub or peer worker is nearby, records will leave this device. Demo handshake complete.'
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={patients}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>OFFLINE PATIENT RECORDS</Text>
            <Text style={styles.title}>Field roster</Text>
            <DisclaimerBanner />
            <SyncBar unsynced={unsyncedCount} onSync={onSync} syncing={syncing} />
            <PrimaryButton label="+ New Patient" onPress={() => navigation.navigate('NewPatient')} />
          </View>
        }
        ListEmptyComponent={
          ready ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No patients stored on this device</Text>
              <Text style={styles.emptyBody}>
                Add a patient, then run a 12-second fingertip scan. Everything stays local — Airplane Mode is fine.
              </Text>
            </View>
          ) : (
            <Text style={styles.emptyBody}>Opening local database…</Text>
          )
        }
        renderItem={({ item }) => (
          <PatientCard
            patient={item}
            onPress={() => navigation.navigate('PatientProfile', { patientId: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.md, gap: 12, paddingBottom: 40 },
  header: { gap: 12, marginBottom: 8 },
  kicker: { color: colors.accent, fontWeight: '800', letterSpacing: 1, fontSize: 12 },
  title: { color: colors.text, fontSize: type.title, fontWeight: '800' },
  empty: { paddingVertical: 28, gap: 8 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  emptyBody: { color: colors.muted, fontSize: 15, lineHeight: 22 },
});
