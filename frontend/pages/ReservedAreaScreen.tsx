import * as React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '../AuthContext';  // Assicurati di importare il contesto

const ReservedAreaScreen: React.FC = () => {
  const { logout } = useAuth();  // Usa la funzione logout dal contesto

  const handleLogout = () => {
    logout();  
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReservedAreaScreen;
