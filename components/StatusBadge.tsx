import { StyleSheet, Text, View } from 'react-native';
import type { VitalsStatus } from '../types';
import { colors, radii } from './theme';

const MAP: Record<VitalsStatus, { bg: string; fg: string; label: string }> = {
  Normal: { bg: '#163C32', fg: colors.accent, label: 'Normal' },
  Attention: { bg: '#3A3114', fg: colors.warning, label: 'Attention' },
  Critical: { bg: '#3A1818', fg: colors.danger, label: 'Critical' },
};

export function StatusBadge({ status }: { status: VitalsStatus | null | undefined }) {
  if (!status) {
    return (
      <View style={[styles.badge, { backgroundColor: '#1C333A' }]}>
        <Text style={[styles.text, { color: colors.muted }]}>No scan</Text>
      </View>
    );
  }
  const tone = MAP[status];
  return (
    <View style={[styles.badge, { backgroundColor: tone.bg }]}>
      <Text style={[styles.text, { color: tone.fg }]}>{tone.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  text: {
    fontWeight: '800',
    fontSize: 13,
  },
});
