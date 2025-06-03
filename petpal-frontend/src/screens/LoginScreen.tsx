import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import PrimaryButton from "../components/PrimaryButton";
import { useLoginUserMutation } from '../services/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';


type FormData = {
  email: string;
  password: string;
};

const LoginScreen = () => {
  const navigation = useNavigation();

  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await loginUser(data).unwrap();
  
      // Save token to AsyncStorage
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
  
      // Update Redux
      dispatch(setCredentials({ user: response.user, token: response.token }));
  
      // Navigate to main screen
      navigation.navigate('Home'); // Replace with your actual route
    } catch (err: any) {
      console.error('Login failed:', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#0c1d1a" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Log in to PetPal</Text>

        {/* Email */}
        <View style={styles.inputWrapper}>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#45a193"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}
        </View>

        {/* Password */}
        <View style={styles.inputWrapper}>
          <Controller
            control={control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#45a193"
                secureTextEntry
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}
        </View>
      </View>

      {/* Bottom */}

      <View>
        <View style={styles.buttonWrapper}>
          <PrimaryButton title="Login" onPress={handleSubmit(onSubmit)} />
        </View>
        <Text style={styles.disclaimer}>
          By continuing, you agree to our Terms of Service to learn how we
          collect, use and share your data
        </Text>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.signUpText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fcfb",
    justifyContent: "space-between",
    paddingTop: 50,
  },
  header: {
    height: 48,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0c1d1a",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  inputWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    backgroundColor: "#e6f4f2",
    color: "#0c1d1a",
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    paddingLeft: 4,
    marginTop: 4,
  },
  disclaimer: {
    color: "#45a193",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  signUpButton: {
    paddingHorizontal: 16,
    paddingTop: 10,
    marginBottom: 30,
  },
  signUpText: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 14,
    color: "#0c1d1a",
  },
  buttonWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
});
