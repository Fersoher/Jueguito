import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabLayout from '@/app/(tabs)/_layout';
import Game1Screen from '@/app/screens/Game1Screen';
import Game2Screen from '@/app/screens/Game2Screen';
import Game3Screen from '@/app/screens/Game3Screen';

const Stack = createNativeStackNavigator();

export default function MainLayout() {
    return (
        <Stack.Navigator initialRouteName="Tabs">
            <Stack.Screen name="Tabs" component={TabLayout} options={{ headerShown: false }} />
            <Stack.Screen name="Game1" component={Game1Screen} />
            <Stack.Screen name="Game2" component={Game2Screen} />
            <Stack.Screen name="Game3" component={Game3Screen} />
        </Stack.Navigator>
    );
}
