import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../constants';
import { Ionicons } from '@expo/vector-icons';

type Group = {
  group_id: string;
  group_name: string;
  created_at: string;
};

type GroupMessage = {
  message_id: string;
  content: string;
  created_at: string;
  users: {
    id: string;
    display_name: string;
    email: string;
  };
};

export default function GroupScreen() {
  const { session } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (session?.access_token) {
      fetchMyGroups();
    }
  }, [session?.access_token]);

  // Fetch groups the user is a member of
  const fetchMyGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/groups`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch groups: ${response.status}`);
      }

      const data = await response.json();
      setMyGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      Alert.alert('Error', 'Failed to load your groups. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected group
  const fetchMessages = async () => {
    if (!selectedGroup) return;
    
    try {
      setRefreshing(true);
      const response = await fetch(`${API_URL}/groups/${selectedGroup.group_id}/messages`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to load messages. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  // Join a group
  const handleJoinGroup = async () => {
    if (!groupName.trim() || !session?.access_token || joining) return;

    try {
      setJoining(true);
      const response = await fetch(`${API_URL}/groups/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          groupName: groupName.trim(),
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        Alert.alert('Error', result.error || 'Group does not exist');
        return;
      }

      Alert.alert('Success', result.message);
      setGroupName('');
      
      // Refresh groups
      fetchMyGroups();
      
    } catch (error) {
      console.error('Error joining group:', error);
      Alert.alert('Error', 'Failed to join group. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  // Send a message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedGroup || !session?.access_token || sendingMessage) return;

    try {
      setSendingMessage(true);
      const response = await fetch(`${API_URL}/groups/${selectedGroup.group_id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          content: messageText.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const newMessage = await response.json();
      
      // Add the new message to the beginning of the list
      setMessages(prevMessages => [newMessage, ...prevMessages]);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle group selection
  const selectGroup = (group: Group) => {
    setSelectedGroup(group);
    fetchMessages();
  };

  // Render a group item
  const renderGroupItem = ({ item }: { item: Group }) => (
    <TouchableOpacity 
      style={[
        styles.groupItem, 
        selectedGroup?.group_id === item.group_id && styles.selectedGroup
      ]}
      onPress={() => selectGroup(item)}
    >
      <Text style={styles.groupName}>{item.group_name}</Text>
    </TouchableOpacity>
  );

  // Render a message item
  const renderMessageItem = ({ item }: { item: GroupMessage }) => (
    <View style={styles.messageItem}>
      <View style={styles.messageHeader}>
        <Text style={styles.messageAuthor}>{item.users?.display_name || 'Unknown User'}</Text>
        <Text style={styles.messageTime}>
          {new Date(item.created_at).toLocaleString()}
        </Text>
      </View>
      <Text style={styles.messageContent}>{item.content}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.joinContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter group name to join"
          value={groupName}
          onChangeText={setGroupName}
        />
        <TouchableOpacity 
          style={styles.joinButton}
          onPress={handleJoinGroup}
          disabled={joining}
        >
          {joining ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Join</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.groupsContainer}>
            <Text style={styles.sectionTitle}>My Groups</Text>
            {myGroups.length === 0 ? (
              <Text style={styles.emptyText}>No groups joined yet</Text>
            ) : (
              <FlatList
                data={myGroups}
                renderItem={renderGroupItem}
                keyExtractor={(item) => item.group_id}
                horizontal={false}
              />
            )}
          </View>

          {selectedGroup && (
            <View style={styles.chatContainer}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatTitle}>{selectedGroup.group_name}</Text>
              </View>
              
              <FlatList
                data={messages}
                renderItem={renderMessageItem}
                keyExtractor={(item) => item.message_id}
                style={styles.messagesList}
                onRefresh={fetchMessages}
                refreshing={refreshing}
                ListEmptyComponent={() => (
                  <Text style={styles.emptyText}>No messages yet</Text>
                )}
              />

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.messageInput}
                  placeholder="Type a message..."
                  value={messageText}
                  onChangeText={setMessageText}
                  multiline
                />
                <TouchableOpacity 
                  style={styles.sendButton}
                  onPress={handleSendMessage}
                  disabled={sendingMessage}
                >
                  {sendingMessage ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="send" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}
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
  joinContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  joinButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  groupsContainer: {
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  groupItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedGroup: {
    backgroundColor: '#e3f2fd',
  },
  groupName: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    padding: 15,
    fontSize: 14,
    color: '#757575',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatHeader: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messagesList: {
    flex: 1,
    padding: 10,
  },
  messageItem: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  messageAuthor: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  messageTime: {
    fontSize: 12,
    color: '#757575',
  },
  messageContent: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});