import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Game3Screen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>This is Game 3!</Text>
            {/* Agrega aquí la lógica y el diseño específico de Game 3 */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
