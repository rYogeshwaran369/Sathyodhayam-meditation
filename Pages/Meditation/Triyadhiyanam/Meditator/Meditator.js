import React from 'react'
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import Menubar from '../../../../Components/Menubar'
import { getFirestore, collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore'
import * as Notifications from 'expo-notifications' // Correct module for notifications
import Constants from 'expo-constants' // Import Constants

import { firestore } from '../../../../Backend/Firebase'

class Meditator extends React.Component {
  getPushNotificationToken = async () => {
    try {
      // Request permission for notifications
      const { status } = await Notifications.requestPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Notification permissions are required to send notifications.')
        return null
      }

      // Get the push notification token
      const token = await Notifications.getExpoPushTokenAsync()
      console.log("tokens : ",token)
      return token.data
    } catch (error) {
      console.error('Error getting push notification token:', error)
      Alert.alert('Error', 'Failed to get push notification token.')
      return null
    }
  }

  saveTokenToFirestore = async (userId, token) => {
    try {
      const userDocRef = doc(collection(firestore, 'users'), userId)
      await setDoc(userDocRef, { token }, { merge: true })
      console.log('Token saved to Firestore')
    } catch (error) {
      console.error('Error saving token to Firestore:', error)
    }
  }

  sendNotificationToInstructors = async () => {
    try {
      console.log('Sending notifications to instructors...')
      // Fetch users with usertype 'Instructor'
      const instructorsQuery = query(
        collection(firestore, 'users'),
        where('userType', '==', 'Instructor')
      )

      console.log('Fetching instructor data from Firestore...')
      const instructorsSnapshot = await getDocs(instructorsQuery)

      if (instructorsSnapshot.empty) {
        console.log('No instructors found.')
        Alert.alert('No Instructors Found', 'There are no users with the user type "Instructor".')
        return
      }

      console.log(`${instructorsSnapshot.size} instructors found.`)

      // Iterate through the instructors and send notifications
      const notificationPromises = instructorsSnapshot.docs.map(async (doc) => {
        const instructorData = doc.data()
        console.log(`Sending notification to instructor: ${instructorData.name || 'Unknown'}`)

        if (instructorData.token) {
          // Send notification using Expo Notifications
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Instructor Availability',
              body: 'Are you available?',
            },
            trigger: null, // Immediate notification
          })
        } else {
          console.log('No token found for instructor:', instructorData.name || 'Unknown')

          // Get new token for the instructor if not found
          const token = await this.getPushNotificationToken()
          if (token) {
            // Save the token to Firestore
            await this.saveTokenToFirestore(doc.id, token)
            console.log(`New token generated and saved for instructor: ${instructorData.name || 'Unknown'}`)

            // Send the notification after saving the token
            await Notifications.scheduleNotificationAsync({
              content: {
                title: 'Instructor Availability',
                body: 'Are you available?',
              },
              trigger: null, // Immediate notification
            })
          }
        }
      })

      await Promise.all(notificationPromises)
      console.log('All notifications sent successfully.')
      Alert.alert('Notification Sent', 'Notifications were sent to all instructors.')
    } catch (error) {
      console.error('Error sending notifications:', error)
      Alert.alert('Error', 'Failed to send notifications.')
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Menubar />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.centeredView}>
            <TouchableOpacity style={styles.button} onPress={this.sendNotificationToInstructors}>
              <Text style={styles.buttonText}>Find Instructor</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})

export default Meditator
