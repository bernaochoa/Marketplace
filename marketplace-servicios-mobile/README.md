# ServiciosMarket Mobile

Aplicación móvil de ServiciosMarket construida con React Native y Expo SDK 54.

## 📱 Descripción

Esta es la versión móvil del marketplace de servicios, completamente independiente del proyecto web. La aplicación permite a los usuarios gestionar servicios, cotizaciones e insumos desde sus dispositivos móviles.

## 🚀 Características

- ✅ **Diseño idéntico al proyecto web** - Mismos colores, estilos y estructura visual
- ✅ **Navegación fluida** - React Navigation con stack navigator
- ✅ **Persistencia de datos** - AsyncStorage para guardar información localmente
- ✅ **Autenticación de usuarios** - Sistema de login con diferentes roles
- ✅ **Gestión de estado global** - Context API para estado compartido
- ✅ **Diseño responsive** - Optimizado para dispositivos móviles

## 📂 Estructura del Proyecto

```
marketplace-servicios-mobile/
├── App.tsx                    # Punto de entrada principal
├── package.json              # Dependencias (Expo SDK 54)
├── app.json                  # Configuración de Expo
├── src/
│   ├── components/          # Componentes reutilizables
│   │   └── Header.tsx       # Header con navegación
│   ├── context/             # Contextos de React
│   │   ├── AuthContext.tsx  # Autenticación
│   │   └── AppStateContext.tsx # Estado global
│   ├── constants/          # Constantes
│   │   └── theme.ts        # Colores, sombras, espaciado
│   ├── data/               # Datos iniciales
│   │   └── initialData.ts  # Tipos y datos mock
│   └── pages/              # Pantallas
│       ├── Home.tsx        # Página principal
│       └── RoleSelection.tsx # Selección de roles
```

## 🛠️ Tecnologías Utilizadas

- **React Native** 0.81.5
- **Expo SDK 54**
- **React Navigation** - Navegación entre pantallas
- **AsyncStorage** - Persistencia local
- **React Native SVG** - Iconos vectoriales
- **Expo Linear Gradient** - Gradientes
- **TypeScript** - Tipado estático

## 📋 Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo:**
   ```bash
   npm start
   # o
   npx expo start
   ```

3. **Abrir en Expo Go:**
   - Instala Expo Go en tu dispositivo móvil
   - Escanea el código QR que aparece en la terminal
   - Asegúrate de estar en la misma red Wi-Fi

## 🎨 Diseño

El diseño mantiene la identidad visual del proyecto web:
- **Colores principales:** Azul (#10b5e8) y azul oscuro (#0b2234)
- **Gradientes:** Fondo degradado azul claro a blanco
- **Tipografía:** Sistema nativo de React Native
- **Componentes:** Cards, botones y navegación con el mismo estilo

## 📱 Pantallas

### Home
- Hero section con información del marketplace
- Lista de roles disponibles
- Tarjetas de beneficios
- Botón CTA para explorar roles

### RoleSelection
- Selección de rol (Solicitante, Proveedor de Servicio, Proveedor de Insumos)
- Modal de login (pendiente de implementación completa)
- Navegación de regreso al inicio

## 🔐 Autenticación

El sistema de autenticación permite tres tipos de usuarios:
- **SOLICITANTE** - Publica y gestiona servicios necesarios
- **PROVEEDOR_SERVICIO** - Ofrece servicios profesionales
- **PROVEEDOR_INSUMOS** - Vende materiales y packs

## 💾 Persistencia

Los datos se guardan localmente usando AsyncStorage:
- Usuario actual (sesión)
- Servicios publicados
- Cotizaciones
- Insumos y packs
- Selecciones de cotizaciones

## 📝 Notas

Este proyecto está completamente separado del proyecto web (`marketplace-servicios/`):
- **Web:** React + Vite + Tailwind CSS
- **Mobile:** React Native + Expo + StyleSheet

Ambos comparten la misma lógica de negocio pero están implementados de forma independiente.

## 🐛 Solución de Problemas

Si encuentras problemas:
1. Verifica que todas las dependencias estén instaladas: `npm install`
2. Limpia la caché: `npx expo start --clear`
3. Asegúrate de tener Expo Go actualizado en tu dispositivo
4. Verifica que estés en la misma red Wi-Fi

## 📄 Licencia

Proyecto educativo - Marketplace de Servicios
