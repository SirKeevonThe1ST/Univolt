import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from './theme';

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  tone = 'accent',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  tone?: 'accent' | 'danger' | 'muted';
}) {
  const bg =
    tone === 'danger' ? colors.danger : tone === 'muted' ? colors.cardAlt : colors.accent;
  const fg = tone === 'accent' ? '#06231A' : colors.white;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: disabled ? 0.45 : pressed ? 0.86 : 1 },
      ]}
    >
      {loading ? <ActivityIndicator color={fg} /> : <Text style={[styles.label, { color: fg }]}>{label}</Text>}
    </Pressable>
  );
}

export function SyncBar({
  unsynced,
  onSync,
  syncing,
}: {
  unsynced: number;
  onSync: () => void;
  syncing: boolean;
}) {
  return (
    <View style={styles.sync}>
      <View style={{ flex: 1 }}>
        <Text style={styles.syncTitle}>Sync Status: Not Synced (Offline)</Text>
        <Text style={styles.syncMeta}>
          {unsynced} record{unsynced === 1 ? '' : 's'} waiting · no internet required to work
        </Text>
      </View>
      <Pressable onPress={onSync} disabled={syncing} style={styles.syncBtn}>
        <Text style={styles.syncBtnText}>{syncing ? 'Syncing…' : 'Sync'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 56,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  label: { fontSize: 17, fontWeight: '800' },
  sync: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  syncTitle: { color: colors.warning, fontWeight: '800', fontSize: 13 },
  syncMeta: { color: colors.muted, fontSize: 12, marginTop: 2 },
  syncBtn: {
    backgroundColor: colors.cardAlt,
    paddingHorizontal: 16,
    minHeight: 44,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncBtnText: { color: colors.text, fontWeight: '800' },
});
