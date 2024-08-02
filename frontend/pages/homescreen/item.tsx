import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

type ItemProps = {
  name: string;
  description: string;
  imageUrl: string;
};

const Item: React.FC<ItemProps> = ({ name, description, imageUrl }) => {
  return (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: imageUrl }} />
      <Card.Title title={name} />
      <Card.Content>
        <Text>{description}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
});

export default Item;
