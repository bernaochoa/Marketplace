import type { NativeStackScreenProps } from '@react-navigation/native-stack'

export type RootStackParamList = {
  Home: undefined
  RoleSelection: undefined
}

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>
export type RoleSelectionScreenProps = NativeStackScreenProps<RootStackParamList, 'RoleSelection'>

