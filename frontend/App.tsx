import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from './types';

import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import FavoritesScreen from './pages/FavoritesScreen';
import ShareScreen from './pages/ShareScreen';
import MessagesScreen from './pages/MessagesScreen';
import ReservedAreaScreen from './pages/ReservedAreaScreen';

const Tab = createBottomTabNavigator<RootStackParamList>();

function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName: string = '';

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
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
