import React from 'react';
import { View, StyleSheet, Image, SafeAreaView } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ThemeSwitch from '@/components/ThemeSwitch';
import { useTheme } from '@/app/ThemeContext';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const { theme } = useTheme(); // Obtener el tema actual

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: Colors[theme].background }]}>
          <Image
            source={require('@/assets/images/imageintro.jpg')}
            style={styles.gamesLogo}
            resizeMode="cover"
          />
        
      <View style={styles.container}>

        <ThemedView style={[styles.imageContainer, { backgroundColor: Colors[theme].background }]}>
          <ThemedText type="title" style={{ color: Colors[theme].text }}>
            Welcome to Mini Games!
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.descriptionContainer, { backgroundColor: Colors[theme].background }]}>
          <ThemedText type="subtitle" style={{ color: Colors[theme].text }}>
            Your gateway to fun!
          </ThemedText>
        </ThemedView>

        <ThemeSwitch />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  imageContainer: {
    alignItems: 'center', // Centrar la imagen
    marginBottom: 16, // Espacio inferior para separarlo del contenido
  },
  gamesLogo: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  descriptionContainer: {
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
  },
});
