import { ScrollView, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, SIZES, FONT } from '../../constants';
import React from 'react';

const Three = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>What are goals?</Text>
      <Text style={styles.description}>Goals are the heart and soul of LOGGG. They are customized objectives that you and your group set up, each assigned a specific point value.</Text>
      
      <Text style={styles.subtitle}>Creating Goals</Text>
      <Text style={styles.groupDescription}>As the administrator of a group, you have the power to create custom goals for your collective. These goals, whether they're tied to physical fitness, nutrition, professional development, or personal growth, serve as benchmarks for group members to strive for and achieve.</Text>

      <Text style={styles.subtitle}>Assigning Points to Goals</Text>
      <Text style={styles.groupDescription}>Each goal is assigned a specific point value. This point value can be decided based on the difficulty or significance of the goal. For example, if your group is keen on improving eating habits, you might set a 'Healthy Breakfast' goal worth 5 points.</Text>
      
      <Text style={styles.subtitle}>Earning Points</Text>
      <Text style={styles.groupDescription}>Every time you start your day with a nutritious meal, you can use that goal, make a post, and earn points! Goals serve as both motivational targets and the currency of accomplishment, turning your everyday actions into a rewarding game.</Text>
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

export default Three;
