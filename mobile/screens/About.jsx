import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const skills = {
  'Web3': ['Solana', 'Rust', 'Anchor', 'Web3.js'],
  Frontend: ['React', 'Next.js', 'React Native', 'TypeScript'],
  Backend: ['Python', 'Django', 'Node.js', 'Express'],
  Database: ['PostgreSQL', 'MongoDB', 'Redis'],
  DevOps: ['Docker', 'AWS', 'Vercel', 'CI/CD'],
};

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>$ cat bio.txt</Text>
        <View style={styles.terminal}>
          <Text style={styles.text}>
            I'm Paul Madu, a fullstack developer passionate about building 
            elegant solutions to complex problems. With expertise spanning 
            from pixel-perfect frontends to scalable backend architectures, 
            I thrive in the intersection of design and engineering.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>$ ls -R ./skills</Text>
        {Object.entries(skills).map(([category, items]) => (
          <View key={category} style={styles.skillCategory}>
            <Text style={styles.categoryTitle}>📁 {category}</Text>
            <View style={styles.skillItems}>
              {items.map((skill) => (
                <View key={skill} style={styles.skillItem}>
                  <Text style={styles.bullet}>▸</Text>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>$ git log --oneline</Text>
        <Timeline />
      </View>
    </ScrollView>
  );
}

function Timeline() {
  const events = [
    { year: '2024', title: 'Senior Fullstack Developer', company: 'Tech Innovations' },
    { year: '2022', title: 'Fullstack Developer', company: 'StartUp Dynamics' },
    { year: '2020', title: 'Computer Science Degree', company: 'University' },
  ];

  return (
    <View style={styles.timeline}>
      {events.map((event, index) => (
        <View key={index} style={styles.timelineItem}>
          <View style={styles.timelineMarker}>
            <Text style={styles.timelineYear}>{event.year}</Text>
          </View>
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTitle}>{event.title}</Text>
            <Text style={styles.timelineCompany}>{event.company}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'monospace',
    fontSize: 18,
    color: '#00f0ff',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  terminal: {
    backgroundColor: '#0c0c0c',
    padding: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#00f0ff',
  },
  text: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#e0e0e0',
    lineHeight: 22,
  },
  skillCategory: {
    backgroundColor: '#0f1419',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00f0ff',
    padding: 15,
    marginBottom: 15,
  },
  categoryTitle: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#00ff9f',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  skillItems: {
    marginLeft: 10,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bullet: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#00f0ff',
    marginRight: 10,
  },
  skillText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#e0e0e0',
  },
  timeline: {
    marginTop: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineMarker: {
    backgroundColor: '#0f1419',
    borderWidth: 1,
    borderColor: '#00f0ff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 15,
    height: 32,
  },
  timelineYear: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#00f0ff',
    fontWeight: 'bold',
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#0f1419',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00f0ff',
    padding: 15,
  },
  timelineTitle: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#00ff9f',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  timelineCompany: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#a0a0a0',
  },
});
