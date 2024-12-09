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
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });
  
      if (response.status === 200) {
        const { access, refresh } = response.data;
  
        // Usa il metodo login dal contesto
        await login(access, refresh);
  
        Alert.alert('Success', 'Login successful');
        navigation.navigate('Home');
      }
    } catch (error: any) {
      if (error.response) {
        Alert.alert('Error', error.response.data.detail || 'Invalid credentials');
      } else if (error.request) {
        Alert.alert('Error', 'No response from server');
      } else {
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

