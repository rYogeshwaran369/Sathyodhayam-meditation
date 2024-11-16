import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import RNPickerSelect from 'react-native-picker-select'; // Importing the select dropdown component
import Menubar from '../../../Components/Menubar';
import { addDoc,collection } from 'firebase/firestore';
import { firestore } from '../../../Backend/Firebase';
const Auserdetails = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    userType: '',
    gender: '',
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.mobile || !formData.address || !formData.userType || !formData.gender) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    try {
        const docRef = await addDoc(collection(firestore, 'users'), formData); // Save to "users" collection
        Alert.alert('Success', `Form submitted successfully!\n Document ID: ${docRef.id}`);
        setFormData({
          name: '',
          email: '',
          mobile: '',
          address: '',
          userType: '',
          gender: '',
        }); // Clear form
      } catch (error) {
        console.error('Error adding document: ', error);
        Alert.alert('Error', 'Failed to submit form. Please try again.');
      }
    
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Menubar/>
      <View style={styles.formSection}>

        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={formData.name}
          onChangeText={(value) => handleInputChange('name', value)}
        />

        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={formData.email}
          keyboardType="email-address"
          onChangeText={(value) => handleInputChange('email', value)}
        />

        <Text style={styles.label}>Mobile:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your mobile number"
          value={formData.mobile}
          keyboardType="phone-pad"
          onChangeText={(value) => handleInputChange('mobile', value)}
        />

        <Text style={styles.label}>Address:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your address"
          value={formData.address}
          onChangeText={(value) => handleInputChange('address', value)}
        />

        <Text style={styles.label}>User Type:</Text>
        <RNPickerSelect
          onValueChange={(value) => handleInputChange('userType', value)}
          value={formData.userType}
          items={[
            { label: 'Instructor', value: 'Instructor' },
            { label: 'Meditator', value: 'Meditator' },
          ]}
          style={pickerSelectStyles}
          placeholder={{
            label: 'Select User Type',
            value: null,
          }}
        />

        <Text style={styles.label}>Gender:</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[styles.radioButton, formData.gender === 'Male' && styles.radioSelected]}
            onPress={() => handleInputChange('gender', 'Male')}
          >
            <Text style={styles.radioText}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radioButton, formData.gender === 'Female' && styles.radioSelected]}
            onPress={() => handleInputChange('gender', 'Female')}
          >
            <Text style={styles.radioText}>Female</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radioButton, formData.gender === 'Other' && styles.radioSelected]}
            onPress={() => handleInputChange('gender', 'Other')}
          >
            <Text style={styles.radioText}>Other</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  inputAndroid: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
});

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        // alignItems: "center",
        justifyContent: "flex-start",
        padding: 10,
        backgroundColor:'white',
        marginTop: 10, // Reduced gap between the Menubar and Slider
      },
  formSection: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
    width: '100%',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  radioSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  radioText: {
    color: '#333',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Auserdetails;
