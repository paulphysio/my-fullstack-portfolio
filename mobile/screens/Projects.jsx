import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const projects = [
  {
    title: 'E-Commerce Platform',
    tech: ['Next.js', 'Django', 'PostgreSQL'],
    status: 'live',
  },
  {
    title: 'Task Management App',
    tech: ['React', 'Node.js', 'MongoDB'],
    status: 'live',
  },
  {
    title: 'AI Content Generator',
    tech: ['Next.js', 'Python', 'OpenAI'],
    status: 'live',
  },
];

export default function ProjectsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {`$ ls -la ./projects\ntotal ${projects.length}`}
        </Text>
      </View>

      {projects.map((project, index) => (
        <ProjectCard key={index} project={project} />
      ))}
    </ScrollView>
  );
}

function ProjectCard({ project }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{project.title}</Text>
        <View style={[styles.badge, styles[`badge_${project.status}`]]}>
          <Text style={styles.badgeText}>{project.status}</Text>
        </View>
      </View>

      <View style={styles.techStack}>
        {project.tech.map((tech, i) => (
          <View key={i} style={styles.techTag}>
            <Text style={styles.techText}>{tech}</Text>
          </View>
        ))}
      </View>

      <View style={styles.terminal}>
        <Text style={styles.terminalText}>
          ✓ Build successful{'\n'}
          → Status: {project.status}{'\n'}
          ✓ Ready to deploy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#0f1419',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00f0ff',
  },
  headerText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#00ff9f',
  },
  card: {
    backgroundColor: '#0f1419',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#00f0ff',
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontFamily: 'monospace',
    fontSize: 18,
    color: '#00f0ff',
    fontWeight: 'bold',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  badge_live: {
    backgroundColor: 'rgba(0, 255, 159, 0.1)',
    borderColor: '#00ff9f',
  },
  badgeText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#00ff9f',
    textTransform: 'uppercase',
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  techTag: {
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00f0ff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  techText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#00f0ff',
  },
  terminal: {
    backgroundColor: '#0c0c0c',
    padding: 15,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#00f0ff',
  },
  terminalText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#00ff9f',
    lineHeight: 18,
  },
});
