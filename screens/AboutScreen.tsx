import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { colors, spacing, type } from '../components/theme';

export function AboutScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Edge-Health Mesh</Text>
      <Text style={styles.body}>
        Offline-first screening for rural health workers. Patient records live in SQLite on this
        device. Heart rate is estimated from fingertip photoplethysmography (rPPG) in JavaScript —
        no cloud, no API keys, Airplane Mode supported.
      </Text>
      <DisclaimerBanner />
      <Text style={styles.section}>What this MVP measures</Text>
      <Text style={styles.body}>
        Heart rate (BPM) from a 12-second fingertip capture with the rear camera torch. HRV is a
        bonus interval-variance metric. SpO2 and respiratory rate are roadmap items — real SpO2
        needs red + infrared hardware.
      </Text>
      <Text style={styles.section}>Mesh sync (demo)</Text>
      <Text style={styles.body}>
        The Sync button simulates handing records to a clinic hub when connectivity returns. Core
        care flow never waits on a network.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, gap: 14, paddingBottom: 40 },
  title: { color: colors.text, fontSize: type.title, fontWeight: '800' },
  section: { color: colors.text, fontSize: type.h2, fontWeight: '800' },
  body: { color: colors.muted, fontSize: 16, lineHeight: 24 },
});
