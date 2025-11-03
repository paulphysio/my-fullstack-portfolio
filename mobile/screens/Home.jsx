import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import TerminalText from '../components/TerminalText';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.asciiArt}>
{`██████╗ ███╗   ███╗
██╔══██╗████╗ ████║
██████╔╝██╔████╔██║
██╔═══╝ ██║╚██╔╝██║
██║     ██║ ╚═╝ ██║
╚═╝     ╚═╝     ╚═╝`}
        </Text>
        
        <View style={styles.tagline}>
          <TerminalText 
            text={[
              '> Paul Madu',
              '> Web3 & Fullstack Developer',
              '> Solana • Rust • React • Next.js',
            ]}
          />
        </View>
      </View>

      <View style={styles.menu}>
        <MenuItem 
          title="Projects" 
          icon=">" 
          onPress={() => navigation.navigate('Projects')}
        />
        <MenuItem 
          title="About" 
          icon=">" 
          onPress={() => navigation.navigate('About')}
        />
        <MenuItem 
          title="Contact" 
          icon=">" 
          onPress={() => navigation.navigate('Contact')}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Terminal theme portfolio app
        </Text>
        <Text style={styles.footerText}>
          Built with React Native & Expo
        </Text>
      </View>
    </ScrollView>
  );
}

function MenuItem({ title, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuArrow}>→</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  hero: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#00f0ff',
    marginBottom: 20,
  },
  asciiArt: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#00f0ff',
    lineHeight: 20,
    marginBottom: 20,
  },
  tagline: {
    width: '100%',
  },
  menu: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f1419',
    padding: 20,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#00f0ff',
  },
  menuIcon: {
    fontFamily: 'monospace',
    fontSize: 20,
    color: '#00ff9f',
    marginRight: 15,
  },
  menuTitle: {
    fontFamily: 'monospace',
    fontSize: 18,
    color: '#e0e0e0',
    flex: 1,
  },
  menuArrow: {
    fontFamily: 'monospace',
    fontSize: 20,
    color: '#00f0ff',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#707070',
    marginBottom: 5,
  },
});
