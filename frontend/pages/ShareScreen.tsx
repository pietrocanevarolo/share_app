import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ShareScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Share something with your friends.</Text>
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

export default ShareScreen;
