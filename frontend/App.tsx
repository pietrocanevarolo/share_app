import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from './types';
import LoginScreen from './pages/LoginScreen';
import FavoritesScreen from './pages/FavoritesScreen';
import ShareScreen from './pages/ShareScreen';
import MessagesScreen from './pages/MessagesScreen';
import ReservedAreaScreen from './pages/ReservedAreaScreen';
import { AuthProvider, useAuth } from './AuthContext';
import HomeScreen from './pages/homescreen/Homescreen';
import SubHomescreen from './pages/homescreen/SubHomescreen';
import ChatScreen from './pages/ChatScreen';


// Configurazione dell'intercettazione globale di Axios
axios.interceptors.request.use(
  async (config) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const AppTabs = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: React.ComponentProps<typeof Ionicons>['name'] = '';

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Favorites') {
          iconName = 'heart';
        } else if (route.name === 'Share') {
          iconName = 'share';
        } else if (route.name === 'Messages') {
          iconName = 'chatbubbles';
        } else if (route.name === 'ReservedArea') {
          iconName = 'person';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Favorites" component={FavoritesScreen} />
    <Tab.Screen name="Share" component={ShareScreen} />
    <Tab.Screen name="Messages" component={MessagesScreen} />
    <Tab.Screen name="ReservedArea" component={ReservedAreaScreen} />

  </Tab.Navigator>
);

const AppNavigator = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="AppTabs" component={AppTabs} />
          <Stack.Screen name="SubHomescreen" component={SubHomescreen} /> 

        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
};

export default App;
