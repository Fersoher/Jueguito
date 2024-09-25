import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  const navigation = useNavigation();

  const games = [
    { id: 1, name: 'Game 1', icon: 'game-controller', screen: 'Game1' },
    { id: 2, name: 'Game 2', icon: 'game-controller-outline', screen: 'Game2' },
    { id: 3, name: 'Game 3', icon: 'logo-game-controller-b', screen: 'Game3' },
  ];

  const handleGamePress = (screenName) => {
    // Aquí navegamos al stack padre (Tabs) y especificamos la pantalla interna (Game1, Game2, Game3)
    navigation.navigate('GameScreen', {screen: screenName});
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>

      <View style={styles.gameGrid}>
        {games.map((game) => (
          <Pressable
            key={game.id}
            style={styles.gameBox}
            onPress={() => handleGamePress(game.screen)}
          >
            <Ionicons name={game.icon} size={40} color="#fff" />
            <ThemedText style={styles.gameText}>{game.name}</ThemedText>
          </Pressable>
        ))}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  gameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  gameBox: {
    width: '45%',
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  gameText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
