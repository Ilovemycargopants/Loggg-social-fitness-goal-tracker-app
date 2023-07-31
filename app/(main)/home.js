import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import Tweet from '../../tweet1';
import { onSnapshot, doc, query, collection, where, getDocs, getDoc, orderBy,runTransaction } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons/Ionicons';
import { firebase_Auth, db,storage } from '../../fireBaseconfig';
import { getDownloadURL, ref } from "firebase/storage";

const HomePage = () => {
  const [logs, setLogs] = useState([]);
  const [cleared, setCleared] = useState(false);
  const [groupId, setGroupId] = useState(null);
  const [userData, setUserData] = useState(null);
  const auth = firebase_Auth;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (auth && auth.currentUser) {
          const userRef = doc(db, 'Users', auth.currentUser.uid);
          const docSnapshot = await getDoc(userRef);

          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setUserData(data);
            setGroupId(data.selectedGroup);
          } else {
            console.log("No such document!");
          }
        } else {
          console.log("auth or auth.currentUser is not defined");
        }
      } catch (error) {
        console.log("An error occurred while fetching user data: ", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (groupId) {
      const logsRef = collection(db, 'Logs');
      const q = query(logsRef, where('groupId', '==', groupId), where('cleared', '==', cleared), orderBy('date', 'desc'));
      const unsubscribe = onSnapshot(q, async querySnapshot => { // added async here
        const fetchedLogs = [];
  
        for (let docSnapshot of querySnapshot.docs) { // use for..of to allow await inside loop
          const data = docSnapshot.data();
          
  
          let imageUrl = null;
          if (data.image) {
            const imageRef = ref(storage, data.picture);
            imageUrl = await getDownloadURL(imageRef);
          }
  
          const dateObject = new Date(data.date.seconds * 1000);
          const dateString = dateObject.toLocaleDateString();
  
          fetchedLogs.push({
            ...data,
            id: docSnapshot.id,
            date: dateString,
            text: data.text,
            image: data.picture, // added the image field here
          });
        };
  
        setLogs(fetchedLogs);
      });
  
      return () => unsubscribe();
    }
  }, [groupId, cleared]);

  const handlePendingPress = () => {
    setCleared(false);
  };

  const handleClearedPress = () => {
    setCleared(true);
  };

  const handleVote = async (logId, voteType) => {
    if (!logId || !voteType || !userData) return;
  
    // Restrict user from voting on their own log
    const logRef = doc(db, 'Logs', logId);
    const logSnapshot = await getDoc(logRef);
    const logData = logSnapshot.data();
    if (logData.user.id === auth.currentUser.uid) {
      console.log("You can't vote on your own log.");
      alert("You can't vote on your own log.");
      return;
    }
  
    // Transaction to update vote
    await runTransaction(db, async (transaction) => {
      const docSnapshot = await transaction.get(logRef);
  
      if (!docSnapshot.exists()) {
        throw "Document does not exist!";
      }
  
      // Check if user has already voted
      if (docSnapshot.data().votes.voters.includes(auth.currentUser.uid)) {
        console.log("You have already voted on this log.");
        alert("You have already voted on this log.");
        return;
      }
  
      // Update thumbsUp or thumbsDown field and add voter
      if (voteType === 'up') {
        transaction.update(logRef, {
          'votes.thumbsUp': docSnapshot.data().votes.thumbsUp + 1,
          'votes.voters': [...docSnapshot.data().votes.voters, auth.currentUser.uid]
        });
      } else if (voteType === 'down') {
        transaction.update(logRef, {
          'votes.thumbsDown': docSnapshot.data().votes.thumbsDown + 1,
          'votes.voters': [...docSnapshot.data().votes.voters, auth.currentUser.uid]
        });
      } else {
        console.log("Invalid vote type.");
        return;
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
  <TouchableOpacity 
    style={[styles.button, cleared ? styles.buttonNotSelected : styles.buttonSelected]} 
    onPress={handlePendingPress}
  >
    <Text style={styles.buttonText}>Pending</Text>
  </TouchableOpacity>
  <TouchableOpacity 
    style={[styles.button, cleared ? styles.buttonSelected : styles.buttonNotSelected]} 
    onPress={handleClearedPress}
  >
    <Text style={styles.buttonText}>Cleared</Text>
  </TouchableOpacity>
</View>
      <ScrollView style={styles.scrollView}>
  {logs.map(log => (
    <Tweet
      key={log.id}
      id={log.id}
      user={{ profilePic: log.user.pfp, name: log.user.name }}
      handleVote={handleVote}
      datePosted={log.date}
      content={log.text}
      upVotes={log.votes.thumbsUp}
      downVotes={log.votes.thumbsDown}
      comments={log.comments}
      shares={log.shares}
      pointTotal={log.goal.pointTotal}
      category={log.goal.category}
      goalTitle={log.goal.name}
      image={log.picture} // added this line
    />
  ))}
</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    height: 50,
    backgroundColor: '#384160',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftButton: {
    width: 100,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  rightButton: {
    width: 100,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D3D3D3',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearedButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  button: {
    width: 100,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSelected: {
    backgroundColor: '#4CAF50', // Green when selected
  },
  buttonNotSelected: {
    backgroundColor: '#D3D3D3', // Gray when not selected
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomePage;
