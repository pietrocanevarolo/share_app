import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessagesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Your chats will be listed here.</Text>
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

export default MessagesScreen;
