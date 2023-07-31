import { ScrollView, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, SIZES, FONT } from '../../constants';
import React from 'react';

const Four = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>What are logs?</Text>
      <Text style={styles.description}>Logs are the evidence of your achievements, the tangible proof that you've reached a goal in LOGGG.</Text>
      
      <Text style={styles.subtitle}>Creating a Log</Text>
      <Text style={styles.groupDescription}>When you complete a goal, you create a log post and send it to your group. This could be a snapshot of your morning run, a screenshot of your completed project, or any other evidence that validates your claim.</Text>

      <Text style={styles.subtitle}>Validation and Points</Text>
      <Text style={styles.groupDescription}>Your peers in the group then vote on whether you've indeed fulfilled the objective. If the majority vote is 'yes', your log is cleared, and you receive the points attached to that goal. It's a system that fosters both transparency and communal validation.</Text>
      
      <Text style={styles.subtitle}>Community Spirit</Text>
      <Text style={styles.groupDescription}>With logs, LOGGG adds an element of communal judgment to individual effort, fostering a supportive and motivated group environment. It's not just about individual triumphs, but also about cheering on each other's victories.</Text>
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

export default Four;
