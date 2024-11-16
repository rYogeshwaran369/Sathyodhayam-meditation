import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, LogBox } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './Router/AppStack';
import ErrorBoundary from './Router/Errorboundry';

// Suppress specific warnings
LogBox.ignoreLogs([
  'TypeError: _reactNative.Dimensions.removeEventListener is not a function'
]);

// Main App component
export default function App() {
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    console.log('App has mounted');

    // Unlock screen orientation
    console.log('Unlocking screen orientation');
    ScreenOrientation.unlockAsync();

    // Handle screen dimension change
    const handleOrientationChange = () => {
      console.log('Screen orientation changed');
      setScreenDimensions(Dimensions.get('window'));
    };
    const subscription = Dimensions.addEventListener('change', handleOrientationChange);
    console.log('Orientation change listener added');

    // Clean up listeners on unmount
    return () => {
      console.log('Cleaning up listeners');
      subscription.remove();  // Clean up orientation listener
    };
  }, []);

  return (
    <ErrorBoundary>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
