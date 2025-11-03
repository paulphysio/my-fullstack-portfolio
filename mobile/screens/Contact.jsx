import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

export default function ContactScreen() {
  const contacts = [
    { label: 'Email', value: 'paul@example.com', url: 'mailto:paul@example.com' },
    { label: 'GitHub', value: 'github.com/paulphysio', url: 'https://github.com/paulphysio' },
    { label: 'LinkedIn', value: 'linkedin.com/in/paulmadu', url: 'https://linkedin.com/in/paulmadu' },
    { label: 'X', value: '@phsiodev_1', url: 'https://x.com/phsiodev_1' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>$ ./contact.sh</Text>
        <Text style={styles.subtitle}>Let's connect and build something great</Text>
      </View>

      <View style={styles.terminal}>
        <Text style={styles.terminalTitle}>Connect With Me</Text>
        {contacts.map((contact, index) => (
          <TouchableOpacity
            key={index}
            style={styles.contactItem}
            onPress={() => Linking.openURL(contact.url)}
          >
            <Text style={styles.contactLabel}>{contact.label}:</Text>
            <Text style={styles.contactValue}>{contact.value}</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.note}>
        <Text style={styles.noteText}>
          Open to freelance opportunities, collaborations, and interesting projects.
          Feel free to reach out!
        </Text>
      </View>
    </ScrollView>
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
  },
  headerText: {
    fontFamily: 'monospace',
    fontSize: 20,
    color: '#00f0ff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#a0a0a0',
  },
  terminal: {
    backgroundColor: '#0c0c0c',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#00f0ff',
    padding: 20,
    marginBottom: 20,
  },
  terminalTitle: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#00ff9f',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 240, 255, 0.2)',
  },
  contactLabel: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#707070',
    width: 80,
  },
  contactValue: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#00f0ff',
    flex: 1,
  },
  arrow: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#00ff9f',
  },
  note: {
    backgroundColor: 'rgba(0, 240, 255, 0.05)',
    borderLeftWidth: 3,
    borderLeftColor: '#00f0ff',
    padding: 15,
    borderRadius: 4,
  },
  noteText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#a0a0a0',
    lineHeight: 22,
  },
});
