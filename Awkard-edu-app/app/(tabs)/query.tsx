import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../constants';
import { Ionicons } from '@expo/vector-icons';

type Query = {
  query_id: string;
  question: string;
  answer: string | null;
  created_at: string;
  user: {
    display_name: string;
    email: string;
  };
};

export default function QueryScreen() {
  const { session } = useAuth();
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQuery, setNewQuery] = useState('');
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (session?.access_token) {
      fetchQueries();
    }
  }, [session?.access_token]);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/queries`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Failed to fetch queries: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched queries:', data);
      
      // Sort queries by creation date, newest first
      const sortedQueries = data.sort((a: Query, b: Query) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setQueries(sortedQueries);
    } catch (error) {
      console.error('Error fetching queries:', error);
      Alert.alert('Error', 'Failed to load queries. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSend = async () => {
    if (!newQuery.trim() || !session?.access_token || sending) return;

    try {
      setSending(true);
      const response = await fetch(`${API_URL}/queries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          question: newQuery.trim(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Failed to send query: ${response.status}`);
      }

      const newQueryData = await response.json();
      console.log('New query created:', newQueryData);
      
      // Add the new query to the beginning of the list
      setQueries(prevQueries => [newQueryData, ...prevQueries]);
      setNewQuery('');
    } catch (error) {
      console.error('Error sending query:', error);
      Alert.alert('Error', 'Failed to send query. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchQueries();
  };

  const handleAnalyzeQueries = async () => {
    if (!session?.access_token) {
      Alert.alert('Error', 'Please sign in to analyze queries');
      return;
    }

    if (queries.length === 0) {
      Alert.alert('No Queries', 'Please add some queries to analyze');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await fetch(`${API_URL}/analyze-queries`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ queries }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Analysis server error:', errorText);
        throw new Error('Failed to analyze queries');
      }

      const data = await response.json();
      console.log('Analysis response:', data);
      
      // Simply show a success message since the results are stored in the database
      Alert.alert('Success', 'Analysis completed successfully. Refreshing results...');
      fetchQueries(); // Refresh the queries to get any updated data
      
    } catch (error) {
      console.error('Error analyzing queries:', error);
      Alert.alert('Error', 'Failed to analyze queries. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const renderQuery = ({ item }: { item: Query }) => (
    <View style={styles.queryItem}>
      <View style={styles.queryHeader}>
        <Text style={styles.queryTitle}>{item.question}</Text>
        <Text style={styles.queryTime}>
          {new Date(item.created_at).toLocaleString()}
        </Text>
      </View>
      {item.answer && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerLabel}>Answer:</Text>
          <Text style={styles.answer}>{item.answer}</Text>
        </View>
      )}
      <View style={styles.queryFooter}>
        <Text style={styles.queryAuthor}>
          Posted by {item.user?.display_name || 'Anonymous User'}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Queries</Text>
        <TouchableOpacity 
          style={styles.analyzeButton}
          onPress={handleAnalyzeQueries}
          disabled={analyzing || queries.length === 0}
        >
          {analyzing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.analyzeButtonText}>Analyze</Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={queries}
        renderItem={renderQuery}
        keyExtractor={(item) => item.query_id}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newQuery}
          onChangeText={setNewQuery}
          placeholder="Type your query..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, sending && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={sending || !newQuery.trim()}
        >
          <Ionicons
            name="send"
            size={24}
            color={sending || !newQuery.trim() ? '#999' : '#007AFF'}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  analyzeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  queryItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  queryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  queryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  queryTime: {
    fontSize: 12,
    color: '#666',
  },
  queryDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  queryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  queryAuthor: {
    fontSize: 12,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  answerContainer: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  answer: {
    fontSize: 14,
    color: '#333',
  },
});