import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from './theme';

export function DisclaimerBanner() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>SCREENING TOOL ONLY</Text>
      <Text style={styles.text}>
        Not a diagnostic replacement for clinical equipment. Heart rate is estimated on-device from
        fingertip pulse. Results are for community screening and triage support.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#1B2F24',
    borderColor: colors.accentDim,
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: 4,
  },
  kicker: {
    color: colors.accent,
    fontWeight: '800',
    letterSpacing: 0.8,
    fontSize: 12,
  },
  text: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});
