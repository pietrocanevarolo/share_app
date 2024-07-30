import * as React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import Item from './item';

type ItemType = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};

const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [items, setItems] = React.useState<ItemType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/api/item/');
      setItems(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchItems();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        label="Search"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
        style={styles.input}
      />
      <Button mode="contained" onPress={fetchItems}>
        Search Categories
      </Button>
      {loading && <ActivityIndicator animating={true} />}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Item
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  list: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    marginVertical: 16,
    textAlign: 'center',
  },
});

export default HomeScreen;
