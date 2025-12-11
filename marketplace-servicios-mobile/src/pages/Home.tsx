import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { colors, shadows, borderRadius, spacing } from '../constants/theme'
import Svg, { Path } from 'react-native-svg'

const benefits = [
  {
    title: 'Gestión completa',
    body: 'Administra demandas, cotizaciones y packs desde un mismo panel con visibilidad total.',
    color: '#10b5e8',
    bgColor: 'rgba(16, 181, 232, 0.12)',
    icon: (
      <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <Path
          d="M9.333 4.667H6.3a2.3 2.3 0 0 0-2.3 2.3v14.066a2.3 2.3 0 0 0 2.3 2.3h15.4a2.3 2.3 0 0 0 2.3-2.3V11.2L17.5 4.667H9.333Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path d="M17.5 4.667v6.534H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M9.333 15.167h9.334M9.333 19.833h5.834" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
  },
  {
    title: 'Procesos más rápidos',
    body: 'Compará propuestas en segundos con métricas claras de precio, plazo y rating.',
    color: '#0a7b66',
    bgColor: 'rgba(14, 165, 145, 0.12)',
    icon: (
      <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <Path
          d="M23.333 7 14 2.333 4.667 7v6.3c0 6.533 4.867 12.133 9.333 12.7 4.466-.567 9.333-6.167 9.333-12.7V7Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path d="M14 14v-5.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
  },
  {
    title: 'Seguro y transparente',
    body: 'Trazabilidad completa de cada interacción con historial y registros accesibles.',
    color: '#c25607',
    bgColor: 'rgba(255, 159, 90, 0.15)',
    icon: (
      <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <Path d="M14 17.5v-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M13.987 6.417a2.916 2.916 0 1 0 .026 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path
          d="m8.4 3.5 15 4.667-3.7 12V24.5L5.6 20.5V7.2a3.7 3.7 0 0 1 2.8-3.567Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
  },
]

const roles = ['Solicitantes', 'Proveedores de servicio', 'Proveedores de insumos']

import type { HomeScreenProps } from '../types/navigation'

const Home = ({ navigation }: HomeScreenProps) => {
  const { isAuthenticated } = useAuth()

  return (
    <View style={styles.container}>
      <Header
        isAuthenticated={isAuthenticated}
        isHomePage={true}
        onNavigateToRoleSelection={() => navigation.navigate('RoleSelection')}
      />
      <LinearGradient
        colors={[colors.bgGradientStart, colors.bgGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <View style={styles.heroContent}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Conectando oportunidades</Text>
            </View>

            <Text style={styles.title}>
              El marketplace que conecta <Text style={styles.titleHighlight}>servicios e insumos</Text>
            </Text>

            <Text style={styles.description}>
              ServiciosMarket centraliza los procesos de compra pública y privada para que equipos de solicitantes y
              proveedores colaboren con información clara, tiempos ágiles y trazabilidad desde el primer contacto.
            </Text>

            <View style={styles.rolesList}>
              {roles.map((role) => (
                <View key={role} style={styles.roleItem}>
                  <View style={styles.roleIcon}>
                    <View style={styles.roleIconCheck} />
                  </View>
                  <Text style={styles.roleText}>{role}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate('RoleSelection')}
            >
              <Text style={styles.ctaButtonText}>Explorar roles</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardsSection}>
            <View style={[styles.card, styles.cardLarge]}>
              <View style={[styles.benefitIcon, { backgroundColor: benefits[0].bgColor }]}>
                <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <Path
                    d="M9.333 4.667H6.3a2.3 2.3 0 0 0-2.3 2.3v14.066a2.3 2.3 0 0 0 2.3 2.3h15.4a2.3 2.3 0 0 0 2.3-2.3V11.2L17.5 4.667H9.333Z"
                    stroke={benefits[0].color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path d="M17.5 4.667v6.534H24" stroke={benefits[0].color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <Path d="M9.333 15.167h9.334M9.333 19.833h5.834" stroke={benefits[0].color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <Text style={styles.cardTitle}>{benefits[0].title}</Text>
              <Text style={styles.cardBody}>{benefits[0].body}</Text>
            </View>

            <View style={styles.cardGrid}>
              {benefits.slice(1).map((benefit) => (
                <View key={benefit.title} style={styles.card}>
                  <View style={[styles.benefitIcon, { backgroundColor: benefit.bgColor }]}>
                    {benefit.icon}
                  </View>
                  <Text style={styles.cardTitle}>{benefit.title}</Text>
                  <Text style={styles.cardBody}>{benefit.body}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
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
    paddingBottom: 40,
  },
  heroContent: {
    marginBottom: 32,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(16, 181, 232, 0.12)',
    marginBottom: 24,
  },
  badgeText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
    color: colors.textMain,
    marginBottom: 18,
  },
  titleHighlight: {
    color: colors.primary,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMuted,
    marginBottom: 32,
  },
  rolesList: {
    gap: 12,
    marginBottom: 24,
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleIconCheck: {
    width: 6,
    height: 10,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.primary,
    transform: [{ rotate: '45deg' }],
    marginTop: -2,
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMain,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: borderRadius.full,
    ...shadows.cardSoft,
  },
  ctaButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  cardsSection: {
    gap: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: 28,
    ...shadows.card,
    borderWidth: 1,
    borderColor: 'rgba(15, 34, 52, 0.05)',
  },
  cardLarge: {
    minHeight: 260,
  },
  cardGrid: {
    gap: 20,
  },
  benefitIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textMain,
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
})

export default Home

