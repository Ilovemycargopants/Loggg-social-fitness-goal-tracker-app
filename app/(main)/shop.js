import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SectionList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, doc, collection, getDoc, getDocs, onSnapshot } from "firebase/firestore";
import { firebase_Auth, db } from '../../fireBaseconfig';

const Achievement = ({ title, point, description }) => {
  return (
    <View style={styles.achievement}>
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => {
          Alert.alert(
            "Achievement Information",
            `Description: ${description}`
          );
        }}>
        <Ionicons name="information-circle" size={20} color="blue" />
      </TouchableOpacity>
      <Text style={styles.achievementTitle}>{title}</Text>
      <Text style={styles.achievementPoint}>{point}</Text>
    </View>
  );
};

const Item = ({ title, point, achievements, description, groupCode }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <TouchableOpacity onPress={toggleExpand}>
      <View style={styles.item}>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => {
            Alert.alert(
              "Goal Information",
              `Description: ${description}\n\nGoal Code: ${groupCode}`
            );
          }}>
          <Ionicons name="information-circle" size={20} color="blue" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.pointBox}>
          <Text style={styles.points}>{point}</Text>
        </View>
      </View>
      {isExpanded && (
        <View style={styles.achievementsContainer}>
          {achievements.map((achievement, index) => (
            <Achievement key={index} title={achievement.title} point={achievement.point} description={achievement.description} />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const Shop = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const auth = firebase_Auth;
  const [userData, setUserData] = useState({});

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
    if (!userData.selectedGroup) {
      return;
    }

    const fetchData = async () => {
      const goalsCollection = collection(db, 'Groups', userData.selectedGroup, 'Goals');

      onSnapshot(goalsCollection, async (goalSnapshot) => {
        let categories = {};

        for (const goalDoc of goalSnapshot.docs) {
          const goalData = goalDoc.data();
          const achievementsCollection = collection(goalDoc.ref, 'Achievements');

          const achievements = [];
          await onSnapshot(achievementsCollection, (achievementSnapshot) => {
            for (const achievementDoc of achievementSnapshot.docs) {
              const achievementData = achievementDoc.data();
              achievements.push({
                title: achievementData.name,
                point: achievementData.pointTotal,
                description: achievementData.description, 
              });
            }
          });

          const goal = {
            title: goalData.name,
            point: goalData.pointTotal,
            description: goalData.description,
            groupCode: goalData.goalCode,
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
      });
    };

    fetchData();
  }, [userData.selectedGroup]);

  const renderItem = ({ item }) => (
    <Item title={item.title} point={item.point} achievements={item.achievements} description={item.description} groupCode={item.groupCode} />
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <TouchableOpacity style={styles.addButton} onPress={handleGoalCreation}>
        <Ionicons name="add-circle" size={30} color="green" />
      </TouchableOpacity>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const handleGoalCreation = () => {
    // Handle navigation to 'goalCreation' screen
    router.push('/goalCreation');
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={data}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item, index) => item.title + index}
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
    position: 'relative', // Ensure the container is positioned relative
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align items from the start
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    marginLeft: 10, // Add marginLeft to create space between the info box and title
  },
  pointBox: {
    height: 40,
    width: 40,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 'auto', // Align the point box to the rightmost side
  },
  points: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
  achievementsContainer: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 4, // Reduce the paddingVertical value
    paddingHorizontal: 3, // Reduce the paddingHorizontal value
    marginTop: 2,
    borderRadius: 4,
  },
  achievement: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 4,
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 14,
  },
  achievementPoint: {
    fontSize: 12,
    color: 'gray',
  },
  sectionHeader: {
    backgroundColor: '#36393e',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row', // Add flexDirection to align items horizontally
    justifyContent: 'space-between', // Add justifyContent to align items at the ends
    alignItems: 'center', // Add alignItems to vertically center items
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    marginRight: 10, // Add marginRight to create space between the header text and button
  },
  infoButton: {
    marginRight: 10,
  },
});

export default Shop;
