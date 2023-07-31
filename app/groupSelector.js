import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Pressable, ScrollView, ActivityIndicator, TouchableOpacity,Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { COLORS, SHADOWS, SIZES, FONT } from '../constants';
import { Ionicons } from '@expo/vector-icons';
import { firebase_Auth, db } from '../fireBaseconfig';
import { collection, query, onSnapshot, doc, updateDoc,deleteDoc } from "firebase/firestore";

const GroupSelector = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [signedOut, setSignedOut] = useState(false);  // New state variable
  const router = useRouter();
  
  const userId = !signedOut && firebase_Auth.currentUser ? firebase_Auth.currentUser.uid : null;

  useEffect(() => {
    if (userId) {
      const userRef = doc(db, 'Users', userId);
      const groupsCollectionRef = collection(userRef, 'Groups');

      const unsub = onSnapshot(groupsCollectionRef, (snapshot) => {
        let userGroups = [];
        snapshot.forEach((doc) => {
          userGroups.push({ id: doc.id, ...doc.data() });
        });
        setGroups(userGroups);
      });

      return () => unsub();
    }
  }, [userId]);

  const handleGroupSelect = async (groupId) => {
    setLoading(true);
    const userRef = doc(db, "Users", userId);
    await updateDoc(userRef, {
      selectedGroup: groupId
    });
    setLoading(false);
    router.replace('home');
  };

  const handleCreatePress = () => {
    setCreateLoading(true);
    // Do something when the Create button is pressed
    setCreateLoading(false);
  };

  const handleJoinPress = () => {
    setJoinLoading(true);
    // Do something when the Join button is pressed
    setJoinLoading(false);
  };

  const handleSignOutPress = async () => {
    setSignOutLoading(true);
    await firebase_Auth.signOut();
    setSignedOut(true);  // Set signedOut to true
    setSignOutLoading(false);
    router.replace('login');
  };
  const handleDeleteGroup = async (groupId) => {
    // confirm deletion
    Alert.alert(
      "Delete Group",
      "Are you sure you want to delete this group?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: async () => {
            // Reference to the group in the user's document
            const groupRefInUser = doc(db, "Users", userId, "Groups", groupId);
  
            // Delete the group from the user's document
            await deleteDoc(groupRefInUser);
  
            // TODO: Remove the user from the group members in the Groups collection
            // This depends on how you've structured the group members in the Groups collection
          } 
        }
      ]
    );
  };
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
      {groups.map((group) => (
  <View key={group.id} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
    <Pressable onPress={() => handleGroupSelect(group.id)} disabled={loading}>
      <View
        style={{
          width: 140,
          height: 50,
          backgroundColor: COLORS.primary,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: 'white' }}>
            {group.groupName}
          </Text>
        )}
      </View>
    </Pressable>
    <TouchableOpacity onPress={() => handleDeleteGroup(group.id)} style={{ marginLeft: 10 }}>
      <Ionicons name="close" size={24} color="red" />
    </TouchableOpacity>
  </View>
))}

      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginTop: 30,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            width: 140,
            height: 50,
            backgroundColor: COLORS.primary,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Link href={'/createGroup'} asChild>
            <Pressable onPress={handleCreatePress} disabled={createLoading}>
              {createLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={{ ...FONT.h3, ...SHADOWS.large, color: 'white' }}>Create Group</Text>
              )}
            </Pressable>
          </Link>
        </View>

        <View
          style={{
            width: 140,
            height: 50,
            backgroundColor: COLORS.secondary,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Link href={'/joinGroup'} asChild>
            <Pressable onPress={handleJoinPress} disabled={joinLoading}>
              {joinLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={{ ...FONT.h3, ...SHADOWS.large, color: 'white' }}>Join Group</Text>
              )}
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={{ alignItems: 'center' }}>
        <Pressable onPress={handleSignOutPress} disabled={signOutLoading}>
          <View
            style={{
              width: 120,
              height: 40,
              backgroundColor: 'red',
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {signOutLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: 'white' }}>Sign Out</Text>
            )}
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default GroupSelector;