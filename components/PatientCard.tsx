import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { PatientListItem } from '../types';
import { StatusBadge } from './StatusBadge';
import { colors, radii, spacing } from './theme';

function formatDate(iso: string | null) {
  if (!iso) return 'No visits yet';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function PatientCard({
  patient,
  onPress,
}: {
  patient: PatientListItem;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{patient.name.slice(0, 1).toUpperCase()}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.name}>{patient.name}</Text>
          <Text style={styles.meta}>
            {patient.age} yrs · {patient.village || 'Location not set'}
          </Text>
          <Text style={styles.visit}>{formatDate(patient.lastVisitAt)}</Text>
        </View>
        <StatusBadge status={patient.lastStatus} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 84,
  },
  pressed: { opacity: 0.85 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: colors.accent, fontWeight: '800', fontSize: 20 },
  body: { flex: 1 },
  name: { color: colors.text, fontSize: 18, fontWeight: '800' },
  meta: { color: colors.muted, marginTop: 2, fontSize: 14 },
  visit: { color: colors.muted, marginTop: 2, fontSize: 12 },
});
