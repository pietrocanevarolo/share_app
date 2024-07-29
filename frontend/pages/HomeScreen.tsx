import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <TextInput
        label="Search"
        style={styles.input}
      />
      <Button mode="contained">
        Search Categories
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

export default HomeScreen;
