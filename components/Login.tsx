import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Platform, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

// Google Configuration
export const googleConfig = {
  iosClientId: "proess.env.iosClientId", // Replace with your actual iOS client ID
  androidClientId: "process.env.androidClientId", // Replace with your actual Android client ID
  webClientId: "process.env.webCliuentId", // Replace with your actual Web client ID
  scopes: ["profile", "email"],
};

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: Platform.select({
      ios: googleConfig.iosClientId,
      android: googleConfig.androidClientId,
      default: googleConfig.webClientId,
    }),
    scopes: googleConfig.scopes,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;

      console.log("Authentication successful:", authentication);

      fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: {
          Authorization: `Bearer ${authentication.accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((userInfo) => {
          console.log("Google User Info:", userInfo);
          Alert.alert("Login Successful", `Welcome ${userInfo.name || userInfo.email}!`);
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });
    } else if (response?.type === "error") {
      console.error("Authentication error:", response.error);
    }
  }, [response]);

  const handleLogin = () => {
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Login with Google"
        onPress={() => promptAsync()}
        disabled={!request}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});

export default Login;
