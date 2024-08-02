import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { ActivityIndicator, Card } from 'react-native-paper';
import axios from 'axios';
import Item from './homescreen/item';


type ItemType = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  category:number;
};


const FavoritesScreen: React.FC = () => {

  const [items, setItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const fetchFavouriteItems = async () => {
    setLoading(true);
    setError(null);
    
    // Build query parameters based on the presence of values
    const queryParams = new URLSearchParams();
    
    try {
      const response = await axios.get(`http://localhost:8000/api/item/?${queryParams}`);
      setItems(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavouriteItems();
  }, []);


  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator animating={true} />}
      {error && <Text style={styles.error}>{error}</Text>}
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

export default FavoritesScreen;
