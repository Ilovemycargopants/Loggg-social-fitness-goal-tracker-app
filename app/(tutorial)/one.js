import { ScrollView, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, SIZES, FONT } from '../../constants';
import React from 'react';

const One = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>How does LOGGG work?</Text>
      <Text style={styles.description}>LOGGG is an innovative, collaborative goal-setting application that revolutionizes the way you and your group stay motivated and accountable.</Text>
      <Text style={styles.subtitle}>Example Groups:</Text>

      <Text style={styles.groupTitle}>Fitness Friends</Text>
      <Text style={styles.groupDescription}>Imagine you and your friends have a shared commitment to enhancing your fitness. With LOGGG, you can create a "Fitness Friends" group and establish various fitness goals, each with a corresponding point total.</Text>
      <Text style={styles.groupExample}>- Going to the gym could be 10 points</Text>
      <Text style={styles.groupExample}>- Running a 5K could be 20 points</Text>
      <Text style={styles.groupExample}>- Consuming a balanced meal might be 5 points</Text>

      <Text style={styles.groupTitle}>Content Creators</Text>
      <Text style={styles.groupDescription}>In your "Content Creators" group, you could assign points as follows:</Text>
      <Text style={styles.groupExample}>- Publishing a blog post could be 15 points</Text>
      <Text style={styles.groupExample}>- Completing a script draft could be 20 points</Text>
      <Text style={styles.groupExample}>- Filming a YouTube video might be 25 points</Text>

      <Text style={styles.groupTitle}>Sports Players</Text>
      <Text style={styles.groupDescription}>In your "Sports Players" group, point allocations could be:</Text>
      <Text style={styles.groupExample}>- Attending a training session could be 10 points</Text>
      <Text style={styles.groupExample}>- Improving your personal best time or score could be 15 points</Text>
      <Text style={styles.groupExample}>- Participating in a competitive event might be 20 points</Text>

      <Text style={styles.groupTitle}>Study Teams</Text>
      <Text style={styles.groupDescription}>For your "Study Teams" group, designate points for various study goals:</Text>
      <Text style={styles.groupExample}>- Completing a chapter could be 10 points</Text>
      <Text style={styles.groupExample}>- Submitting an assignment on time could be 20 points</Text>
      <Text style={styles.groupExample}>- Scoring well in a test might be 30 points</Text>

      <Text style={styles.groupTitle}>Movie Club</Text>
      <Text style={styles.groupDescription}>In your "Movie Club" group, point allocations could be:</Text>
      <Text style={styles.groupExample}>- Watching a classic film could be 5 points</Text>
      <Text style={styles.groupExample}>- Writing a movie review could be 15 points</Text>
      <Text style={styles.groupExample}>- Hosting a movie night could be 20 points</Text>

      <Text style={styles.conclusion}>By creating this competitive yet friendly environment, LOGGG reinvents how we approach shared and personal goals. It's not just about achieving objectives; it's about the fun, camaraderie, and mutual support along the way.</Text>
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
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 10,
  },
  groupDescription: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 10,
  },
  groupExample: {
    fontSize: 14,
    color: COLORS.white,
    marginLeft: 10,
    marginBottom: 10,
  },
  conclusion: {
    fontSize: 16,
    color: COLORS.white,
    marginTop: 20,
  },
});

export default One;
