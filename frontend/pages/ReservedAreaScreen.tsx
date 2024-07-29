import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReservedAreaScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Edit your user settings here.</Text>
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
