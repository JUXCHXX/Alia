# Corrección del mismatch de Worklets

## Causa

El proyecto estaba ejecutando código JavaScript de `react-native-worklets` `0.10.1`, pero el bundle/plugin de Babel que se había generado previamente correspondía a `0.12.1`. Reanimated 4 valida que el runtime JavaScript y `react-native-worklets/plugin` usen la misma versión; cuando no coinciden, falla la inicialización de `Animated`.

El error aparecía primero al importar `Animated` en `HouseIcon.tsx`. Los avisos sobre el export default de `_layout.tsx` y `ErrorBoundary` en `RootLayout` eran errores en cascada: Expo Router no podía evaluar el layout porque el módulo del icono había fallado.

No existe un `babel.config.js` personalizado en este proyecto. Expo SDK 57 configura el plugin mediante `babel-preset-expo`, y Reanimated usa `react-native-worklets/plugin` internamente.

## Cambios realizados

- `package.json`: se fijaron las dependencias nativas compatibles, sin rangos que puedan volver a desalinearlas:
  - `react-native-reanimated`: `4.6.0`/resolución previa → `4.5.1`
  - `react-native-worklets`: `0.12.1`/resolución previa → `0.10.1`
  - `react-native-svg`: añadido en `15.15.4`
- `package-lock.json`: actualizado para resolver exactamente Reanimated `4.5.1` y Worklets `0.10.1`.
- `app/(tabs)/_layout.tsx`: usa el import compatible `expo-router/tabs` y conecta los cuatro `tabBarIcon`.
- `app/_layout.tsx` y `app/admin/_layout.tsx`: usan `expo-router/stack`, evitando el export agrupado que producía `undefined` con la versión instalada de Expo Router.
- `src/components/icons/HouseIcon.tsx`, `SearchIcon.tsx`, `MessageHeartIcon.tsx` y `UserIcon.tsx`: iconos SVG reutilizables con animaciones Reanimated.

## Limpieza y verificación

Se limpiaron las cachés locales `.expo` y `node_modules/.cache`. Se verificó que:

```text
react-native-reanimated 4.5.1
react-native-worklets 0.10.1
```

Además, `npx expo export --platform android` completa correctamente y Metro incluye `HouseIcon.tsx`, el layout de tabs y `RootLayout` en el bundle.

## Paso manual requerido

Hay que reconstruir y reinstalar el binario nativo para reemplazar el Worklets `0.12.1` que pueda estar embebido en una app instalada:

```bash
npx expo run:android
```

Si se usa un servidor Metro existente, detenerlo y arrancar después con:

```bash
npx expo start -c
```

El entorno de desarrollo actual no pudo ejecutar `run:android` porque `ANDROID_HOME` apunta a `/home/devflorian/Android/Sdk`, una ruta que no existe, y ADB no pudo iniciar. Esto no afecta la validación del bundle JavaScript, pero sí impide generar aquí el APK actualizado.
