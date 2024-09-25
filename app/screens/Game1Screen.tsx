import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Animated, Pressable, Dimensions, Platform } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const resourceTypes = {
    wood: 'wood',
    stone: 'stone',
    food: 'food',
};

const maxResourceLevel = 5;

const createInitialBoard = (size) => {
    return Array.from({ length: size }, () => Array(size).fill(null));
};

// Función para obtener un recurso aleatorio
const getRandomResource = (houseCount) => {
    const resources = houseCount > 0
        ? [resourceTypes.wood, resourceTypes.stone, resourceTypes.food]
        : [resourceTypes.wood, resourceTypes.stone];
    const randomIndex = Math.floor(Math.random() * resources.length);
    return resources[randomIndex];
};

export default function Game1Screen() {
    const [board, setBoard] = useState(createInitialBoard(6));
    const [currentResource, setCurrentResource] = useState(resourceTypes.wood);
    const [houseCount, setHouseCount] = useState(0);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const animationValues = useRef({}).current;
    const [sparklePosition, setSparklePosition] = useState(null); // Posición de las chispas
    const sparkleAnim = useRef(new Animated.Value(0)).current; // Animación de opacidad
    const [cellPositions, setCellPositions] = useState({});


    useEffect(() => {
        loadBoard();
    }, []);

    useEffect(() => {
        saveBoard();
    }, [board, houseCount]);

    const loadBoard = async () => {
        try {
            const savedBoard = await AsyncStorage.getItem('board');
            const savedHouseCount = await AsyncStorage.getItem('houseCount');
            if (savedBoard !== null) {
                setBoard(JSON.parse(savedBoard));
            }
            if (savedHouseCount !== null) {
                setHouseCount(parseInt(savedHouseCount));
            }
        } catch (error) {
            console.error('Error al cargar el tablero:', error);
        }
    };

    const saveBoard = async () => {
        try {
            await AsyncStorage.setItem('board', JSON.stringify(board));
            await AsyncStorage.setItem('houseCount', houseCount.toString());
        } catch (error) {
            console.error('Error al guardar el tablero:', error);
        }
    };

    const resetBoard = async () => {
        const newBoard = createInitialBoard(6);
        setBoard(newBoard);
        await AsyncStorage.removeItem('board');
        setHouseCount(0);
    };

    const isBoardFull = () => {
        return board.every(row => row.every(cell => cell !== null));
    };

    const handlePlaceResource = (row, col, cellRef) => {
        if (board[row][col] === null) {
            const newBoard = [...board];
            newBoard[row][col] = { type: currentResource, level: 1 };
            setBoard(newBoard);
            checkAndMergeResources(newBoard, row, col, cellRef); // Pasar cellRef

            const nextResource = getRandomResource(houseCount);
            setCurrentResource(nextResource);
        }
    };


    const checkAndMergeResources = (board, row, col, cellRef) => {
        const resource = board[row][col];
        const connectedResources = findConnectedResources(board, row, col, resource);

        if (checkForHouseCreation(board, row, col)) {
            createHouse(board, connectedResources);
        } else if (connectedResources.length >= 3) {
            mergeResources(board, connectedResources, row, col, cellRef); // Pasar cellRef
        }
    };


    const checkForHouseCreation = (board, row, col) => {
        const directions = [[0, 1], [1, 0], [-1, 0], [0, -1]];

        let stoneLevel5 = false;
        let woodLevel4Count = 0;

        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;

            if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length) {
                const adjacentCell = board[newRow][newCol];
                if (adjacentCell?.type === 'stone' && adjacentCell?.level === 5) {
                    stoneLevel5 = true;
                } else if (adjacentCell?.type === 'wood' && adjacentCell?.level === 4) {
                    woodLevel4Count++;
                }
            }
        }

        return stoneLevel5 && woodLevel4Count >= 2;
    };

    const createHouse = (board, connectedResources) => {
        connectedResources.forEach(({ row, col }) => {
            board[row][col] = null;
        });

        setHouseCount(houseCount + 1);
        setBoard([...board]);

        const newBoard = [...board];
        const emptyCell = findEmptyCell(newBoard);
        if (emptyCell) {
            newBoard[emptyCell.row][emptyCell.col] = { type: 'food', level: 1 };
        }

        setBoard(newBoard);
    };

    const findEmptyCell = (board) => {
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[0].length; col++) {
                if (board[row][col] === null) {
                    return { row, col };
                }
            }
        }
        return null;
    };

    const findConnectedResources = (board, row, col, resource, visited = {}) => {
        const key = `${row}-${col}`;
        if (visited[key]) return [];
        visited[key] = true;

        const directions = [[0, 1], [1, 0], [-1, 0], [0, -1]];

        const connected = [{ row, col }];
        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;

            if (
                newRow >= 0 &&
                newRow < board.length &&
                newCol >= 0 &&
                newCol < board[0].length &&
                board[newRow][newCol] &&
                board[newRow][newCol].type === resource.type &&
                board[newRow][newCol].level === resource.level
            ) {
                connected.push(
                    ...findConnectedResources(board, newRow, newCol, resource, visited)
                );
            }
        }
        return connected;
    };

    const getAnimValueForCell = (row, col) => {
        const key = `${row}-${col}`;
        if (!animationValues[key]) {
            animationValues[key] = new Animated.ValueXY({ x: 0, y: 0 });
        }
        return animationValues[key];
    };
    // Animación para controlar la escala (explosión)
    const sparkleScaleAnim = useRef(new Animated.Value(1)).current; // Escala de las chispas

    // Modificar triggerSparkles para incluir la animación de escala
    const triggerSparkles = (cellRef) => {
        if (cellRef?.current) {
            cellRef.current.measure((x, y, width, height, pageX, pageY) => {
                let adjustedX = pageX;
                let adjustedY = pageY;

                // Diferentes ajustes según la plataforma
                if (Platform.OS === 'web') {
                    adjustedX = pageX - 60;  // Ajustes para vista web
                    adjustedY = pageY - 60;  // Ajustes para vista web
                } else {
                    adjustedX = pageX + 0;   // Ajustes para móvil
                    adjustedY = pageY - 90;   // Ajustes para móvil
                }

                setSparklePosition({ x: adjustedX, y: adjustedY });

                // Inicia la animación de las chispas (escala + opacidad)
                Animated.parallel([
                    Animated.sequence([
                        Animated.timing(sparkleScaleAnim, {
                            toValue: 1.5,  // Escalar hasta un tamaño más grande (efecto de explosión)
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.timing(sparkleScaleAnim, {
                            toValue: 0,  // Reducir la escala para que desaparezcan
                            duration: 300,
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.sequence([
                        Animated.timing(sparkleAnim, {
                            toValue: 2.5,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.timing(sparkleAnim, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                    ]),
                ]).start();
            });
        }
    };






    const mergeResources = (board, connectedResources, targetRow, targetCol, cellRef) => {
        const resource = board[targetRow][targetCol];

        if (resource.level < maxResourceLevel) {
            const animations = connectedResources.map(({ row, col }) => {
                const animValue = getAnimValueForCell(row, col);
                const targetX = (targetCol - col) * 55;
                const targetY = (targetRow - row) * 55;

                return Animated.timing(animValue, {
                    toValue: { x: targetX, y: targetY },
                    duration: 500,
                    useNativeDriver: false,
                });
            });

            Animated.parallel(animations).start(() => {
                connectedResources.forEach(({ row, col }) => {
                    board[row][col] = null;

                    // Restablecer la animación a su valor inicial
                    const animValue = getAnimValueForCell(row, col);
                    animValue.setValue({ x: 0, y: 0 });
                });

                board[targetRow][targetCol] = {
                    type: resource.type,
                    level: resource.level + 1,
                };

                setBoard([...board]);
                triggerSparkles(cellRef); // Pasa la referencia de la celda donde ocurrió la mezcla
                checkAndMergeResources(board, targetRow, targetCol);
            });
        }
    };



    const getResourceImage = (type, level) => {
        if (type === 'wood') {
            switch (level) {
                case 1:
                    return require('../../assets/images/madera1.webp');
                case 2:
                    return require('../../assets/images/madera2.jpg');
                case 3:
                    return require('../../assets/images/madera3.jpg');
                case 4:
                    return require('../../assets/images/madera4.jpg');
                default:
                    return null;
            }
        }
        if (type === 'stone') {
            switch (level) {
                case 1:
                    return require('../../assets/images/piedra1.jpg');
                case 2:
                    return require('../../assets/images/piedra2.jpg');
                case 3:
                    return require('../../assets/images/piedra3.jpg');
                case 4:
                    return require('../../assets/images/piedra4.webp');
                case 5:
                    return require('../../assets/images/piedralvl5-removebg-preview.png');
                default:
                    return null;
            }
        }
        if (type === 'food') {
            switch (level) {
                case 1:
                    return require('../../assets/images/trigo1.png');
                case 2:
                    return require('../../assets/images/trigo2.png');
                case 3:
                    return require('../../assets/images/trigo3.png');
                case 4:
                    return require('../../assets/images/trigo4.png');
                case 5:
                    return require('../../assets/images/trigo5.png');
                default:
                    return null;
            }
        }
        return null;
    };

    return (
        <ImageBackground source={require('../../assets/images/fondo2.webp')} style={styles.boardBackground}>
            <View style={styles.container}>
                <View style={styles.infoContainer}>
                    <Text style={styles.resourceText}>Next Resource: {currentResource.toUpperCase()}</Text>
                </View>

                <View style={styles.boardContainer}>
                    <View style={styles.board}>
                        {board.map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.row}>
                                {row.map((cell, colIndex) => {
                                    const animValue = getAnimValueForCell(rowIndex, colIndex);
                                    const cellRef = useRef(); // Ref para la celda

                                    return (
                                        <Pressable
                                            ref={cellRef}
                                            key={colIndex}
                                            style={[styles.cell, { zIndex: 2 }]} // Asegurando que el recurso esté por encima
                                            onLayout={(event) => {
                                                const { x, y } = event.nativeEvent.layout;
                                                // Guardar la posición exacta de la celda
                                                setCellPositions({ row: rowIndex, col: colIndex, x, y });
                                            }}
                                            onPress={() => handlePlaceResource(rowIndex, colIndex, cellRef)}
                                        >
                                            {cell ? (
                                                <Animated.Image
                                                    source={getResourceImage(cell.type, cell.level)}
                                                    style={[
                                                        styles.resourceImage,
                                                        {
                                                            transform: animValue.getTranslateTransform(),
                                                        },
                                                    ]}
                                                    resizeMode="contain"
                                                />
                                            ) : (
                                                <Text style={styles.emptyCell}></Text>
                                            )}
                                        </Pressable>

                                    );
                                })}

                            </View>
                        ))}
                    </View>
                </View>

                {sparklePosition && (
                    <Animated.View
                        style={[
                            styles.sparkleContainer,
                            {
                                opacity: sparkleAnim,
                                transform: [{ scale: sparkleScaleAnim }],
                                left: sparklePosition.x,
                                top: sparklePosition.y,
                                zIndex: 1, // Asegurando que las chispas estén detrás del recurso
                            },
                        ]}
                    >
                        <Image
                            source={require('../../assets/images/chispitas.gif')}
                            style={styles.sparkleImage}
                        />
                    </Animated.View>
                )}


                {isBoardFull() && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={resetBoard} style={styles.resetButton}>
                            <Text style={styles.resetButtonText}>Reset Board</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.houseCounterContainer}>
                    <Text style={styles.houseCount}>Houses: {houseCount}</Text>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: 10,
        zIndex: 3, // Asegurar que la información esté siempre por encima
    },
    resourceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    boardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    board: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    houseCounterContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    houseCount: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
    },
    buttonContainer: {
        marginTop: 20,
    },
    resetButton: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    resetButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    boardBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    backgroundImage: {
        resizeMode: 'cover',
        opacity: 0.9,
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: 50,
        height: 50,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
    },
    resourceImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        zIndex: 2, // Asegurando que la imagen esté por encima de las chispas
    },
    emptyCell: {
        fontSize: 16,
        color: '#888',
    },
    sparkleContainer: {
        position: 'absolute',
        width: 50,
        height: 50,
        zIndex: 1, // Asegurando que las chispas estén detrás del recurso
    },
    sparkleImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});
