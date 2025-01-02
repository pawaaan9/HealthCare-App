import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  
  // Use useRef to maintain animated values across renders
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (username === user.username && password === user.password) {
          // Animate out before navigation
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
              toValue: -50,
              tension: 20,
              friction: 7,
              useNativeDriver: true,
            }),
          ]).start(() => {
            router.push(`/home?username=${username}`);
          });
        } else {
          alert('Invalid username or password');
        }
      } else {
        alert('No registered user found');
      }
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      alert('An error occurred while logging in');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#f5f5f5' }}
    >
      <Animated.View 
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 50 }}>
          <Text style={{ fontSize: 35, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>HealthMate</Text>
          <Text style={{ fontSize: 18, color: '#666', marginBottom: 30 }}>Your Partner in Health</Text>
        </View>

        <View style={{ width: '100%', maxWidth: 300 }}>
          <TextInput
            style={{
              backgroundColor: 'white',
              width: '100%',
              padding: 15,
              borderRadius: 10,
              fontSize: 16,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
            placeholder="Enter Username"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={{
              backgroundColor: 'white',
              width: '100%',
              padding: 15,
              borderRadius: 10,
              fontSize: 16,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
            placeholder="Enter Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry
          />
          
          <TouchableOpacity 
            style={{
              backgroundColor: '#008080',
              padding: 15,
              borderRadius: 10,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: 3,
            }}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Login</Text>
          </TouchableOpacity>

          <Text style={{ color: '#666', marginTop: 20 }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/screens/RegisterScreen')}>
            <Text style={{ color: '#008080', fontWeight: 'bold', textDecorationLine: 'underline' }}>Sign up now</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}