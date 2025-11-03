import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

import HomeScreen from './screens/Home';
import ProjectsScreen from './screens/Projects';
import AboutScreen from './screens/About';
import ContactScreen from './screens/Contact';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0f1419',
            borderBottomColor: '#00f0ff',
            borderBottomWidth: 2,
          },
          headerTintColor: '#00f0ff',
          headerTitleStyle: {
            fontFamily: 'monospace',
            fontWeight: 'bold',
          },
          cardStyle: {
            backgroundColor: '#0a0e27',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: '[PM] Portfolio' }}
        />
        <Stack.Screen 
          name="Projects" 
          component={ProjectsScreen}
          options={{ title: '$ ls ./projects' }}
        />
        <Stack.Screen 
          name="About" 
          component={AboutScreen}
          options={{ title: '$ cat about.txt' }}
        />
        <Stack.Screen 
          name="Contact" 
          component={ContactScreen}
          options={{ title: '$ ./contact.sh' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const DarkTheme = {
  dark: true,
  colors: {
    primary: '#00f0ff',
    background: '#0a0e27',
    card: '#0f1419',
    text: '#e0e0e0',
    border: '#00f0ff',
    notification: '#00ff9f',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
});
