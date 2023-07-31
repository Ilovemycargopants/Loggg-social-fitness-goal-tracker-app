import { ScrollView, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, SIZES, FONT } from '../../constants';
import React from 'react';

const Five = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>How do points work?</Text>
      <Text style={styles.description}>Points are the scorecard of your success on LOGGG. With each approved goal, you accumulate points that measure your progress and dedication.</Text>
      
      <Text style={styles.subtitle}>Friendly Competition</Text>
      <Text style={styles.groupDescription}>You can compare your points with your group members on a daily, weekly, or monthly basis, adding a friendly competitive edge to your collective efforts.</Text>

      <Text style={styles.subtitle}>Currency and Rewards</Text>
      <Text style={styles.groupDescription}>Beyond being a mere score, points can also serve as a group currency, introducing countless possibilities for rewards and incentives. You might exchange points for rewards, or the person with the highest points at the end of the month might earn a special privilege or prize.</Text>
      
      <Text style={styles.subtitle}>Future Expansions</Text>
      <Text style={styles.groupDescription}>In the future, we're planning to expand the role of points even further. For example, you might be able to spend your points in a group shop that you create, or send your points to another member of your group. Stay tuned for these exciting developments!</Text>
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

export default Five;
