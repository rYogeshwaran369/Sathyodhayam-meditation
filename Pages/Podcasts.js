import React, { Component } from "react";
import { 
  View, Text, StyleSheet, ScrollView, Dimensions, Alert 
} from "react-native";
import Slider from "../Components/Slider";
import Menubar from "../Components/Menubar";
import Headings from "../Components/Headings";
import Podcastcard from "../Components/Podcastcard";
import { Voicedatalist } from "../Data/Voicedata";

class Podcasts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get("window").width,
      screenHeight: Dimensions.get("window").height,
      isLandscape: Dimensions.get("window").width > Dimensions.get("window").height,
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

  // Function to group data into pairs
  chunkData = (data) => {
    const chunkedData = [];
    for (let i = 0; i < data.length; i += 2) {
      chunkedData.push(data.slice(i, i + 2)); // Grouping items into pairs
    }
    return chunkedData;
  };

  render() {
    const chunkedVoicedata = this.chunkData(Voicedatalist._j); // Chunked data to display two items per row
    console.log(chunkedVoicedata)
    return (
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Image */}
        <Menubar />
        <Slider />

        {/* Podcasts Heading */}
        <Headings subtitle="Podcasts of" title="Master Sri Ji" />

        {/* Mapping through chunked data to render pairs */}
        <View style={styles.list}>
         {chunkedVoicedata.map((chunk, index) => (
            <View key={index} style={styles.row}>
              {chunk.map((voiceItem) => (
                <Podcastcard
                  key={voiceItem.id}
                  imageUrl={voiceItem.imageUri}
                  title={voiceItem.title}
                  description={voiceItem.description}
                  duration={voiceItem.duration}
                  webViewUrl={voiceItem.webViewUrl}
                />
              ))}
            </View> 
          ))} 
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingBottom: 20,
    backgroundColor: 'white',
    marginTop: 10, // Reduced gap between the Menubar and Slider
  },
  row: {
    flexDirection: 'row', // Arrange children (Podcastcards) in a row
    justifyContent: 'space-evenly', // Even space between cards in the row
    marginBottom: 15, // Optional: space between rows
    flexWrap: 'wrap', // Allow wrapping to the next line if necessary
    width: '100%', // Ensure the row takes up the full width
  },
  list: {
    paddingBottom: 20,
  },
});

export default Podcasts;
