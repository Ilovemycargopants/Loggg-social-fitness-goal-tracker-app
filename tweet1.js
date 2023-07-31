import React, {setState} from 'react';
import { View, StyleSheet, Image, Text,TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Tweet = ({ user, datePosted, content, upVotes, downVotes, comments, shares, pointTotal, category,goalTitle,handleVote,id,image }) => {
  console.log(user.profilePic);
  const profilePic = user.profilePic ;
  return (
    <View style={styles.tweetContainer}>
      <View style={styles.headerContainer}>
        
        <View style={styles.headerText}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.datePosted}>{datePosted}</Text>
        </View>
        <View style={styles.pointTotalContainer}>
          <Text style={styles.pointTotal}>{pointTotal}</Text>
        </View>
      </View>
      <Text style={styles.category}>{category}</Text>
      <Text style={styles.goalTitle}>{goalTitle}</Text> 
      <Text style={styles.content}>{content}</Text>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />} 
      <View style={styles.footerContainer}>
      <View style={styles.iconWithText}>
      <TouchableOpacity>
        <Ionicons name="thumbs-up-outline" size={24} color="black" onPress={() => handleVote(id, 'up')} />
      </TouchableOpacity>
      <Text>{upVotes}</Text>
    </View>
    <View style={styles.iconWithText}>
      <TouchableOpacity>
        <Ionicons name="thumbs-down-outline" size={24} color="black" onPress={() => handleVote(id, 'down')} />
      </TouchableOpacity>
      <Text>{downVotes}</Text>
    </View>
        <View style={styles.iconWithText}>
          <TouchableOpacity>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#000" />
          </TouchableOpacity>
          <Text>{comments}</Text>
        </View>
        <View style={styles.iconWithText}>
          <TouchableOpacity>
            <Ionicons name="share-social-outline" size={20} color="#000" />
          </TouchableOpacity>
          <Text>{shares}</Text>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  tweetContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  goalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#384160',
    borderRadius: 20,
    padding: 10,
    
    alignItems: 'center',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderColor: '#000',
    borderWidth: 1,
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexDirection: 'column', // Updated: Align text in a column
    justifyContent: 'flex-start', // Updated: Align text to the start
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#ffffff',
  },
  datePosted: {
    fontSize: 12,
    color: '#ffffff',
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    backgroundColor: '#384160',
    borderRadius: 20,
    padding: 10,
  },
    
iconWithText: {
  flexDirection: 'row',
  alignItems: 'center',
},
pointTotalContainer: {
  backgroundColor: '#EEE',
  borderRadius: 5,
  padding: 5,
  position: 'absolute',
  right: 10,
  top: 10,
},
category: {
  fontSize: 14,
  fontStyle: 'italic',
  marginBottom: 5,
},
});
export default Tweet;