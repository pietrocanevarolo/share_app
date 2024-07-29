import * as React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useAuth } from './../AuthContext';
import axios from 'axios';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      // Post request to the Django login endpoint
      const response = await axios.post('http://localhost:8000/login/', {
        username,
        password
      });
  
      // Check if response status is 200 (OK) before accessing data
      if (response.status === 200) {
        Alert.alert('Success', response.data.message || 'Login successful');
        login(); // Update authentication state
        navigation.navigate('Home'); // Navigate to the home screen
      } else {
        Alert.alert('Error', 'Unexpected response status');
      }
    } catch (error: any) {
      // Handle HTTP errors
      if (error.response) {
        // Server responded with a status other than 2xx
        Alert.alert('Error', error.response.data.error || 'An error occurred');
      } else if (error.request) {
        // No response was received from the server
        Alert.alert('Error', 'No response from server');
      } else {
        // Something else happened during request setup
        Alert.alert('Error', error.message || 'An error occurred');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Username"
        value={username}
        onChangeText={text => setUsername(text)}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleLogin}>
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
});

export default LoginScreen;

