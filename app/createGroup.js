import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch,ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, addDoc, doc, setDoc, updateDoc,collection,where,query,getDocs } from 'firebase/firestore';
import { firebase_Auth, db } from '../fireBaseconfig';

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [groupCode, setGroupCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [switches, setSwitches] = useState({
    fitness: false,
    eatingHealthy: false,
    socialCreator: false,
    music: false,
    couples: false,
    selfCare: false,
    goodHabits: false,
    schoolAndStudy: false,
    fashion : false
  });
  const categoryGoals = {
    fitness: [
      { name: 'Going to the gym', pointTotal: 3, category: 'Fitness', description: 'Take or select a picture showing your gym routine.' },
      { name: '30-minute cardio', pointTotal: 8, category: 'Fitness', description: 'Take or select a picture after your 30-minute cardio workout.' },
      { name: 'Stretching routine', pointTotal: 4, category: 'Fitness', description: 'Take or select a picture of your stretching routine.' },
      { name: 'Outdoor sports (Basketball, Soccer, etc.)', pointTotal: 8, category: 'Fitness', description: 'Take or select a picture of your outdoor sports activity.' },
      { name: 'Leg day', pointTotal: 8, category: 'Fitness', description: 'Take or select a picture showing your leg day workout.' },
      { name: 'Back day', pointTotal: 5, category: 'Fitness', description: 'Take or select a picture showing your back day workout.' },
      { name: 'Chest day', pointTotal: 5, category: 'Fitness', description: 'Take or select a picture showing your chest day workout.' },
      { name: 'Ab workout', pointTotal: 6, category: 'Fitness', description: 'Take or select a picture showing your ab workout.' },
      { name: 'Bicep/triceps', pointTotal: 4, category: 'Fitness', description: 'Take or select a picture showing your bicep/triceps workout.' },
      { name: 'Protein Shake Pre workout', pointTotal: 5, category: 'Health', description: 'Take or select a picture of your pre-workout protein shake.' }
    ],
    eatingHealthy: [
      { name: 'Eating a salad', pointTotal: 7, category: 'Health', description: 'Take or select a picture of the salad you ate.' },
      { name: 'Eating a fruit', pointTotal: 3, category: 'Health', description: 'Take or select a picture of the fruit you ate.' },
      { name: 'Eating lean proteins', pointTotal: 4, category: 'Health', description: 'Take or select a picture of your meal with lean proteins.' },
      { name: 'Cooking a healthy meal at home', pointTotal: 6, category: 'Health', description: 'Take or select a picture of the healthy meal you cooked at home.' },
      { name: 'Meal prepping', pointTotal: 15, category: 'Health', description: 'Take or select a picture of your meal prep.' },
      { name: 'Eating out healthy', pointTotal: 10, category: 'Health', description: 'Take or select a picture of your healthy meal at a restaurant.' },
      { name: 'Getting healthy groceries', pointTotal: 15, category: 'Health', description: 'Take or select a picture of your healthy groceries.' },
      { name: 'Drink a gallon of water', pointTotal: 10, category: 'Health', description: 'Take or select a picture of the gallon of water you drank.' },
      { name: 'Make a healthy smoothie', pointTotal: 3, category: 'Health', description: 'Take or select a picture of the healthy smoothie you made.' },
      { name: 'Healthy meal', pointTotal: 5, category: 'Health', description: 'Take or select a picture of your healthy meal.' }
    ],
    socialCreator: [
      { name: 'Posting to Instagram', pointTotal: 5, category: 'Social', description: 'Take or select a screenshot of your Instagram post.' },
      { name: 'Posting to Twitter', pointTotal: 5, category: 'Social', description: 'Take or select a screenshot of your tweet.' },
      { name: 'Post a YouTube video', pointTotal: 15, category: 'Social', description: 'Take or select a screenshot of your YouTube video.' },
      { name: 'Live streaming on Twitch', pointTotal: 7, category: 'Social', description: 'Take or select a screenshot of your Twitch livestream.' },
      { name: 'Updating LinkedIn profile', pointTotal: 5, category: 'Social', description: 'Take or select a screenshot of your updated LinkedIn profile.' },
      { name: 'Creating a TikTok video', pointTotal: 5, category: 'Social', description: 'Take or select a screenshot of your TikTok video.' },
      { name: 'Posting a reel on Instagram', pointTotal: 5, category: 'Social', description: 'Take or select a screenshot of your Instagram reel.' },
      { name: 'Collaborating', pointTotal: 20, category: 'Social', description: 'Take or select a picture or screenshot showing your collaboration.' }
    ],
    music: [
      { name: 'Finishing a beat', pointTotal: 5, category: 'Music', description: 'Take or select a picture showing the completed beat.' },
      { name: 'Attending/performing at a concert', pointTotal: 25, category: 'Music', description: 'Take or select a picture of the concert.' },
      { name: 'Creating a playlist', pointTotal: 4, category: 'Music', description: 'Take or select a screenshot of your created playlist.' },
      { name: 'Getting any type of placement', pointTotal: 25, category: 'Music', description: 'Take or select a picture showing the placement.' },
      { name: 'Recording', pointTotal: 10, category: 'Music', description: 'Take or select a picture of your recording session.' },
      { name: 'Learning new software of effect', pointTotal: 10, category: 'Music', description: 'Take or select a screenshot showing the software or effect.' },
      { name: 'Music video', pointTotal: 20, category: 'Music', description: 'Take or select a screenshot of your music video.' },
      { name: 'Collaborating', pointTotal: 15, category: 'Music', description: 'Take or select a picture showing your collaboration.' }
    ],
    couples: [
      { name: 'Setting up a date', pointTotal: 25, category: 'Family/Friends/Lovers', description: 'Take or select a picture showing your planned date.' },
      { name: 'Getting partner\'s favorite food', pointTotal: 5, category: 'Family/Friends/Lovers', description: 'Take or select a picture of the food you got for your partner.' },
      { name: 'Cooking a meal for the other', pointTotal: 15, category: 'Family/Friends/Lovers', description: 'Take or select a picture of the meal you cooked.' },
      { name: 'Surprising partner with a gift', pointTotal: 10, category: 'Family/Friends/Lovers', description: 'Take or select a picture of the surprise gift.' },
      { name: 'Planning a weekend getaway', pointTotal: 30, category: 'Family/Friends/Lovers', description: 'Take or select a picture of your weekend getaway plan.' },
      { name: 'Creating a shared playlist', pointTotal: 7, category: 'Family/Friends/Lovers', description: 'Take or select a screenshot of your shared playlist.' },
      { name: 'Doing household chores', pointTotal: 10, category: 'Family/Friends/Lovers', description: 'Take or select a picture showing the household chores you did.' },
      { name: 'Getting flowers', pointTotal: 10, category: 'Family/Friends/Lovers', description: 'Take or select a picture of the flowers you got.' },
      { name: 'Setting up a double date', pointTotal: 30, category: 'Family/Friends/Lovers', description: 'Take or select a picture of your double date plan.' },
      { name: 'Posting significant other on social', pointTotal: 15, category: 'Family/Friends/Lovers', description: 'Take or select a screenshot of your social media post featuring your significant other.' }
    ],
    
    selfCare: [
      { name: 'Skin care', pointTotal: 10, category: 'Self Care', description: 'Take or select a picture of your skin care products.' },
      { name: 'Brushing your teeth at night', pointTotal: 5, category: 'Self Care', description: 'Take or select a picture of your toothbrush.' },
      { name: 'Reading a book', pointTotal: 8, category: 'Self Care', description: 'Take or select a picture of the book you are reading.' },
      { name: 'Journaling', pointTotal: 7, category: 'Self Care', description: 'Take or select a picture of your journal entry.' },
      { name: 'Finishing daily affirmations', pointTotal: 5, category: 'Self Care', description: 'Take or select a picture of your completed daily affirmations.' },
      { name: 'Meeting up with a friend', pointTotal: 10, category: 'Self Care', description: 'Take or select a picture of your meetup.' },
      { name: 'Going shopping', pointTotal: 5, category: 'Self Care', description: 'Take or select a picture of your shopping trip.' },
      { name: 'Spa day', pointTotal: 25, category: 'Self Care', description: 'Take or select a picture of your spa day.' },
      { name: 'Detox', pointTotal: 10, category: 'Self Care', description: 'Take or select a picture of your detox regimen.' }
    ],
    goodHabits: [
      { name: 'Making your bed', pointTotal: 2, category: 'Self Care', description: 'Take or select a picture of your made bed.' },
      { name: 'Waking up early', pointTotal: 5, category: 'Self Care', description: 'Take or select a picture showing the early morning.' },
      { name: 'Avoiding procrastination', pointTotal: 7, category: 'Self Care', description: 'Take or select a screenshot of your to-do list with tasks completed on time.' },
      { name: 'Maintaining a to-do list', pointTotal: 3, category: 'Self Care', description: 'Take or select a picture of your to-do list.' },
      { name: 'Not using your phone at work', pointTotal: 5, category: 'Self Care', description: 'Take or select a picture of your workspace free of distractions.' },
      { name: 'Washing bed sheets and towels', pointTotal: 4, category: 'Self Care', description: 'Take or select a picture of your clean sheets and towels.' },
      { name: 'Preparing for next day', pointTotal: 5, category: 'Self Care', description: 'Take or select a picture showing your preparation for the next day.' },
      { name: 'Getting out of bed early', pointTotal: 3, category: 'Self Care', description: 'Take or select a picture showing the early morning.' }
    ],
    schoolAndStudy: [
      { name: 'Completing homework on time', pointTotal: 7, category: 'School', description: 'Take or select a picture of your completed homework.' },
      { name: 'Attending all classes for a day', pointTotal: 10, category: 'School', description: 'Take or select a picture of your class schedule.' },
      { name: 'Starting a project early', pointTotal: 8, category: 'School', description: 'Take or select a picture of your early project start.' },
      { name: 'Tutoring a classmate', pointTotal: 7, category: 'School', description: 'Take or select a picture of your tutoring session.' },
      { name: 'Getting a good grade on an assignment', pointTotal: 10, category: 'School', description: 'Take or select a picture of your graded assignment.' },
      { name: 'Visiting office hours', pointTotal: 6, category: 'School', description: 'Take or select a picture of the meeting invitation or time scheduled.' },
      { name: 'Studying after class', pointTotal: 15, category: 'School', description: 'Take or select a picture of your study area.' },
      { name: 'Creating a study guide and sharing', pointTotal: 25, category: 'School', description: 'Take or select a screenshot of your shared study guide.' }
    ],
    fashion: [
      { name: 'Take an outfit picture', pointTotal: 5, category: 'Fashion', description: 'Take or select a picture of your outfit.' },
      { name: 'Find a cool outfit in public', pointTotal: 8, category: 'Fashion', description: 'Take or select a picture of a cool outfit you find in public.' },
      { name: 'Go thrifting', pointTotal: 10, category: 'Fashion', description: 'Take or select a picture of your thrifting adventure.' },
      { name: 'Buy an expensive piece', pointTotal: 15, category: 'Fashion', description: 'Take or select a picture of your new expensive piece.' },
      { name: 'Make/design own clothes', pointTotal: 20, category: 'Fashion', description: 'Take or select a picture of your homemade clothes.' },
      { name: 'Accessorize an outfit', pointTotal: 7, category: 'Fashion', description: 'Take or select a picture of your accessorized outfit.' },
      { name: 'Try a new fashion trend', pointTotal: 10, category: 'Fashion', description: 'Take or select a picture of you trying a new fashion trend.' },
      { name: 'Organize your wardrobe', pointTotal: 12, category: 'Fashion', description: 'Take or select a picture of your organized wardrobe.' },
      { name: 'Upcycle an old clothing item', pointTotal: 15, category: 'Fashion', description: 'Take or select a picture of your upcycled clothing item.' },
      { name: 'Participate in a fashion show', pointTotal: 25, category: 'Fashion', description: 'Take or select a picture from the fashion show.' },
    ]
    
  };
  

  const handleSwitchChange = (name, value) => {
    setSwitches(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateGroup = async () => {
    console.log('handleCreateGroup function called');
    const auth = firebase_Auth;
    const currentUser = auth.currentUser;

    const isTemplateSelected = Object.values(switches).some(v => v);
    if (!isTemplateSelected) {
      Alert.alert("Template not selected", "You must select at least one template");
      return;
    }

    if (groupName.length > 10) {
      Alert.alert("Invalid Group Name", "Group name should not be more than 10 characters");
      return;
    }
  
    if (currentUser) {
      const db = getFirestore();
      const groupsCollection = collection(db, "Groups");

      const groupNameQuery = query(groupsCollection, where("groupName", "==", groupName));
      const groupNameSnapshot = await getDocs(groupNameQuery);
      if (!groupNameSnapshot.empty) {
        Alert.alert("Group Name Exists", "Please choose a unique group name");
        return;
      }

    setIsLoading(true); // start loading
  
      try {
        // Add the current user's uid to the 'members' array
        const groupDocRef = await addDoc(groupsCollection, {
          groupName: groupName,
          members: [currentUser.uid], // Convert 'members' to an array
        });
  
        // Create 'Goals' subcollection for the group
        const goalsCollectionRef = collection(groupDocRef, "Goals");
  
        // For each category, if it's activated, create the corresponding goals
        for (let [category, isActivated] of Object.entries(switches)) {
          if (isActivated) {
            for (let goal of categoryGoals[category]) {
              // Create a new document in the 'Goals' subcollection
              const goalDocRef = await addDoc(goalsCollectionRef, {
                ...goal,
              
              });
  
              // Update 'Goals' document with groupCode (first four characters of the goal's ID)
              await updateDoc(goalDocRef, {
                goalCode: goalDocRef.id.substring(0, 4),
              });
  
             
            }
          }
        }
  
        // Add the group information under the user's Groups subcollection
        const userGroupDocRef = doc(db, "Users", currentUser.uid, "Groups", groupDocRef.id);
        await setDoc(userGroupDocRef, {
          groupName: groupName,
          groupCode: groupDocRef.id,
        });
  
        // Create groupWallet for the user when a group gets created
        const walletCollectionRef = collection(db, "Wallets");
        const walletDocRef = doc(walletCollectionRef);
        await setDoc(walletDocRef, {
          total: 0,
          daily: 0,
          weekly: 0,
          monthly: 0,
          groupCode: groupDocRef.id, // This should be the group's ID
          owner: currentUser.uid, // This should be the user's UID
        });
  
        setIsLoading(false); // stop loading
      setGroupCode(groupDocRef.id);
      Alert.alert("Group Created (Screenshot)", `Group Code: ${groupDocRef.id.substring(0, 4)}`);
      } catch (error) {
        console.error("Error in creating group: ", error);
        setIsLoading(false);
      }
    } else {
      console.log('No user is signed in.');
    }
  };
  
  

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Create Group</Text>
        <TouchableOpacity onPress={() => console.log('Information icon pressed')}>
          <Ionicons name="information-circle-outline" size={24} color="#1DA1F2" style={styles.icon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.header}>Name the Group</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setGroupName(text)}
        value={groupName}
        placeholder="Enter group name..."
      />

      <Text style={styles.subtitle}>What do you want to incentivize?</Text>

      <View style={styles.switchContainer}>
  {Object.entries(switches).map(([key, value]) => (
    <View style={styles.switchRow} key={key}>
      <TouchableOpacity onPress={() => console.log(`Information icon for ${key} pressed`)}>
        <Ionicons name="information-circle-outline" size={20} color="#1DA1F2" style={styles.icon} />
      </TouchableOpacity>
      <Switch
        onValueChange={(val) => handleSwitchChange(key, val)}
        value={value}
      />
      <Text style={styles.switchLabel}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</Text>
    </View>
  ))}
</View>


<TouchableOpacity 
      style={styles.button} 
      onPress={handleCreateGroup}
      disabled={isLoading} // disable button during loading
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Text style={styles.buttonText}>Create</Text>
      )}
    </TouchableOpacity>

      {groupCode && 
        <View style={styles.groupCodeContainer}>
          <Text style={styles.groupCodeText}>Group Code: {groupCode.substring(0, 4)}</Text>
        </View>
      }
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1DA1F2',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#14171A',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1DA1F2',
    marginLeft: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  groupCodeContainer: {
    flex: 1,
    marginTop: 20,
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
  },
  groupCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    marginVertical: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#14171A',
  },
  icon: {
    marginRight: 5,
  },
});

export default CreateGroup;
