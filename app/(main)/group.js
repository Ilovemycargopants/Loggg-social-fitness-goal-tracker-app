import React, { useState,useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList,renderItem } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { getFirestore, doc, collection, getDoc, getDocs, onSnapshot,query,where,updateDoc} from "firebase/firestore";
import { firebase_Auth, db } from '../../fireBaseconfig';
import { Link, useRouter } from 'expo-router';





const Item = ({ username, profile, profileImage, points }) => (
  <TouchableOpacity style={styles.item}>
    {profileImage && <Image style={styles.profileImage} source={profileImage} />}
    <View style={styles.userInfo}>
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.profile}>{profile}</Text>
    </View>
    <View style={styles.pointBox}>
      <Text style={styles.points}>{points}</Text>
    </View>
  </TouchableOpacity>
);

const Group = () => {
  const [selectedOption, setSelectedOption] = useState('daily');
  const [data, setData] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const userDoc = await getDoc(doc(db, "Users", firebase_Auth.currentUser.uid));
      setSelectedGroup(userDoc.data().selectedGroup);
      if (userDoc.data().selectedGroup !== 'Public') {
        const walletQuery = query(collection(db, "Wallets"), where("groupCode", "==", userDoc.data().selectedGroup));
        const walletSnap = await getDocs(walletQuery);
        const fetchedDataPromises = walletSnap.docs.map(async (walletDoc) => {
          const ownerRef = await getDoc(doc(db, "Users", walletDoc.data().owner));
          return {
            id: ownerRef.id,
            username: ownerRef.data().name,
            profile: ownerRef.data().pfp,
            points: walletDoc.data()[selectedOption]
          };
        });
        const fetchedData = await Promise.all(fetchedDataPromises);
        setData(fetchedData);
      }
    }
    fetchData();
  }, [selectedOption]);
  const handleGroupChangePress = () => {
    router.replace('/groupSelector');
  };

  const sortedData = [...data].sort((a, b) => b.points - a.points);

  if (selectedGroup === 'Public') {
    return (
      <View style={styles.container}>
        <Text>Sorry, private data this page shows all of the users inside of your group and their total points for the day , week , and month try it out in your group!</Text>
      </View>
    )
  } else { 
    return (
      <View style={styles.container}>
      <View style={styles.dropdownContainer}>
      <RNPickerSelect
        style={pickerSelectStyles}
        onValueChange={(value) => setSelectedOption(value)}
        value={selectedOption}
        items={[
          { label: 'Day', value: 'daily' },  // Changed the order
          { label: 'Week', value: 'weekly' },
          { label: 'Month', value: 'monthly' },
        ]}
      />
      </View>
      <FlatList
        data={sortedData}
        renderItem={({ item }) => (
          <Item username={item.username} profile={item.profile} profileImage={item.profileImage} points={item.points} />
        )}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => handleGroupChangePress('Your new group')} style={styles.changeGroupButton}>
            <Text style={styles.changeGroupText}>Change Group</Text>
          </TouchableOpacity>
        </View>
      
    </View>
    
  );
};

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profile: {
    fontSize: 14,
    color: '#666',
  },
  pointBox: {
    width: 40,
    height: 20,
    backgroundColor: '#4d4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  points: {
    color: '#fff',
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  changeGroupButton: {
    backgroundColor: '#3897f1',
    borderRadius: 5,
    height: 45,
    marginTop: 10,
    marginBottom: 10,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeGroupText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  inputAndroid: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  defaultProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultProfileText: {
    fontSize: 20,
    color: '#fff',
  },
});

export default Group;
