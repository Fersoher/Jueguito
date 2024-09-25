import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ThemeProvider, useTheme } from '@/app/ThemeContext';
import { Colors } from '@/constants/Colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <MainLayout />
    </ThemeProvider>
  );
}

function MainLayout() {
  const { theme } = useTheme(); // Obtener el tema actual desde el contexto

  // Crear un tema personalizado basado en el tema global
  const MyDarkTheme = {
    ...NavigationDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      background: Colors.dark.background, // Color de fondo del tema oscuro
      text: Colors.dark.text, // Color del texto del tema oscuro
    },
  };

  const MyLightTheme = {
    ...NavigationDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      background: Colors.light.background, // Color de fondo del tema claro
      text: Colors.light.text, // Color del texto del tema claro
    },
  };

  // Aplicar el tema solo a los componentes y no en screenOptions
  const activeTheme = theme === 'dark' ? MyDarkTheme : MyLightTheme;

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Quitar el encabezado si no lo necesitas
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
