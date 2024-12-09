import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import axios from 'axios';

const MessagesScreen: React.FC = ({ navigation }: any) => {
  const [chats, setChats] = useState<any[]>([]); // Stato per memorizzare le chat
  const [loading, setLoading] = useState<boolean>(true); // Stato per la gestione del loading

  useEffect(() => {
    // Funzione per recuperare le chat dal backend
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/chat/');
        setChats(response.data); // Salva i dati delle chat
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false); // Imposta loading a false quando i dati sono stati caricati
      }
    };

    fetchChats();
  }, []);

  // Funzione per creare una nuova chat
  const createChat = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/chat/', {
        item: 13, // Sostituisci con un valore reale o lascia che l'utente scelga
        users: [3, 9], 
      });
      Alert.alert('Success', 'Chat created successfully!');
      setChats([...chats, response.data]); // Aggiungi la nuova chat all'elenco
    } catch (error) {
      console.error('Error creating chat:', error);
      Alert.alert('Error', 'Failed to create chat.');
    }
  };

  // Funzione per rendere ogni singola chat
  const renderChat = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chat', { chatId: item.id, chatName: item.name })}
    >
      <Image source={{ uri: item.profile_picture }} style={styles.profileImage} />
      <View style={styles.chatContent}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.last_message}</Text>
      </View>
    </TouchableOpacity>
  );

  // Se i dati sono in caricamento, mostra un indicatore di caricamento
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Loading chats...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Create New Chat" onPress={createChat} />
      <FlatList
        data={chats}
        renderItem={renderChat}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  lastMessage: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
});

export default MessagesScreen;
