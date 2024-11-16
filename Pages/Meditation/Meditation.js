import React, { Component } from "react";
import { 
  View, Text, StyleSheet, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, Alert, Modal 
} from "react-native";
import Slider from "../../Components/Slider";
import Menubar from "../../Components/Menubar";
import Headings from "../../Components/Headings";
import MeditationOptions from "../../Components/Meditation/Meditationoptions";
import { firestore } from "../../Backend/Firebase";
import DMeditationOptions from "../../Components/Meditation/DMeditation";

class Meditation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get("window").width,
      screenHeight: Dimensions.get("window").height,
      isLandscape: Dimensions.get("window").width > Dimensions.get("window").height,
      email: "",
      isDurationModalVisible: false,
      isDataModalVisible: false,
      selectedDuration: null,
      selectedTitle: null,
      selectedSongUrl: null,
      dhiyanamData: null,
    };
  }

  componentDidMount() {
    const handleDimensionsChange = () => {
      const { width, height } = Dimensions.get("window");
      this.setState({
        screenWidth: width,
        screenHeight: height,
        isLandscape: width > height,
      });
    };

    // Attach event listener for dimension changes
    this.subscription = Dimensions.addEventListener("change", handleDimensionsChange);
  }

  componentWillUnmount() {
    // Cleanup the listener when the component is unmounted
    if (this.subscription) {
      this.subscription.remove();
    }
  }

  handleDurationSelect = (duration) => {
    this.setState({ selectedDuration: duration, isDurationModalVisible: false });
    // Simulate fetching data based on selected duration
    this.fetchDhiyanamData(duration);
  };

  fetchDhiyanamData = async (count) => {
    try {
      // Query the Firestore collection 'dhiyanam' where the 'count' field matches the selected count
      const snapshot = await firestore.collection('dhiyanam').where('count', '==', count).get();
  
      // Check if there are any documents matching the query
      if (!snapshot.empty) {
        // Map over the documents and extract the relevant fields
        const Newsdata = snapshot.docs.map((doc) => ({
          id: doc.id,
          date: doc.data().date || '',
          songUrl: doc.data().songUrl || '',
          count: doc.data().count || '',
          title: doc.data().title || '',
        }));
  
        // Set the data and show the modal with the fetched data
        this.setState({ 
          dhiyanamData: Newsdata,
          isDataModalVisible: true 
        });
      } else {
        // If no documents found for the given count
        this.setState({
          dhiyanamData: 'No data available for the selected count.',
          isDataModalVisible: true,
        });
      }
    } catch (error) {
      console.error('Error fetching dhiyanam data:', error);
      this.setState({
        dhiyanamData: 'Error fetching data. Please try again later.',
        isDataModalVisible: true,
      });
    }
  };

  handleStartMeditation = (data) => {
    const { title, songUrl, count } = data;
    if (title && songUrl && count) {
      this.props.navigation.navigate('Meditationtimer', {
        title,
        songUrl,
        duration: count,
      });
    } else {
      Alert.alert('Error', 'Please select a valid meditation duration.');
    }
  };

  render() {
    const { screenWidth, screenHeight, isLandscape, isDurationModalVisible, isDataModalVisible, dhiyanamData } = this.state;

    return (
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Image */}
        <Menubar />
        <Slider />

        {/* News Feeds */}
        <Headings subtitle="Join with" title="Master Sri Ji" />
        <TouchableOpacity onPress={() => this.setState({ isDurationModalVisible: true })}>
        <DMeditationOptions
          imageUri="https://img.freepik.com/free-vector/female-doing-yoga-meditation-mandala-background_1017-38763.jpg?t=st=1731771268~exp=1731774868~hmac=5e6adc369dd4f42d5be6fd07cc7bb2349f7a90b1ab2a36335a4f0daf089042c4&w=826"
          title="Dhiyanam"
        />
        </TouchableOpacity>

        <MeditationOptions
          imageUri="https://img.freepik.com/premium-vector/international-yoga-day-vector-illustration-june-21_723055-598.jpg?w=826"
          title="Thirayadhiyanam"
          navigation={this.props.navigation}
          target={'Meditator'}
        />
        <MeditationOptions
          imageUri="https://img.freepik.com/free-vector/international-yoga-day-particle-style-woman-doing-lotus-asana_1017-52611.jpg?t=st=1731542691~exp=1731546291~hmac=84437566af5249ce6e31759ec56f488ea42ce0db4367c15000327ad470463d67&w=1380"
          title="Jabam"
          navigation={this.props.navigation}
          target={'Jabam'}
        />

        {/* Duration Modal */}
        <Modal
          visible={isDurationModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => this.setState({ isDurationModalVisible: false })}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Duration</Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => this.handleDurationSelect(9)}>
                <Text style={styles.modalButtonText}>9 Minutes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => this.handleDurationSelect(13)}>
                <Text style={styles.modalButtonText}>13 Minutes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => this.handleDurationSelect(19)}>
                <Text style={styles.modalButtonText}>19 Minutes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Data Modal */}
       {/* Data Modal */}
<Modal
  visible={isDataModalVisible}
  transparent={true}
  animationType="fade"
  onRequestClose={() => this.setState({ isDataModalVisible: false })}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Dhiyanam Data</Text>
      {dhiyanamData === 'No data available for the selected count.' || dhiyanamData === 'Error fetching data. Please try again later.' ? (
        <Text style={styles.modalData}>{dhiyanamData}</Text>
      ) : (
        Array.isArray(dhiyanamData) && dhiyanamData.length > 0 ? (
          dhiyanamData.map((data, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.modalButton} 
              onPress={() => this.handleStartMeditation(data)}>
              <Text style={styles.modalButtonText}>{data.title} - {data.count} minutes</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.modalData}>No meditation data found for the selected duration.</Text>
        )
      )}
      <TouchableOpacity 
            style={styles.modalButton} 
            onPress={() => this.setState({ isDataModalVisible: false })}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 20,
    backgroundColor: 'white',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#10357E",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalData: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },
});

export default Meditation;
