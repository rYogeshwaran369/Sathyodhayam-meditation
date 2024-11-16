import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB1FggMkzL3VU_bsDOQaYVx6j_srXMmjuc",
  authDomain: "sathyodhayam-meditation.firebaseapp.com",
  projectId: "sathyodhayam-meditation",
  storageBucket: "sathyodhayam-meditation.firebasestorage.app",
  messagingSenderId: "716878261733",
  appId: "1:716878261733:web:b28428b9ae9b796946930c",
  measurementId: "G-E59PVNBS27"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth(); // Initialize Firebase Auth
const firestore = firebase.firestore(); // Initialize Firestore

// Function to reset password
const resetPassword = async (email) => {
  try {
    await auth.sendPasswordResetEmail(email); // Use 'auth' object directly for this call
    console.log('Password reset email sent');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error; // Optionally, handle the error UI here
  }
};

export { auth, firestore, resetPassword };
