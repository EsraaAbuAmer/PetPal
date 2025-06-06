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
import { useRegisterUserMutation } from '../services/authApi';

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUpScreen = () => {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();

  const onSubmit = async (data: FormData) => {
    try {
      const { name, email, password } = data;
      const response = await registerUser({ name, email, password }).unwrap();  
      // Optionally: Navigate to login or auto-login
      navigation.navigate('Login');
    } catch (err: any) {
      console.error('Registration error:', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top: Back & Title */}
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#0c1d1a" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Create your account</Text>

        {/* Name */}
        <View style={styles.inputWrapper}>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Full name is required" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#45a193"
                style={styles.input}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}
        </View>

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
                placeholder="Email"
                placeholderTextColor="#45a193"
                style={styles.input}
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
                placeholder="Password"
                placeholderTextColor="#45a193"
                style={styles.input}
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

        {/* Confirm Password */}
        <View style={styles.inputWrapper}>
          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#45a193"
                style={styles.input}
                secureTextEntry
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>
              {errors.confirmPassword.message}
            </Text>
          )}
        </View>
      </View>

      {/* Bottom */}
      <View>
        <View style={styles.buttonWrapper}>
          <PrimaryButton title="Sign Up" onPress={handleSubmit(onSubmit)} />
        </View>

        <Text style={styles.disclaimer}>
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </Text>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.signUpText}>Already have an account? Log in</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </View>
    </View>
  );
};

export default SignUpScreen;

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
