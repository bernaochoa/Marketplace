# Instrucciones de Instalación - ServiciosMarket Mobile

## Requisitos Previos

- Node.js instalado (versión 18 o superior)
- npm o yarn
- Expo Go instalado en tu dispositivo móvil
- Dispositivo móvil y computadora en la misma red Wi-Fi

## Pasos de Instalación

### 1. Instalar Dependencias

```bash
cd marketplace-servicios-mobile
npm install
```

### 2. Iniciar el Servidor de Desarrollo

```bash
npm start
```

O alternativamente:

```bash
npx expo start
```

### 3. Abrir en Expo Go

1. Abre la app **Expo Go** en tu dispositivo móvil
2. Escanea el código QR que aparece en la terminal
3. La aplicación se cargará automáticamente

### 4. Modo Túnel (Si hay problemas de red)

Si tienes problemas de conexión, usa el modo túnel:

```bash
npx expo start --tunnel
```

Este modo funciona incluso si no estás en la misma red Wi-Fi.

## Comandos Útiles

- `npm start` - Inicia el servidor de desarrollo
- `npm start --clear` - Limpia la caché y reinicia
- Presiona `r` en la terminal para recargar la app
- Presiona `m` para abrir el menú de desarrollo
- Presiona `s` para cambiar el modo de conexión

## Estructura de la Aplicación

La aplicación incluye:

- **Pantalla Home:** Página principal con información del marketplace
- **Pantalla RoleSelection:** Selección de rol de usuario
- **Sistema de Autenticación:** Login con diferentes roles
- **Gestión de Estado:** Context API para estado global
- **Persistencia:** AsyncStorage para datos locales

## Notas Importantes

- Asegúrate de tener **Expo Go actualizado** (SDK 54)
- El proyecto está configurado para **Expo SDK 54**
- Todas las dependencias están especificadas en `package.json`
- El diseño es idéntico al proyecto web pero adaptado para móvil

