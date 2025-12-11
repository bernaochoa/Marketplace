import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../data/initialData'
import { colors, shadows, borderRadius } from '../constants/theme'
import Svg, { Rect, Path, Circle } from 'react-native-svg'

interface HeaderProps {
  isAuthenticated: boolean
  currentRole?: UserRole
  onChangeUser?: () => void
  onLogout?: () => void
  onNavigateToRoleSelection?: () => void
  onNavigateToHome?: () => void
  isHomePage?: boolean
  isRoleSelectionPage?: boolean
}

const LogoMark = ({ isHome = false }: { isHome?: boolean }) => {
  const size = 48
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Rect x="4" y="12" width="26" height="26" rx="8" fill={colors.secondary} />
      <Path
        d="M11 25.5 21 16l10 9.5v11c0 .828-.672 1.5-1.5 1.5h-7v-7h-4v7h-7c-.828 0-1.5-.672-1.5-1.5v-11Z"
        fill={isHome ? colors.white : colors.primary}
      />
      {!isHome && (
        <>
          <Circle cx="34" cy="17" r="6" stroke={colors.secondary} strokeWidth="2" fill={colors.white} />
          <Path
            d="M34 13v2M34 19v2M38 17h-2M32 17h-2M37.242 20.242l-1.414-1.414M31.172 14.172l-1.414-1.414M37.242 13.758l-1.414 1.414M31.172 19.828l1.414 1.414"
            stroke={colors.primary}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
    </Svg>
  )
}

export const Header = ({
  isAuthenticated,
  currentRole,
  onChangeUser,
  onLogout,
  onNavigateToRoleSelection,
  onNavigateToHome,
  isHomePage = false,
  isRoleSelectionPage = false,
}: HeaderProps) => {
  const { currentUser } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const roleLabel = currentRole?.replace('_', ' ') ?? ''

  return (
    <View style={[styles.header, isHomePage && styles.headerHome]}>
      <View style={[styles.container, isHomePage && styles.containerHome]}>
        <View style={styles.logoContainer}>
          <View style={[styles.logoWrapper, isHomePage && styles.logoWrapperHome]}>
            <LogoMark isHome={isHomePage} />
          </View>
          {!isHomePage && (
            <View style={styles.logoText}>
              <Text style={styles.logoTextTop}>
                <Text style={styles.logoTextDark}>Servicios</Text>
                <Text style={styles.logoTextPrimary}>Market</Text>
              </Text>
              <Text style={styles.logoTextBottom}>Marketplace de Servicios</Text>
            </View>
          )}
        </View>

        {isAuthenticated && currentRole && (
          <View style={[styles.roleBadge, isHomePage && styles.roleBadgeHome]}>
            <Text style={[styles.roleBadgeText, isHomePage && styles.roleBadgeTextHome]}>
              {roleLabel}
            </Text>
          </View>
        )}

        <View style={styles.actions}>
          {isAuthenticated && currentUser ? (
            <>
              <TouchableOpacity
                style={[styles.userButton, isHomePage && styles.userButtonHome]}
                onPress={() => setMenuOpen(true)}
              >
                <View style={[styles.avatar, { backgroundColor: currentUser.avatarColor }]}>
                  <Text style={styles.avatarText}>
                    {currentUser.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)}
                  </Text>
                </View>
              </TouchableOpacity>
              <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
                <TouchableOpacity
                  style={styles.modalOverlay}
                  activeOpacity={1}
                  onPress={() => setMenuOpen(false)}
                >
                  <View style={styles.menu}>
                    <View style={styles.menuHeader}>
                      <Text style={styles.menuName}>{currentUser.name}</Text>
                      <Text style={styles.menuRole}>{currentUser.role.replace('_', ' ')}</Text>
                    </View>
                    {onChangeUser && (
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                          setMenuOpen(false)
                          onChangeUser()
                        }}
                      >
                        <Text style={styles.menuItemText}>Cambiar de Rol/Usuario</Text>
                      </TouchableOpacity>
                    )}
                    {onLogout && (
                      <TouchableOpacity
                        style={[styles.menuItem, styles.menuItemDanger]}
                        onPress={() => {
                          setMenuOpen(false)
                          onLogout()
                        }}
                      >
                        <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Salir</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              </Modal>
            </>
          ) : isRoleSelectionPage ? (
            <TouchableOpacity style={styles.button} onPress={onNavigateToHome}>
              <Text style={styles.buttonText}>Volver al inicio</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, isHomePage && styles.buttonHome]}
              onPress={onNavigateToRoleSelection}
            >
              <Text style={[styles.buttonText, isHomePage && styles.buttonTextHome]}>Iniciar sesión</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 12,
  },
  headerHome: {
    backgroundColor: '#1A9BC4',
    borderBottomColor: '#1A9BC4',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  containerHome: {
    paddingHorizontal: 0,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  logoWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#e9fbff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapperHome: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoText: {
    flex: 1,
  },
  logoTextTop: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  logoTextDark: {
    color: colors.secondary,
  },
  logoTextPrimary: {
    color: colors.primary,
  },
  logoTextBottom: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#d0f7ff',
    backgroundColor: '#e9fbff',
    marginRight: 12,
  },
  roleBadgeHome: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: colors.secondary,
    letterSpacing: 0.5,
  },
  roleBadgeTextHome: {
    color: colors.white,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  userButtonHome: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: colors.white,
  },
  buttonHome: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMain,
  },
  buttonTextHome: {
    color: colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  menu: {
    width: 240,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    ...shadows.card,
  },
  menuHeader: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 8,
  },
  menuName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMain,
  },
  menuRole: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  menuItemDanger: {
    marginTop: 4,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMain,
  },
  menuItemTextDanger: {
    color: '#dc2626',
  },
})

export default Header

