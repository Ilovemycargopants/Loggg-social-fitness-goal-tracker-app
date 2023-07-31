import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Alert } from 'react-native';
import { doc, getDocs, updateDoc, getFirestore,groupSnapshot,collection,addDoc,setDoc,arrayUnion } from "firebase/firestore";
import { firebase_Auth} from '../fireBaseconfig'; 

const JoinGroup = () => {
  const [groupCode, setGroupCode] = useState('');

  const handleJoinGroup = async () => {
    const auth = firebase_Auth;
    const currentUser = auth.currentUser;
    const db = getFirestore();

    // Get all groups
    const groupsCollection = collection(db, "Groups");
    const groupSnapshot = await getDocs(groupsCollection);
    
    // Find the group that matches the first four characters of the entered code
    const groupDoc = groupSnapshot.docs.find(doc => doc.id.substring(0, 4) === groupCode.substring(0, 4));
    
    if (groupDoc) {
      const groupData = groupDoc.data();
  
      if (!groupData.members.includes(currentUser.uid)) {
        const groupDocRef = doc(db, "Groups", groupDoc.id);
  
        // Add the user to the group
        await updateDoc(groupDocRef, {
          members: arrayUnion(currentUser.uid),
        });

        // Add group to user's Groups subcollection
        const userGroupDocRef = doc(db, "Users", currentUser.uid, "Groups", groupDocRef.id);
        await setDoc(userGroupDocRef, {
          groupName: groupData.groupName,
          groupCode: groupDocRef.id,
        });

        // Create a new wallet for the user in the Wallets main collection
      const walletCollectionRef = collection(db, "Wallets");
      const walletDocRef = doc(walletCollectionRef);
      await setDoc(walletDocRef, {
        total: 0,
        daily: 0,
        weekly: 0,
        monthly: 0,
        groupCode: groupDoc.id, // This should be the group's ID
        owner: currentUser.uid, // This should be the user's UID
      });


        console.log(`User added to group: ${groupDoc.id}`);
        Alert.alert("Group Joined", `You have successfully joined the group: ${groupData.groupName}`);
      } else {
        console.log('User is already a member of this group.');
        Alert.alert("Already a Member", `You are already a member of the group: ${groupData.groupName}`);
      }
    } else {
      Alert.alert("Invalid Group Code", "No group exists with the entered code.");
      console.log('Invalid group code.');
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Group</Text>
      <Text style={styles.header}>Input Group Code (Just first 4 )</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setGroupCode(text)}
        value={groupCode}
        placeholder="Enter group code..."
      />
      <TouchableOpacity style={styles.button} onPress={handleJoinGroup}>
        <Text style={styles.buttonText}>Join Group</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 20,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JoinGroup;