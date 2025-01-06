import React, { useState } from "react";
import { View, SafeAreaView, TextInput, StyleSheet, Text, TouchableOpacity } from "react-native";
import { API_URL } from "@/constants/Api";
import useSWRMutation from "swr/mutation"; // Keep this import

interface Cafe {
  title: string;
  location: string;
  price: string;
  hours: string;
}

export default function AddCafeScreen() {
  const [title, setTitle] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [hours, setHours] = useState<string>("");

  // SWR Mutation Hook
  const { trigger, isMutating } = useSWRMutation(
    `${API_URL}/cafes`,
    async (url, { arg }: { arg: Cafe }) => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arg), // Send the "arg" (newCafe) object in the body
      });

      if (!response.ok) {
        throw new Error("Failed to add cafe");
      }
      return response.json(); // Return response
    }
  );

  const newCafe = { title, location, price, hours };
  console.log(newCafe); // Log the data to see if it's correct
  

  // Handle form submission
  const handleSubmit = async () => {
    const newCafe = {
      title,
      location,
      price,
      hours,
    };

    try {
      // Pass newCafe directly without wrapping it in an object
      await trigger(newCafe);  // No need for `{ arg: newCafe }`
      alert("Cafe added successfully!");
    } catch (error) {
      alert("Failed to add cafe. Please try again.");
      console.error("Error adding cafe:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Add a New Cafe</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cafe Title</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Location</Text>
          <TextInput style={styles.input} value={location} onChangeText={setLocation} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price Range</Text>
          <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="E.g: €1-10" placeholderTextColor="#7B7878" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Opening Hours</Text>
          <TextInput
            style={[styles.input, styles.hoursInput]}
            value={hours}
            onChangeText={setHours}
            placeholder="E.g Mon - Tue: closed, Wed: 10am - 6pm"
            placeholderTextColor="#7B7878"
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isMutating}>
          <Text style={styles.buttonText}>{isMutating ? "Adding cafe..." : "Add cafe"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#BA977E",
    flex: 1,
  },
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
    padding: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingLeft: 10,
  },
  hoursInput: {
    height: 150,
  },
  button: {
    width: "45%",
    height: 45,
    backgroundColor: "#5D3023",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});