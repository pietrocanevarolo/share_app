import * as React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, ActivityIndicator, Card, Text } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './../../types';
import Item from './item';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;


type ItemType = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};

type CategoryType = {
  id: number;
  name: string;
  parent: number | null;
};

const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [items, setItems] = React.useState<ItemType[]>([]);
  const [categories, setCategories] = React.useState<CategoryType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const navigation = useNavigation<HomeScreenNavigationProp>();

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

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/api/categories/');
      setCategories(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const renderCategoryItem = ({ item }: { item: CategoryType }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate('SubHomescreen', { categoryId: item.id })}
    >
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.categoryIcon} />
          <Text style={styles.categoryText}>{item.name}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const parentCategories = categories.filter(category => category.parent === null);

  return (
    <View style={styles.container}>
      <TextInput
        label="Search"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
        style={styles.input}
      />
      <Button mode="contained" onPress={fetchItems} style={styles.button}>
        Search Categories
      </Button>
      {loading && <ActivityIndicator animating={true} />}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={parentCategories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
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
  button: {
    marginBottom: 16,
  },
  list: {
    marginTop: 16,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
  },
  card: {
    width: '100%',
  },
  cardContent: {
    alignItems: 'center',
  },
  categoryIcon: {
    width: 50,
    height: 50,
  },
  categoryText: {
    marginTop: 8,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginVertical: 16,
    textAlign: 'center',
  },
});

export default HomeScreen;
