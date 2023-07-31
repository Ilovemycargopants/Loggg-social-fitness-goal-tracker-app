import { ScrollView, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, SIZES, FONT } from '../../constants';
import React from 'react';

const Two = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>What is a group?</Text>
      <Text style={styles.description}>In the world of LOGGG, a group is more than just a collection of individuals—it's a synergy of people committed to common goals.</Text>
      
      <Text style={styles.subtitle}>Creating a Group</Text>
      <Text style={styles.groupDescription}>When you create a group on LOGGG, you'll receive a unique group code. Anyone who uses this code to 'Join Group' becomes an automatic member of your collective.</Text>
      
      <Text style={styles.subtitle}>Purpose of a Group</Text>
      <Text style={styles.groupDescription}>Whether you're a band of friends aiming to read more books or a company team committed to productivity improvements, your group is your tribe, your support, and your cheerleading squad all rolled into one.</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
  },
  groupDescription: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 10,
  },
});

export default Two;
