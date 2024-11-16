import { firestore } from "../Backend/Firebase"; // Assuming Firebase is properly initialized

const fetchVoicedata = async () => {
  try {
    const snapshot = await firestore.collection('jabam').get();
    const Newsdata = snapshot.docs.map((doc) => ({
      id: doc.id,
      imageUri: doc.data().imageUrl || '',  // Assuming Firestore document contains this field
      songUrl: doc.data().songUrl || '',    // Assuming Firestore document contains this field
      times: doc.data().times || '0',       // Default value for times if not found
      count: doc.data().count || 0,         // Default value for count if not found
      title: doc.data().title || '', 
    }));

    return Newsdata; // Returning data in the form of Newsdata
  } catch (error) {
    console.error('Error fetching voicedata:', error);
    return []; // Return empty array in case of an error
  }
};

// Export the function for external usage
export const Jabamdata = fetchVoicedata();

export default fetchVoicedata;
