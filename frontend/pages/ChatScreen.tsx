import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import axios from 'axios';

const ChatScreen: React.FC = ({ route }: any) => {
  const { chatId, chatName } = route.params;  // Recupera i parametri passati dalla screen principale
  const [messages, setMessages] = useState<any[]>([]);  // Stato per i messaggi
  const [newMessage, setNewMessage] = useState<string>('');  // Stato per il nuovo messaggio

  useEffect(() => {
    // Funzione per recuperare i messaggi dal backend
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/chat/${chatId}/`);  // Sostituisci con l'URL del tuo backend
        setMessages(response.data);  // Salva i messaggi
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [chatId]);

  // Funzione per inviare il messaggio
  const sendMessage = async () => {
    if (newMessage.trim() === '') return;  // Non inviare messaggi vuoti

    try {
      const response = await axios.post('http://localhost:8000/api/message/', {
        chatId,
        message: newMessage,
      });
      setMessages([...messages, response.data]);  // Aggiungi il nuovo messaggio alla lista
      setNewMessage('');  // Pulisci il campo di input
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.chatHeader}>
        <Text style={styles.chatName}>{chatName}</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={sendMessage}>
          <Text style={styles.sendButton}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatHeader: {
    padding: 15,
    backgroundColor: '#075e54',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  messageContainer: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#ece5dd',
    marginLeft: 50,
    borderRadius: 10,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingLeft: 15,
  },
  sendButton: {
    marginLeft: 10,
    color: '#075e54',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
