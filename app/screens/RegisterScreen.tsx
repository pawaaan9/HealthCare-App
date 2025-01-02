import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFormValidation } from '../hooks/useFormValidation';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const { errors, isValid } = useFormValidation(formData);
  const router = useRouter();

  const handleRegister = async () => {
    if (!isValid) {
      const firstError = Object.values(errors)[0];
      alert(firstError);
      return;
    }

    try {
      await AsyncStorage.setItem('user', JSON.stringify(formData));
      console.log('Registration data saved:', formData);
      router.push('/');
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderInput = (
    field: keyof typeof formData,
    placeholder: string,
    options: {
      secureTextEntry?: boolean;
      keyboardType?: 'default' | 'numeric' | 'email-address';
      autoCapitalize?: 'none' | 'sentences';
    } = {}
  ) => (
    <View style={{ marginBottom: 15 }}>
      <TextInput
        style={[
          {
            backgroundColor: 'white',
            width: '100%',
            padding: 15,
            borderRadius: 10,
            fontSize: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
          },
          errors[field] ? { borderWidth: 1, borderColor: '#ff6b6b' } : null
        ]}
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(value) => updateFormData(field, value)}
        {...options}
      />
      {errors[field] && (
        <Text style={{ color: '#ff6b6b', fontSize: 12, marginTop: 5, marginLeft: 5 }}>
          {errors[field]}
        </Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#f5f5f5' }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, paddingTop: 40 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 30, textAlign: 'center' }}>
          Create Account
        </Text>
        
        <View style={{ width: '100%', maxWidth: 400, alignSelf: 'center' }}>
          {renderInput('name', 'Full Name')}
          {renderInput('email', 'Email', { keyboardType: 'email-address', autoCapitalize: 'none' })}
          {renderInput('username', 'Username', { autoCapitalize: 'none' })}
          {renderInput('password', 'Password', { secureTextEntry: true })}
          {renderInput('confirmPassword', 'Confirm Password', { secureTextEntry: true })}

          <TouchableOpacity 
            style={[
              {
                backgroundColor: isValid ? '#008080' : '#cccccc',
                padding: 15,
                borderRadius: 10,
                alignItems: 'center',
                marginTop: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 3,
              }
            ]}
            onPress={handleRegister}
            disabled={!isValid}
          >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              Register
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ padding: 15, alignItems: 'center', marginTop: 10 }}
            onPress={() => router.back()}
          >
            <Text style={{ color: '#008080', fontSize: 16 }}>
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}