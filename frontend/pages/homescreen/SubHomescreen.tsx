import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './../../types';
import { ActivityIndicator, Card } from 'react-native-paper';
import axios from 'axios';
import Item from './item';

type SubHomescreenRouteProp = RouteProp<RootStackParamList, 'SubHomescreen'>;
type SubHomescreenNavigationProp = StackNavigationProp<RootStackParamList, 'SubHomescreen'>;

type ItemType = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  category:number;
};

type CategoryType = {
  id: number;
  name: string;
  parent: number | null;
};

const SubHomescreen: React.FC = () => {
  const route = useRoute<SubHomescreenRouteProp>();
  const navigation = useNavigation<SubHomescreenNavigationProp>();
  const { categoryId } = route.params;
  const [subCategories, setSubCategories] = useState<CategoryType[]>([]);
  const [items, setItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);

  const fetchSubCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8000/api/categories/?category_id=${categoryId}`);
      setSubCategories(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    
    // Build query parameters based on the presence of values
    const queryParams = new URLSearchParams();
    
    // Convert numbers to strings before appending
    if (selectedSubCategory !== null && selectedSubCategory !== undefined) {
      queryParams.append('sub_category_id', String(selectedSubCategory));
    }
    if (categoryId !== null && categoryId !== undefined) {
      queryParams.append('category_id', String(categoryId));
    }
    
    try {
      const response = await axios.get(`http://localhost:8000/api/item/?${queryParams.toString()}`);
      setItems(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
    fetchItems();
  }, [categoryId, selectedSubCategory]);

  const renderSubCategoryItem = ({ item }: { item: CategoryType }) => (
    <TouchableOpacity
      style={[styles.subCategoryItem, selectedSubCategory === item.id && styles.selectedSubCategory]}
      onPress={() => setSelectedSubCategory(item.id)}
    >
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.subCategoryIcon} />
          <Text style={styles.subCategoryText}>{item.name}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator animating={true} />}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={subCategories}
        renderItem={renderSubCategoryItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        contentContainerStyle={styles.subCategoryList}
      />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Item
            name={item.name}
            description={item.description}
            imageUrl={item.imageUrl}
          />
        )}
        contentContainerStyle={styles.itemList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  subCategoryList: {
    marginTop: 30,
    marginBottom: 36,
  },
  subCategoryItem: {
    alignItems: 'center',
    margin: 10,
  },
  selectedSubCategory: {
    backgroundColor: '#e0e0e0',
  },
  card: {
    width: '100%',
  },
  cardContent: {
    alignItems: 'center',
  },
  subCategoryIcon: {
    width: 50,
    height: 50,
  },
  subCategoryText: {
    marginTop: 8,
    textAlign: 'center',
  },
  itemList: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    marginVertical: 16,
    textAlign: 'center',
  },
});

export default SubHomescreen;
