import { ScrollView, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, SIZES, FONT } from '../../constants';
import React from 'react';

const About = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>The LOGGG Story</Text>
      
      <Text style={styles.header}>The Spark</Text>
      <Text style={styles.description}>You know how it goes. We all have that list of things we mean to do... someday. But "someday" kept moving, and I realized I needed a change.</Text>

      <Text style={styles.header}>Back to Basics</Text>
      <Text style={styles.paragraph}>Think back to high school sports. Remember the energy? The camaraderie? That's what I was missing. The team spirit, the collective goal, the motivation we gave each other. That was the key.</Text>

      <Text style={styles.header}>A Simple Idea</Text>
      <Text style={styles.paragraph}>My friends and I, we had goals. Get fitter, be more active on socials, spend more time together. So, why not make it fun? Why not make it a game? And so, the point system was born. It was about turning self-improvement into a team sport.</Text>

      <Text style={styles.header}>Making It Real</Text>
      <Text style={styles.paragraph}>We started with a mix of different apps, but it was messy. We needed a single place to track our progress. That's when LOGGG became more than a concept - it turned into an app.</Text>

      <Text style={styles.header}>The LOGGG Revolution</Text>
      <Text style={styles.conclusion}>And you know what? LOGGG made a difference. It got us moving, motivated, and it was fun. We were achieving our personal goals and doing it as a team. LOGGG is more than an app; it's a new way to set, track, and achieve goals together. And it all started with a simple idea - let's turn "someday" into "today".</Text>
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 10,
  },
  conclusion: {
    fontSize: 16,
    color: COLORS.white,
    marginTop: 20,
  },
});

export default About;
