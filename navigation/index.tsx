import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { NewPatientScreen } from '../screens/NewPatientScreen';
import { PatientProfileScreen } from '../screens/PatientProfileScreen';
import { VitalsScanScreen } from '../screens/VitalsScanScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { colors } from '../components/theme';

export type RootStackParamList = {
  MainTabs: undefined;
  NewPatient: undefined;
  PatientProfile: { patientId: number };
  VitalsScan: { patientId: number };
};

export type TabParamList = {
  Patients: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bgElevated,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
  },
};

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{ color: focused ? colors.accent : colors.muted, fontWeight: '800', fontSize: 12 }}>
      {label}
    </Text>
  );
}

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '800' },
        tabBarStyle: {
          backgroundColor: colors.bgElevated,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tabs.Screen
        name="Patients"
        component={HomeScreen}
        options={{
          title: 'Edge-Health Mesh',
          tabBarIcon: ({ focused }) => <TabIcon label="●" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'About',
          tabBarIcon: ({ focused }) => <TabIcon label="i" focused={focused} />,
        }}
      />
    </Tabs.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '800' },
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="NewPatient" component={NewPatientScreen} options={{ title: 'New Patient' }} />
        <Stack.Screen name="PatientProfile" component={PatientProfileScreen} options={{ title: 'Patient Record' }} />
        <Stack.Screen
          name="VitalsScan"
          component={VitalsScanScreen}
          options={{ title: 'Vitals Scan', headerBackTitle: 'Back' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
