import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { firebase_Auth, db } from '../../fireBaseconfig';
import { onSnapshot, doc,query,collection,where,getDocs,orderBy } from "firebase/firestore";
import Tweet from '../../tweet1';

const ProfilePage = () => {
  const [user, setUser] = useState({ name: '', points: 0, profilePicture: '', selectedGroup: '' });
  const [wallet, setWallet] = useState({ total: 0, daily: 0, weekly: 0, monthly: 0 });
  const [logs, setLogs] = useState([]);
  const [cleared, setCleared] = useState(false);
  const router = useRouter();
  const userId = firebase_Auth.currentUser.uid;
  

  useEffect(() => {
    const userRef = doc(db, "Users", userId);
    onSnapshot(userRef, (doc) => {
      const userData = doc.data();
      setUser({ 
        name: userData.name, 
        profilePicture: userData.Pfp || '',
        selectedGroup: userData.selectedGroup || '',
      });
    });
  }, []);

  useEffect(() => {
    if (user.selectedGroup) {
      const walletsCollection = collection(db, "Wallets");
      const walletQuery = query(walletsCollection, where("owner", "==", userId), where("groupCode", "==", user.selectedGroup));

      getDocs(walletQuery)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            setWallet(doc.data());
            setUser(prevState => ({...prevState, points: doc.data().total}));
          });
        })
        .catch((error) => {
          console.error("Error getting wallet: ", error);
        });
    }
  }, [user.selectedGroup]);

  useEffect(() => {
    if (user.selectedGroup) {
      const logsRef = collection(db, 'Logs');
      const q = query(logsRef, where('groupId', '==', user.selectedGroup), where('user.id', '==', userId), where('cleared', '==', cleared), orderBy('date', 'desc'));
      const unsubscribe = onSnapshot(q, querySnapshot => {
        const fetchedLogs = [];

        querySnapshot.forEach(docSnapshot => {
          const data = docSnapshot.data();
          const dateObject = new Date(data.date.seconds * 1000);
          const dateString = dateObject.toLocaleDateString();

          fetchedLogs.push({
            ...data,
            id: docSnapshot.id,
            date: dateString,
            text: data.text,
            user: { // handle user object here
              id: data.user.id,
              name: data.user.name,
              pfp: data.user.pfp,
            },
          });
        });

        setLogs(fetchedLogs);
      });

      return () => unsubscribe();
    }
  }, [user.selectedGroup, cleared, userId]);


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

  const handlePendingPress = () => {
    setCleared(false);
  };

  const handleClearedPress = () => {
    setCleared(true);
  };

  const handleSignOutPress = () => {
    firebase_Auth.signOut();
    router.replace('/login');
  };
  const handleGroupChangePress = () => {
    router.replace('/groupSelector');  // replace '/groupSelector' with your actual group selection page route
  };

  const handleDeleteAccountPress = () => {
    // Confirm before proceeding
    Alert.alert(
        "Delete Account",
        "Are you sure you want to delete your account? This action cannot be undone.",
        [
            { text: "Cancel", style: "cancel" },
            { text: "Yes", onPress: () => deleteUserAccount() },
        ],
        { cancelable: false }
    );
};

const deleteUserAccount = () => {
    // Get current user
    const user = firebase_Auth.currentUser;
    user.delete()
        .then(() => {
            console.log("User deleted.");
            router.replace('/login'); // Redirect the user
        })
        .catch((error) => {
            console.error("Error deleting user: ", error);
        });
};




  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profilePicContainer}>
          {user.profilePicture ? (
            <Image source={{uri: user.profilePicture}} style={styles.profilePic} />
          ) : (
            <View style={styles.defaultProfilePic}/>
          )}
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userPoints}>{user.points}</Text>
      </View>
  
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={[styles.button, cleared ? styles.inactiveButton : styles.activeButton]} 
          onPress={handlePendingPress}
        >
          <Text style={[styles.buttonText, cleared ? styles.inactiveButtonText : styles.activeButtonText]}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, cleared ? styles.activeButton : styles.inactiveButton]} 
          onPress={handleClearedPress}
        >
          <Text style={[styles.buttonText, cleared ? styles.activeButtonText : styles.inactiveButtonText]}>
            Cleared
          </Text>
        </TouchableOpacity>
      </View>
  
      <ScrollView style={styles.tweetsContainer}>
        {logs.map(log => (
          <Tweet
          key={log.id}
          user={log.user}
          datePosted={log.date}
          content={log.text}
          handleVote={handleVote}
          upVotes={log.votes.thumbsUp}
          downVotes={log.votes.thumbsDown}
          comments={log.comments}
          shares={log.shares}
          pointTotal={log.goal.pointTotal}
          category={log.goal.category}
          goalTitle={log.goal.name}
          image={log.picture} 
          userId={userId}
        />
        ))}
      </ScrollView>
  
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleGroupChangePress} style={styles.changeGroupButton}>
          <Text style={styles.changeGroupText}>Change Group</Text>
        </TouchableOpacity>
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={handleSignOutPress} style={styles.signOutButton}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteAccountPress} style={styles.deleteAccountButton}>
            <Text style={styles.deleteAccountText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between', // Ensures that the sign out button is at the bottom
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    margin: 10,
  },
  profilePicContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePic: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  defaultProfilePic: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'gray',
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  userPoints: {
    fontSize: 16,
    color: 'green',
  },
  topBar: {
    height: 50,
    backgroundColor: '#384160',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    width: 100,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#4CAF50',
  },
  inactiveButton: {
    backgroundColor: '#D3D3D3',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeButtonText: {
    color: '#FFF',
  },
  inactiveButtonText: {
    color: '#000',
  },
  buttonContainer: {
    justifyContent: 'center', 
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonRow: {
    flexDirection: 'row', 
    justifyContent: 'center', // Changed from 'space-between' to 'center'
    width: '90%',
    marginTop: 10, // To add a little space between the buttons
  },
  signOutButton: {
    width: 140, 
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'red',
    marginHorizontal: 10, // Add space between the buttons
  },
  signOutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  changeGroupButton: {
    width: 140, 
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5, 
    backgroundColor: '#4CAF50',
    marginBottom: 10, // To add a little space between the buttons
  },
  changeGroupText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteAccountButton: {
    width: 140, 
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'red',
    marginHorizontal: 10, // Add space between the buttons
  },
  deleteAccountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfilePage;
