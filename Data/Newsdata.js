import { firestore } from "../Backend/Firebase"; // Assuming Firebase is properly initialized

const fetchVoicedata = async () => {
  try {
    const snapshot = await firestore.collection('newsfeed').get();
    const Newsdata = snapshot.docs.map((doc) => ({
      id: doc.id,
      date: doc.data().date || '',  // Assuming Firestore document contains this field
      imageUri: doc.data().imageUri || '',      // Assuming Firestore document contains this field
      description: doc.data().description || '',
      title:doc.data().title||'', // Assuming Firestore document contains this field
    }));

    return Newsdata; // Returning data in the form of Newsdata
  } catch (error) {
    console.error('Error fetching voicedata:', error);
    return []; // Return empty array in case of an error
  }
};

// Export the function for external usage
export const Newsdata = fetchVoicedata();

export default fetchVoicedata;
