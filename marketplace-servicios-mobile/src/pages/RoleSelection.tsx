import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../data/initialData'
import { colors, shadows, borderRadius } from '../constants/theme'
import Svg, { Circle, Path } from 'react-native-svg'

const roles: Array<{
  id: UserRole
  title: string
  description: string
  accentColor: string
  accentBg: string
  icon: React.ReactNode
}> = [
  {
    id: 'SOLICITANTE',
    title: 'Solicitante',
    description: 'Publico y gestiono los servicios o insumos que necesito.',
    accentColor: 'rgba(16, 181, 232, 0.5)',
    accentBg: 'rgba(16, 181, 232, 0.08)',
    icon: (
      <Svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <Circle cx="26" cy="18" r="9" stroke={colors.primary} strokeWidth="3" />
        <Path d="M12 42c2.6-7 8.667-10.5 14-10.5s11.4 3.5 14 10.5" stroke={colors.primary} strokeWidth="3" strokeLinecap="round" />
      </Svg>
    ),
  },
  {
    id: 'PROVEEDOR_SERVICIO',
    title: 'Proveedor de Servicio',
    description: 'Ofrezco mis servicios profesionales para licitaciones.',
    accentColor: 'rgba(255, 159, 90, 0.7)',
    accentBg: 'rgba(255, 159, 90, 0.15)',
    icon: (
      <Svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <Path
          d="m15 33 7-7m8-8 7-7M11 37l8.5-1.5L36.5 18M13 25l4 4M29 11l4 4"
          stroke="#c6580e"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M41.5 33.5c5-1 7 7 2 8s-7-7-2-8ZM10.5 16.5c5-1 7 7 2 8s-7-7-2-8Z"
          stroke="#c6580e"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </Svg>
    ),
  },
  {
    id: 'PROVEEDOR_INSUMOS',
    title: 'Proveedor de Insumos',
    description: 'Vendo materiales, repuestos y packs con descuento.',
    accentColor: 'rgba(16, 185, 129, 0.7)',
    accentBg: 'rgba(16, 185, 129, 0.15)',
    icon: (
      <Svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <Path
          d="M10 17 26 8l16 9v16L26 42 10 33V17Zm32 0L26 26 10 17"
          stroke="#0f8c60"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <Path d="M26 26v16" stroke="#0f8c60" strokeWidth="3" strokeLinecap="round" />
      </Svg>
    ),
  },
]

import type { RoleSelectionScreenProps } from '../types/navigation'

type RoleSelectionProps = RoleSelectionScreenProps & {
  onSelectRole?: (role: UserRole) => void
}

const RoleSelection = ({ navigation, onSelectRole }: RoleSelectionProps) => {
  const { isAuthenticated } = useAuth()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  const handleSelect = (role: UserRole) => {
    setSelectedRole(role)
    if (onSelectRole) {
      onSelectRole(role)
    }
  }

  const handleCloseModal = () => {
    setSelectedRole(null)
  }

  return (
    <View style={styles.container}>
      <Header
        isAuthenticated={isAuthenticated}
        isRoleSelectionPage={true}
        onNavigateToHome={() => navigation.navigate('Home')}
      />
      <LinearGradient
        colors={[colors.bgGradientStart, colors.bgGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <View style={styles.shell}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.backArrow}>←</Text>
              <Text style={styles.backText}>Volver al inicio</Text>
            </TouchableOpacity>

            <View style={styles.mark}>
              <Text style={styles.markText}>SM</Text>
            </View>

            <View style={styles.heading}>
              <Text style={styles.headingTitle}>Bienvenido a ServiciosMarket</Text>
              <Text style={styles.headingSubtitle}>Selecciona tu rol para continuar</Text>
            </View>

            <View style={styles.grid}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  style={[styles.roleCard, { borderColor: role.accentColor }]}
                  onPress={() => handleSelect(role.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.roleCardIcon, { backgroundColor: role.accentBg }]}>
                    {role.icon}
                  </View>
                  <Text style={styles.roleCardTitle}>{role.title}</Text>
                  <Text style={styles.roleCardDescription}>{role.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>

      {selectedRole && (
        <Modal visible={!!selectedRole} transparent animationType="fade" onRequestClose={handleCloseModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Login para {roles.find(r => r.id === selectedRole)?.title}</Text>
              <Text style={styles.modalText}>Funcionalidad de login próximamente</Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
                <Text style={styles.modalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  shell: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: 28,
    ...shadows.card,
    gap: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  backArrow: {
    fontSize: 20,
    color: colors.textMain,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMain,
  },
  mark: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  markText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  heading: {
    alignItems: 'center',
  },
  headingTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textMain,
    marginBottom: 4,
    textAlign: 'center',
  },
  headingSubtitle: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
  },
  grid: {
    gap: 16,
    marginTop: 16,
  },
  roleCard: {
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: colors.white,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  roleCardIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textMain,
    textAlign: 'center',
  },
  roleCardDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textMain,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: borderRadius.full,
    alignSelf: 'center',
  },
  modalButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
})

export default RoleSelection

