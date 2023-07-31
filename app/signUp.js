import React, { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, Alert, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, SHADOWS, SIZES, FONT } from '../constants';
import { useRouter } from 'expo-router';
import { firebase_Auth } from '../fireBaseconfig';
import { createUserWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, setDoc, collection, addDoc,updateDoc,arrayUnion } from "firebase/firestore";

const SignUp = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const db = getFirestore();
  const usersCollection = collection(db, "Users");
  const [loading, setLoading] = useState(false);
  const auth = firebase_Auth;
  const handleBack = () => {
    router.replace("login");
  };

  const signUp = async () => {
    setLoading(true);
    try {
      // 1. Sign up the user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
      // 2. Save the user's name and selected group data to Firestore
      const uid = userCredential.user.uid;
      const userDocRef = doc(db, "Users", uid);
      await setDoc(userDocRef, {
        name: name,
        pfp: " ",
        selectedGroup: "Public", // This should be 'Public' if it's the default group
      });
  
      // 3. Create a wallet document for the user in the 'Wallets' collection
      const walletCollectionRef = collection(db, "Wallets");
      const walletDocRef = doc(walletCollectionRef); // Concatenate user uid and group id
      await setDoc(walletDocRef, {
        total: 0,
        daily: 0,
        weekly: 0,
        monthly: 0,
        groupCode: "Public", // This should be 'Public' to match your groupCode
        owner: uid,
      });
  
      // 4. Add the user to the public group in the 'Groups' collection
      const groupsCollectionRef = collection(db, "Groups");
      const groupDocRef = doc(groupsCollectionRef, "Public"); // This should be 'Public' to match your groupCode
      await updateDoc(groupDocRef, {
        members: arrayUnion(uid), // Add the new user's uid to the 'members' array
      });
  
      const userGroupDocRef = doc(db, "Users", uid, "Groups", "Public");
      await setDoc(userGroupDocRef, {
        groupName: 'Public',
        groupCode: 'test123', // Update this if 'test123' is not your actual groupCode for Public group
      });
  
      // 6. Redirect to the groupSelector page
      router.replace("groupSelector");
    } catch (error) {
      console.error(error);
      switch (error.code) {
        case 'auth/invalid-email':
          Alert.alert('Invalid Email', 'The email address is badly formatted.');
          break;
        case 'auth/email-already-in-use':
          Alert.alert('Email Already in Use', 'This email address is already in use.');
          break;
        case 'auth/weak-password':
          Alert.alert('Weak Password', 'Password should be at least 6 characters.');
          break;
        default:
          Alert.alert('Sign up failed');
      }
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>LOGS</Text>
          <Text style={{ fontSize: 16, textAlign: 'center' }}>Sign Up</Text>
        </View>

        <TextInput
  value={name}
  autoCapitalize='none'
  onChangeText={(text) => setName(text)}
  placeholder='Name'
  placeholderTextColor='#ffffff'  // add this
  style={{
    width: 300,
    height: 50,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    color: "white"
  }}
/>
<TextInput
  value={email}
  autoCapitalize='none'
  onChangeText={(text) => setEmail(text)}
  placeholder='Email'
  placeholderTextColor='#ffffff'  // add this
  style={{
    width: 300,
    height: 50,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    color: "white"
  }}
/>
<TextInput
  value={password}
  autoCapitalize='none'
  onChangeText={(text) => setPassword(text)}
  placeholder='Password'
  placeholderTextColor='#ffffff'  // add this
  secureTextEntry
  style={{
    width: 300,
    height: 50,
    backgroundColor: COLORS.tertiary,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 10,
    color: "white"
  }}
/>

<View style={{ width: 300, marginBottom: 10 }}>
        <TouchableOpacity 
          onPress={signUp} 
          style={{ ...buttonStyles(0) }} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={{ ...FONT.h2, ...SHADOWS.large, color: 'white' }}>Sign Up</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleBack} 
          style={{ ...buttonStyles(1) }}
        >
          <Text style={{ ...FONT.h2, ...SHADOWS.large, color: 'white' }}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
  );
}

const buttonStyles = (index) => ({
  width: '100%',
  height: 50,
  backgroundColor: index % 2 === 0 ? COLORS.primary : COLORS.secondary,
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 10,
});

export default SignUp;
