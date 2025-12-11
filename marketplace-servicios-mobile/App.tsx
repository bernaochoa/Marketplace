import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthProvider } from './src/context/AuthContext'
import { AppStateProvider } from './src/context/AppStateContext'
import Home from './src/pages/Home'
import RoleSelection from './src/pages/RoleSelection'
import type { RootStackParamList } from './src/types/navigation'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppStateProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#ffffff' },
              }}
            >
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="RoleSelection" component={RoleSelection} />
            </Stack.Navigator>
          </NavigationContainer>
        </AppStateProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}
