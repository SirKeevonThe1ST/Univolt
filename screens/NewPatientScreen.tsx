import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors, radii, spacing } from '../components/theme';
import { useRecords } from '../context/RecordsContext';
import type { RootStackParamList } from '../navigation';
import type { Sex } from '../types';

const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
];

export function NewPatientScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { addPatient } = useRecords();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<Sex>('female');
  const [village, setVillage] = useState('');
  const [contact, setContact] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const onSave = async () => {
    const parsedAge = Number(age);
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!Number.isFinite(parsedAge) || parsedAge < 0 || parsedAge > 120) {
      setError('Enter a valid age.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const id = await addPatient({
        name,
        age: Math.round(parsedAge),
        sex,
        village,
        contact,
      });
      navigation.replace('PatientProfile', { patientId: id });
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.lead}>Stored only on this phone. No account, no cloud.</Text>

        <Field label="Full name">
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Asha Devi"
            placeholderTextColor={colors.muted}
            style={styles.input}
            autoCapitalize="words"
          />
        </Field>

        <Field label="Age (years)">
          <TextInput
            value={age}
            onChangeText={setAge}
            placeholder="42"
            placeholderTextColor={colors.muted}
            style={styles.input}
            keyboardType="number-pad"
          />
        </Field>

        <Text style={styles.label}>Sex</Text>
        <View style={styles.sexRow}>
          {SEX_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setSex(option.value)}
              style={[styles.sexChip, sex === option.value && styles.sexChipOn]}
            >
              <Text style={[styles.sexText, sex === option.value && styles.sexTextOn]}>{option.label}</Text>
            </Pressable>
          ))}
        </View>

        <Field label="Village / location">
          <TextInput
            value={village}
            onChangeText={setVillage}
            placeholder="Ward, hamlet, or camp"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </Field>

        <Field label="Contact (optional)">
          <TextInput
            value={contact}
            onChangeText={setContact}
            placeholder="Phone or family name"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </Field>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton label="Save to this device" onPress={onSave} loading={saving} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, gap: 16, paddingBottom: 40 },
  lead: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  label: { color: colors.text, fontWeight: '800', fontSize: 14 },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.md,
    color: colors.text,
    fontSize: 18,
    minHeight: 56,
    paddingHorizontal: 16,
  },
  sexRow: { flexDirection: 'row', gap: 8 },
  sexChip: {
    flex: 1,
    minHeight: 52,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sexChipOn: { borderColor: colors.accent, backgroundColor: '#163C32' },
  sexText: { color: colors.muted, fontWeight: '700', fontSize: 16 },
  sexTextOn: { color: colors.accent },
  error: { color: colors.danger, fontWeight: '700' },
});
