import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/app/ThemeContext';

export default function TabLayout() {
  const { theme } = useTheme(); // Asegúrate de que theme es 'light' o 'dark'

  // Tipo explícito para el tema
  const currentTheme: 'light' | 'dark' = theme === 'dark' ? 'dark' : 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[currentTheme].tabIconSelected, // Acceder de manera segura a Colors
        tabBarInactiveTintColor: Colors[currentTheme].tabIconDefault, // Acceder de manera segura a Colors
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
