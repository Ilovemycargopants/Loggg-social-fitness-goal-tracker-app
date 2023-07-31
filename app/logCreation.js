



import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SectionList, TextInput, Switch, Alert,Image,ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { firebase_Auth, db,storage } from '../fireBaseconfig'
import { addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { blob, ref, uploadString, getDownloadURL,uploadBytesResumable,imageRef } from "firebase/storage";





const Achievement = ({ title, point, onPress, isSelected }) => (
  <TouchableOpacity onPress={onPress} style={[styles.achievement, isSelected && styles.achievementSelected]}>
    <Text style={styles.achievementTitle}>{title}</Text>
    <Text style={styles.achievementPoint}>{point}</Text>
  </TouchableOpacity>
);

const Item = ({ title, point, achievements, onSelect, isSelected }) => {
  const [selectedAchievements, setSelectedAchievements] = useState([]);

  // Update total points when selected achievements change
  useEffect(() => {
    const totalAchievementPoints = selectedAchievements.reduce((total, curr) => total + curr.point, 0);
    onSelect({ title, point, achievements: selectedAchievements, totalPoints: point + totalAchievementPoints });
  }, [selectedAchievements]);

  // Update total points when item selection state changes
  useEffect(() => {
    if (isSelected) {
      onSelect({ title, point, achievements: selectedAchievements, totalPoints: point });
    }
  }, [isSelected]);
  return (
    <TouchableOpacity onPress={() => !isSelected && onSelect({ title, point, achievements: selectedAchievements })}>
      <View style={[styles.item, isSelected && styles.itemSelected]}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Ionicons
            name={isSelected ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="blue"
          />
        </View>
        <View style={styles.pointContainer}>
          <Text style={styles.pointText}>{point}</Text>
        </View>
      </View>
      {isSelected && (
        <View style={styles.achievementsContainer}>
          {achievements.map(achievement => {
            const isSelected = selectedAchievements.some(a => a.title === achievement.title);
            const onPress = () => {
              setSelectedAchievements(prev =>
                isSelected
                  ? prev.filter(a => a.title !== achievement.title)
                  : [...prev, achievement]
              );
            };

            return (
              <Achievement
                key={achievement.title}
                title={achievement.title}
                point={achievement.point}
                onPress={onPress}
                isSelected={isSelected}
              />
            );
          })}
        </View>
      )}
    </TouchableOpacity>
  );
};

const LogCreation = ({}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [giantText, setGiantText] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [achievementsOnly, setAchievementsOnly] = useState(false);
  const [data, setData] = useState([]);
  const auth = firebase_Auth;
  const [userData, setUserData] = useState({});
  const [selectedAchievements, setSelectedAchievements] = useState([]);
  const [image, setImage] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  


  

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

  useEffect(() => {
    if (!userData || !userData.selectedGroup) {
      return;
    }

    const fetchData = async () => {
      const goalsCollection = collection(db, 'Groups', userData.selectedGroup, 'Goals');

      const goalSnapshot = await getDocs(goalsCollection);
      let categories = {};

      for (const goalDoc of goalSnapshot.docs) {
        const goalData = goalDoc.data();
        const achievementsCollection = collection(goalDoc.ref, 'Achievements');

        const achievements = [];
        const achievementSnapshot = await getDocs(achievementsCollection);
        for (const achievementDoc of achievementSnapshot.docs) {
          const achievementData = achievementDoc.data();
          achievements.push({
            title: achievementData.name,
            point: achievementData.pointTotal,
          });
        }

        const goal = {
          title: goalData.name,
          point: goalData.pointTotal,
          achievements: achievements,
        };

        if (!categories[goalData.category]) {
          categories[goalData.category] = [];
        }

        categories[goalData.category].push(goal);
      }

      const data = Object.keys(categories).map(category => ({
        title: category,
        data: categories[category],
      }));

      setData(data);
    };

    fetchData();
  }, [userData]);
  console.log('userData:', userData);
  console.log('data:', data);

  const filteredData = searchTerm
  ? data.map(section => ({
      ...section,
      data: section.data.filter(item => item.title && item.title.toLowerCase().startsWith(searchTerm.toLowerCase())),
    })).filter(section => section.data.length > 0)
  : data;

  const handleSelectItem = ({ title, point, achievements, totalPoints }) => {
  
    const selectedItem = selectedAchievements.length > 0 ? selectedAchievements[selectedAchievements.length - 1].title : title;
    setSelectedItem(selectedItem);
    setTotalPoints(achievementsOnly ? totalPoints - point : totalPoints);
  };
  const deleteImage = () => {
    setImage(null);  // Setting image state to null
  };


   
  const takePhoto = async () => {
    // Request the permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
    } else {
      let options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      };

      ImagePicker.launchCameraAsync(options)
        .then(response => {
          if (response.canceled) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else {
            const uri = response.assets[0].uri; // change to response.assets[0].uri
            setImage(uri); // you can set your state or do whatever you want with the uri here
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
};

const selectPhotoFromLibrary = async () => {
    // Request the permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
    else {
      const options = {
        quality: 0.5,
        base64: true,
        allowsEditing: true,
      };
      ImagePicker.launchImageLibraryAsync(options)
        .then(response => {
          if (response.canceled) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else {
            if(response.assets && response.assets.length > 0){
              const { uri } = response.assets[0];
              setImage(uri);  // Setting the photo state here
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
};
  
const handleSubmit = async () => {
  try {
    setLoading(true);
    
    if (!selectedItem) {
      alert('Please select a goal before submitting');
      return;
    }

    const now = new Date();
    let picture = '';  // Initialized to an empty string

    if (image) {
      let response = await fetch(image);
      let blob = await response.blob();

      const userId = auth.currentUser.uid;

      let imageRef = ref(storage, `images/${userId}/${now}`);
      
      let uploadTask = uploadBytesResumable(imageRef, blob);

      await new Promise((resolve, reject) => {
        uploadTask.on('state_changed', 
          (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          }, 
          (error) => {
            console.error("Error uploading image: ", error);
            reject(error);
          }, 
          async () => {
            picture = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File available at', picture);
            resolve();
          }
        );
      });
    }

    const categoryTitle = filteredData.find(d => d.data.some(item => item.title === selectedItem)).title;

    await addDoc(collection(db, 'Logs'), {
      user: {
        id: auth.currentUser.uid,
        name: userData.name,
        pfp: userData.pfp
      },
      groupId: userData.selectedGroup,
      date: now,
      goal: {
        name: selectedItem,
        pointTotal: totalPoints,
        category: categoryTitle
      },
      votes: {
        thumbsUp: 0,
        thumbsDown: 0,
        voters: [],
      },
      cleared: false,
      text: giantText,
      picture: picture, // Attach picture URL to document (could be '' if no photo was taken)
      video: '', 
      URL: '',
    });

    alert('Log successfully created!');
    setSelectedItem(null);
    setTotalPoints(0);
    setSearchTerm('');
    setGiantText('');
    setLinkText('');
    setShowLinkInput(false);
    setImage(null);
  } catch (e) {
    console.error("Error adding log: ", e);
  }
  finally{
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Log Creation</Text>
        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
  {loading ? (
    <ActivityIndicator size="small" color="green" />
  ) : (
    <Ionicons name="checkmark" size={24} color="green" />
  )}
</TouchableOpacity>
      </View>
      <TextInput
        style={styles.giantInput}
        placeholder="Enter text..."
        placeholderTextColor='#000000'
        onChangeText={(text) => setGiantText(text)}
        value={giantText}
        returnKeyType="done"
        textAlignVertical="top"
      />
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={takePhoto}>
          <Ionicons name="camera-outline" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={selectPhotoFromLibrary}>
          <Ionicons name="images-outline" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowLinkInput(!showLinkInput)}>
          <Ionicons name="link-outline" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
          <TouchableOpacity onPress={deleteImage}>
            <Text>Remove Photo</Text>
          </TouchableOpacity>
        </View>
      )}

      {showLinkInput && (
        <TextInput
          style={styles.input}
          onChangeText={(text) => setLinkText(text)}
          value={linkText}
          placeholder="Enter link..."
          placeholderTextColor='#000000'
        />
      )}
      <TextInput
        style={styles.input}
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
        placeholder="Search..."
        placeholderTextColor='#000000'
      />
      <View style={styles.switchContainer}>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={achievementsOnly ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={setAchievementsOnly}
          value={achievementsOnly}
        />
        <Text style={styles.switchText}>Achievements Only?</Text>
      </View>
      {selectedItem && (
        <View style={styles.totalPointsContainer}>
          <Text style={styles.totalPointsText}>
            Total Points: <Text style={{ fontWeight: 'bold' }}>{totalPoints}</Text>
          </Text>
        </View>
      )}
      <SectionList
        sections={filteredData}
        keyExtractor={(item, index) => item.title + index}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
        renderItem={({ item }) => (
          <Item
            title={item.title}
            point={item.point}
            achievements={item.achievements}
            onSelect={handleSelectItem}
            isSelected={selectedItem === item.title}
          />
        )}
      />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginVertical: 4,
    borderRadius: 10,
  },
  itemSelected: {
    backgroundColor: 'blue',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  pointContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  pointText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
  },
  achievementsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginTop: 10,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 20,
  },
  giantInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 20,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  achievement: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
  },
  achievementSelected: {
    backgroundColor: '#cccccc',
  },
  achievementTitle: {
    fontSize: 14,
    color: 'black',
  },
  achievementPoint: {
    fontSize: 12,
    color: 'gray',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchText: {
    marginLeft: 10,
    fontSize: 16,
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: 'blue',
    height: 100,
    width: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default LogCreation;



