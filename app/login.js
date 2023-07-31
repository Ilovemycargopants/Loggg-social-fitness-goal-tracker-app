import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TextInput, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { COLORS, SHADOWS, SIZES, FONT } from '../constants';
import { firebase_Auth} from '../fireBaseconfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [registerLoading, setRegisterLoading] = useState(false);
  
  const auth = firebase_Auth;


  useEffect(() => {
    checkDeviceForHardware();
  }, []);

  const checkDeviceForHardware = async () => {
    let compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      console.log('Current device does not have the necessary hardware to use this API.');
    }
  };

  const signIn = async (silent = false) => {
    if (!email || !password) {
      if (!silent) {
        Alert.alert("Error", "Please enter your email and password");
      }
      return { success: false, error: "Email or password is empty" };
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await SecureStore.setItemAsync('userEmail', email);
      await SecureStore.setItemAsync('userPassword', password);
  
      return { success: true };
    } catch (error) {
      console.error(error);
      if (!silent) {
        switch (error.code) {
          case 'auth/invalid-email':
            Alert.alert('Invalid Email', 'The email address is badly formatted.');
            break;
          case 'auth/user-not-found':
            Alert.alert('No Email Found', 'No email found. Please sign up.');
            break;
          case 'auth/wrong-password':
            Alert.alert('Wrong Password', 'Sorry, the password you entered is incorrect. Try again.');
            break;
          default:
            Alert.alert('Sign in failed');
        }
      }
      return { success: false, error: error.message };
    }
  };
  

  const handleRegister = async () => {
    setRegisterLoading(true);
    router.replace("signUp")
    console.log(process.env);
    setRegisterLoading(false);
  };

  const handleLogin = async (silent = false) => {
    setLoginLoading(true);
    const response = await signIn(silent);
    setLoginLoading(false);
    if (response.success) {
      router.replace("groupSelector");
    } else if (!silent) {
      Alert.alert("Error", response.error);
    }
  };
  
  const handleFaceIDLogin = async () => {
    let result = await LocalAuthentication.authenticateAsync();
    if (result.success) {
      const savedEmail = await SecureStore.getItemAsync('userEmail');
      const savedPassword = await SecureStore.getItemAsync('userPassword');
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        await handleLogin(true); // Pass true to suppress error alerts
      } else {
        console.log('No saved credentials');
      }
    } else {
      console.log('Failed to authenticate, try again.');
    }
  };
  

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>LOGGG</Text>
          <Text style={{ fontSize: 16, textAlign: 'center' }}>Welcome to LOGGG</Text>
        </View>

        <TextInput
  value={email}
  autoCapitalize='none'
  onChangeText={(text) => setEmail(text)}
  placeholder='Email'
  placeholderTextColor='#ffffff'  // add this
  style={{
    width: 300,
    height: 50,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    color: "white"
  }}
/>
<TextInput
  value={password}
  autoCapitalize='none'
  onChangeText={(text) => setPassword(text)}
  placeholder='Password'
  placeholderTextColor='#ffffff'  // add this
  secureTextEntry
  style={{
    width: 300,
    height: 50,
    backgroundColor: COLORS.tertiary,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 10,
    color: "white"
  }}
/>




<View >
  <TouchableOpacity style={{ // Adjusted the marginTop value to remove the black bar
    width: 300,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }}
  onPress={handleLogin} disabled={loginLoading} >
    {loginLoading ? (
      <ActivityIndicator size="small" color="#FFFFFF" />
    ) : (
      <Text style={{ ...FONT.h2, ...SHADOWS.large, color: 'white' }}>Log in</Text>
    )}
  </TouchableOpacity>

  <TouchableOpacity style={{
    width: 300,
    height: 50,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15, // Adjusted the marginTop value
  }}
  onPress={handleRegister} disabled={registerLoading}>
    {registerLoading ? (
      <ActivityIndicator size="small" color="#FFFFFF" />
    ) : (
      <Text style={{ ...FONT.h2, ...SHADOWS.large, color: 'white' }}>Sign up</Text>
    )}
  </TouchableOpacity>
</View>

<TouchableOpacity style={{
        width: 300,
        height: 50,
        backgroundColor: COLORS.secondary,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15, 
      }}
      onPress={handleFaceIDLogin}>
        <Text style={{ ...FONT.h2, ...SHADOWS.large, color: 'white' }}>Sign in with Face ID</Text>
      </TouchableOpacity>

</View>
</SafeAreaView>
);

}

export default login;






