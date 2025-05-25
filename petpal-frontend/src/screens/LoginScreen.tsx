import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login Screen (Coming soon)</Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fcfb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#0c1d1a',
    fontSize: 18,
    fontWeight: '500',
  },
});