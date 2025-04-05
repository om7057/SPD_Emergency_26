import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { API_URL } from '../../constants';

export default function ProfileScreen() {
  const { signOut, session } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [analysisData, setAnalysisData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchAnalysisData();
  }, []);

  const fetchUserData = async () => {
    try {
      if (!session?.user?.id) return;

      const response = await fetch(`${API_URL}/users/${session.user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysisData = async () => {
    try {
      if (!session?.user?.id) return;

      // We need to add a new endpoint to the server to fetch analysis results
      const response = await fetch(`${API_URL}/users/${session.user.id}/analysis`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch analysis data');
      }
      
      const data = await response.json();
      setAnalysisData(data);
    } catch (error) {
      console.error('Error fetching analysis data:', error);
      // Don't show an alert as this might be a new feature
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      // The root layout will handle the navigation after session is cleared
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get color based on emotion
  const getEmotionColor = (emotion) => {
    const emotions = {
      'Happy': '#4CAF50',
      'Sad': '#2196F3',
      'Angry': '#F44336',
      'Anxious': '#FF9800',
      'Neutral': '#9E9E9E',
      // Add more emotions and colors as needed
    };
    
    return emotions[emotion] || '#9E9E9E';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={80} color="#007AFF" />
        <Text style={styles.title}>Profile</Text>
      </View>

      {loading ? (
        <View style={styles.noProfile}>
          <Text style={styles.noProfileText}>Loading profile...</Text>
        </View>
      ) : userData ? (
        <View style={styles.profileInfo}>
          <View style={styles.infoSection}>
            <Text style={styles.label}>Display Name</Text>
            <Text style={styles.value}>{userData.display_name}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{userData.email}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Member Since</Text>
            <Text style={styles.value}>
              {new Date(userData.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.noProfile}>
          <Text style={styles.noProfileText}>No profile found</Text>
        </View>
      )}

      {/* Analysis Results Section */}
      <View style={styles.analysisSection}>
        <Text style={styles.sectionTitle}>Journal Analysis</Text>
        
        {analysisLoading ? (
          <Text style={styles.loadingText}>Loading analysis data...</Text>
        ) : analysisData.length > 0 ? (
          analysisData.map((item, index) => (
            <View key={index} style={styles.analysisCard}>
              <View style={styles.queryRow}>
                <Text style={styles.queryLabel}>Journal Entry:</Text>
                <Text style={styles.queryText}>{item.query_text}</Text>
              </View>
              
              <View style={styles.emotionRow}>
                <Text style={styles.emotionLabel}>Emotion:</Text>
                <View style={[styles.emotionChip, { backgroundColor: getEmotionColor(item.detected_emotion) }]}>
                  <Text style={styles.emotionText}>{item.detected_emotion}</Text>
                </View>
                <Text style={styles.confidenceText}>
                  {Math.round(item.confidence_score * 100)}% confidence
                </Text>
              </View>
              
              <View style={styles.topicRow}>
                <Text style={styles.topicLabel}>Topic:</Text>
                <Text style={styles.topicText}>{item.extracted_topic}</Text>
              </View>
              
              <View style={styles.feedbackRow}>
                <Text style={styles.feedbackLabel}>Feedback:</Text>
                <Text style={styles.feedbackText}>{item.personalized_feedback}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noAnalysis}>
            <Text style={styles.noAnalysisText}>No analysis data available yet.</Text>
            <Text style={styles.noAnalysisSubtext}>
              Add some journal entries and use the analyze feature to see results here.
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },
  profileInfo: {
    padding: 20,
  },
  infoSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  noProfile: {
    padding: 20,
    alignItems: 'center',
  },
  noProfileText: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Analysis Section Styles
  analysisSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
  analysisCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  queryRow: {
    marginBottom: 10,
  },
  queryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  queryText: {
    fontSize: 16,
  },
  emotionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  emotionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  emotionChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  emotionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  confidenceText: {
    fontSize: 12,
    color: '#666',
  },
  topicRow: {
    marginBottom: 10,
  },
  topicLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  topicText: {
    fontSize: 15,
  },
  feedbackRow: {
    marginTop: 5,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  feedbackText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#444',
  },
  noAnalysis: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  noAnalysisText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noAnalysisSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});// import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
// import { useAuth } from '../../contexts/AuthContext';
// import { router } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { useState, useEffect } from 'react';
// import { API_URL } from '../../constants';

// export default function ProfileScreen() {
//   const { signOut, session } = useAuth();
//   const [userData, setUserData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       if (!session?.user?.id) return;

//       const response = await fetch(`${API_URL}/users/${session.user.id}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch user data');
//       }
//       const data = await response.json();
//       setUserData(data);
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       Alert.alert('Error', 'Failed to load user data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       setLoading(true);
//       await signOut();
//       // The root layout will handle the navigation after session is cleared
//     } catch (error) {
//       console.error('Sign out error:', error);
//       Alert.alert('Error', 'Failed to sign out. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Ionicons name="person-circle-outline" size={80} color="#007AFF" />
//         <Text style={styles.title}>Profile</Text>
//       </View>

//       {loading ? (
//         <View style={styles.noProfile}>
//           <Text style={styles.noProfileText}>Loading profile...</Text>
//         </View>
//       ) : userData ? (
//         <View style={styles.profileInfo}>
//           <View style={styles.infoSection}>
//             <Text style={styles.label}>Display Name</Text>
//             <Text style={styles.value}>{userData.display_name}</Text>
//           </View>

//           <View style={styles.infoSection}>
//             <Text style={styles.label}>Email</Text>
//             <Text style={styles.value}>{userData.email}</Text>
//           </View>

//           <View style={styles.infoSection}>
//             <Text style={styles.label}>Member Since</Text>
//             <Text style={styles.value}>
//               {new Date(userData.created_at).toLocaleDateString()}
//             </Text>
//           </View>

//           <View style={styles.infoSection}>
//             <Text style={styles.label}>User ID</Text>
//             <Text style={styles.value}>{userData.id}</Text>
//           </View>
//         </View>
//       ) : (
//         <View style={styles.noProfile}>
//           <Text style={styles.noProfileText}>No profile found</Text>
//         </View>
//       )}

//       <TouchableOpacity style={styles.button} onPress={handleSignOut}>
//         <Text style={styles.buttonText}>Sign Out</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     alignItems: 'center',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#000',
//     marginTop: 10,
//   },
//   profileInfo: {
//     padding: 20,
//   },
//   infoSection: {
//     marginBottom: 20,
//     padding: 15,
//     backgroundColor: '#f8f9fa',
//     borderRadius: 10,
//   },
//   label: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 5,
//   },
//   value: {
//     fontSize: 16,
//     color: '#000',
//     fontWeight: '500',
//   },
//   noProfile: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   noProfileText: {
//     fontSize: 16,
//     color: '#666',
//   },
//   button: {
//     backgroundColor: '#007AFF',
//     padding: 15,
//     borderRadius: 10,
//     margin: 20,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// }); 

// import React, { useState } from 'react';
// import { Alert, Button } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useAuth } from '../../contexts/AuthContext';

// const ProfileScreen = () => {
//   const router = useRouter();
//   const { signOut } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState(null);

//   const handleSignOut = async () => {
//     try {
//       setLoading(true);
//       console.log('Starting sign out process...');
      
//       // Call signOut from AuthContext
//       await signOut();
      
//       // Clear any local state
//       setUser(null);
      
//       // Force a reload of the app to clear all state
//       router.replace('/(auth)/sign-in');
      
//       console.log('Sign out completed, redirected to sign-in');
//     } catch (error) {
//       console.error('Sign out error:', error);
//       Alert.alert(
//         'Sign Out Failed',
//         'There was an error signing out. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Button title="Sign Out" onPress={handleSignOut} disabled={loading} />
//   );
// };

// export default ProfileScreen; 
