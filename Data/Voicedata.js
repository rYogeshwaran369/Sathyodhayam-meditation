import { firestore } from "../Backend/Firebase"; // Assuming Firebase is properly initialized

const fetchVoicedata = async () => {
  try {
    const snapshot = await firestore.collection('podcasts').get();
    const Voicedatalist = snapshot.docs.map((doc) => ({
      id: doc.id,
      webViewUrl: doc.data().webViewUrl || '',  // Assuming Firestore document contains this field
      imageUri: doc.data().imageUri || '',      // Assuming Firestore document contains this field
      description: doc.data().description || '', // Assuming Firestore document contains this field
    }));

    return Voicedatalist; // Returning data in the form of Voicedatalist
  } catch (error) {
    console.error('Error fetching voicedata:', error);
    return []; // Return empty array in case of an error
  }
};

// Export the function for external usage
export const Voicedatalist = fetchVoicedata();

export default fetchVoicedata;
