import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RecordsProvider } from './context/RecordsContext';
import { RootNavigator } from './navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <RecordsProvider>
        <RootNavigator />
        <StatusBar style="light" />
      </RecordsProvider>
    </SafeAreaProvider>
  );
}
