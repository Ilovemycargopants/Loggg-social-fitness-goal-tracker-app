import React, { useState, useEffect } from 'react';
import { firebase_Auth, db } from '../fireBaseconfig';
import { StyleSheet, View, Text, TextInput, ScrollView, Button, Switch } from 'react-native';
import { getFirestore, doc, setDoc, collection, addDoc, getDoc,getDocs } from "firebase/firestore";
import RNPickerSelect from 'react-native-picker-select';

const GoalCreation = () => {
  const auth = firebase_Auth;
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Misc'); // Set default category to 'Misc'
  const [description, setDescription] = useState('');
  const [totalPoints, setTotalPoints] = useState('');
  const [userData, setUserData] = useState({}); // New state for user data
  const [isAchievement, setIsAchievement] = useState(false); // New state for 'Is Achievement' switch
  const [goalCode, setGoalCode] = useState(''); // New state for 'Goal Code' input

  useEffect(() => {
    const fetchUserData = async (uid) => {
      const userRef = doc(db, 'Users', uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    };

    auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user.uid);
      }
    });
  }, []);

  const createGoal = async () => {
    console.log('Starting goal creation');
  
    if (!title || Number(totalPoints) <= 0) {
      console.log('Invalid input values');
      alert("Please fill all mandatory fields: Title and Total Points");
      return;
    }
  
    console.log('Inputs are valid');
    console.log("Title:", title);
    console.log("Category:", category);
    console.log("Description:", description);
    console.log("Total Points:", totalPoints);
  
    const userId = auth.currentUser.uid;
    console.log('User ID:', userId);
  
    if (userData.selectedGroup) {
      console.log('Selected group:', userData.selectedGroup);
  
      if (isAchievement) {
        const goalsCollection = collection(db, 'Groups', userData.selectedGroup, 'Goals');
        const goalSnapshot = await getDocs(goalsCollection);
        let goalRef;
  
        goalSnapshot.forEach((doc) => {
          if (doc.id.slice(0, 4) === goalCode) {
            goalRef = doc.ref;
          }
        });
  
        if (!goalRef) {
          alert('No goal found with the specified code.');
          return;
        }
  
        const achievementRef = await addDoc(collection(goalRef, 'Achievements'), {
          name: title,
          category: category,
          description: description,
          pointTotal: Number(totalPoints),
          creator: userData.name,
        });
  
        console.log('Achievement created with ID:', achievementRef.id);
  
      } else {
        const selectedGroupGoalsCollection = collection(db, 'Groups', userData.selectedGroup, 'Goals');
        const goalRef = await addDoc(selectedGroupGoalsCollection, {
          name: title,
          category: category,
          description: description,
          pointTotal: Number(totalPoints),
          creator: userData.name,
        });
  
        const goalCode = goalRef.id.slice(0, 4); // first four characters of goal UUID as goalCode
        await setDoc(goalRef, { goalCode }, { merge: true });
  
        console.log('Goal created with ID:', goalRef.id);
      }
  
      alert('Operation completed successfully!');
      setTitle('');
      setCategory('Misc');
      setDescription('');
      setTotalPoints('');
      setIsAchievement(false);
      setGoalCode('');
  
    } else {
      console.log("No group selected.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Goal Creation</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={setTitle}
          value={title}
        />
        <Text>Category</Text>
        <RNPickerSelect
          style={{ inputAndroid: styles.input }}
          onValueChange={(value) => setCategory(value)}
          items={[
            { label: 'Misc', value: 'Misc' },
            { label: 'Social', value: 'Social' },
            { label: 'Self Improvement', value: 'Self Improvement' },
            { label: 'Group Activities', value: 'Group Activities' },
            { label: 'Health', value: 'Health' },
            { label: 'Fitness', value: 'Fitness' },
            { label: 'Music', value: 'Music' },
            { label: 'Self Care', value: 'Self Care' },
            { label: 'Family/Friends/Lovers', value: 'Family/Friends/Lovers' },
            { label: 'School', value: 'School' },
            { label: 'Diet', value: 'Diet' },
          ]}
          value={category}
        />
        <Text>Description</Text>
        <TextInput
          style={styles.input}
          onChangeText={setDescription}
          value={description}
        />
        <Text>Total Points</Text>
        <TextInput
          style={styles.input}
          onChangeText={setTotalPoints}
          value={totalPoints}
          keyboardType="numeric"
        />
        <View style={styles.switchContainer}>
          <Text>Is Achievement?</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isAchievement ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setIsAchievement}
            value={isAchievement}
          />
        </View>
        {isAchievement && (
          <>
            <Text>Goal Code</Text>
            <TextInput
              style={styles.input}
              onChangeText={setGoalCode}
              value={goalCode}
            />
          </>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Create"
          onPress={createGoal} 
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
});

export default GoalCreation;
