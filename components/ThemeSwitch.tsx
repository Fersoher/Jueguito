import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Pressable, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Usar LinearGradient de expo
import { useTheme } from '@/app/ThemeContext';

export default function ThemeSwitch() {
    const { theme, toggleTheme } = useTheme();
    const [animation] = useState(new Animated.Value(theme === 'dark' ? 1 : 0));
    const [cloudAnimation] = useState(new Animated.Value(theme === 'dark' ? 0 : 1));

    useEffect(() => {
        Animated.timing(animation, {
            toValue: theme === 'dark' ? 1 : 0,
            duration: 800,
            useNativeDriver: false,
        }).start();
    }, [theme]);

    useEffect(() => {
        Animated.timing(cloudAnimation, {
            toValue: theme === 'dark' ? 0 : 1,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    }, [theme]);

    const togglePosition = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [5, 55], // Posición de la "luna/sol" en el botón
    });

    const cloudPosition = cloudAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 0], // Animar la posición de las nubes desde la derecha
    });

    return (
        <Pressable onPress={toggleTheme} style={styles.switchContainer}>
            <LinearGradient
                colors={theme === 'dark' ? ['#43409a', '#2e264c'] : ['#A0F9FF', '#21D2F2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.switchBackground}
            >
                <Animated.View style={[styles.toggle, { left: togglePosition }]}>
                    {/* Gradiente alrededor del sol/luna para dar el efecto de luz */}
                    <LinearGradient
                        colors={['#ffffff', 'transparent']}
                        start={{ x: 0.5, y: 0.5 }}  // Centro del gradiente
                        end={{ x: 0.5, y: 0.5 }}        // Gradiente fluye hacia afuera desde el centro
                        locations={[0, 0]}
                        style={[
                            styles.glowEffect,
                            theme === 'dark' ? styles.moonGlow : styles.sunGlow,
                        ]}
                    >
                        <View style={theme === 'dark' ? styles.moon : styles.sun} />
                    </LinearGradient>
                </Animated.View>

                {/* Añadir nubes con animación */}
                {theme !== 'dark' && (
                    <Animated.View style={[styles.clouds, { transform: [{ translateX: cloudPosition }] }]}>
                        <View style={styles.cloudLayer1} />
                        <View style={styles.cloudLayer2} />
                    </Animated.View>
                )}

                {/* Añadir más estrellas */}
                {theme === 'dark' && (
                    <>
                        <View style={styles.stars} />
                        <View style={styles.starsAdditional1} />
                        <View style={styles.starsAdditional2} />
                    </>
                )}
            </LinearGradient>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    switchContainer: {
        marginVertical: 20,
        width: 100,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
    },
    switchBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggle: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        ...Platform.select({
            web: {
                boxShadow: '0px 4px 5px rgba(0,0,0,0.3)', // Sombra para web
            },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5, // Elevación en móviles
            },
        }),
    },
    glowEffect: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        paddingLeft: 5,
        borderRadius: 50,
    },
    moonGlow: {
        opacity: 0.3, // Brillo más suave para la luna
    },
    sunGlow: {
        opacity: 0.8, // Brillo más intenso para el sol
    },
    moon: {
        width: 40,
        height: 40,
        borderRadius: 40,
        backgroundColor: '#F8E3EF',
    },
    sun: {
        width: 40,
        height: 40,
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
    },
    stars: {
        position: 'absolute',
        top: 10,
        left: 30,
        width: 5,
        height: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
    },
    starsAdditional1: {
        position: 'absolute',
        top: 35,
        left: 40,
        width: 3,
        height: 3,
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
    },
    starsAdditional2: {
        position: 'absolute',
        top: 25,
        left: 20,
        width: 4,
        height: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
    },
    clouds: {
        position: 'absolute',
        bottom: 10,
        left: 55,  // Ajustar la posición para centrar mejor la nube
        width: 25,
        height: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,  // Radio mayor para dar una apariencia más suave
    },
    cloudLayer1: {
        position: 'absolute',
        bottom: 5,  // Ajustar para que quede sobre la base de la nube principal
        left: 10,  // Desplazar ligeramente hacia la izquierda
        width: 20,
        height: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
    },
    cloudLayer2: {
        position: 'absolute',
        bottom: 5,
        right: -8,  // Desplazar hacia la derecha para crear un borde más amplio
        width: 20,
        height: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
    },
});
