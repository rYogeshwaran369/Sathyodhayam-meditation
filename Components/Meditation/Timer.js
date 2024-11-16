import React, { Component } from 'react'
import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { Audio } from 'expo-av'

class Timer extends Component {
  constructor(props) {
    super(props)
    
    const durationInMinutes = this.props.duration || 1
    const songUrl = this.props.songUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    this.state = {
      duration: durationInMinutes * 60,
      timeLeft: durationInMinutes * 60,
      isPaused: false,
      orientation: this.getOrientation(),
    }

    this.timerRef = null
    this.sound = null
    this.songUrl = songUrl
    this.orientationSubscription = null
  }

  async componentDidMount() {
    await this.loadAudio()
    this.startTimer()
    this.orientationSubscription = Dimensions.addEventListener('change', this.handleOrientationChange)
  }

  componentWillUnmount() {
    clearInterval(this.timerRef)
    this.unloadAudio()
    if (this.orientationSubscription) {
      this.orientationSubscription.remove()
    }
  }

  getOrientation = () => {
    const { width, height } = Dimensions.get('window')
    return width > height ? 'landscape' : 'portrait'
  }

  handleOrientationChange = () => {
    this.setState({ orientation: this.getOrientation() })
  }

  loadAudio = async () => {
    if (this.songUrl) {
      this.sound = new Audio.Sound()
      try {
        await this.sound.loadAsync({ uri: this.songUrl })
        await this.playAudio()
      } catch (error) {
        console.error('Error loading audio:', error)
      }
    }
  }

  playAudio = async () => {
    if (this.sound && !this.state.isPaused) {
      await this.sound.playAsync()
    }
  }

  pauseAudio = async () => {
    if (this.sound) {
      await this.sound.pauseAsync()
    }
  }

  unloadAudio = async () => {
    if (this.sound) {
      await this.sound.unloadAsync()
    }
  }

  startTimer = () => {
    if (this.timerRef) clearInterval(this.timerRef)

    this.timerRef = setInterval(() => {
      if (!this.state.isPaused && this.state.timeLeft > 0) {
        this.setState((prevState) => ({
          timeLeft: prevState.timeLeft - 1
        }))
      } else if (this.state.timeLeft <= 0) {
        clearInterval(this.timerRef)
        this.unloadAudio()
      }
    }, 1000)
  }

  togglePause = () => {
    this.setState(
      (prevState) => ({ isPaused: !prevState.isPaused }),
      () => {
        if (this.state.isPaused) {
          this.pauseAudio()
          clearInterval(this.timerRef)
        } else {
          this.playAudio()
          this.startTimer()
        }
      }
    )
  }

  formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  render() {
    const { duration, timeLeft, isPaused, orientation } = this.state

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <TouchableOpacity onPress={this.togglePause}>
              <CountdownCircleTimer
                isPlaying={!isPaused}
                duration={duration}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[duration / 2, duration / 3, duration / 4, 0]}
                size={orientation === 'portrait' ? 250 : 180}
                strokeWidth={orientation === 'portrait' ? 5 : 4}
              >
                {() => (
                  <Image
                    source={{
                      uri: 'https://i.ytimg.com/vi/7VgpX29JiXs/maxresdefault.jpg',
                    }}
                    style={styles.image}
                  />
                )}
              </CountdownCircleTimer>
            </TouchableOpacity>

            <View style={styles.timerText}>
              <Text style={styles.timeText}>{this.formatTime(timeLeft)}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%',
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  image: {
    width: '80%',
    height: '80%',
    borderRadius: 100,
    alignSelf: 'center',
  },
  timerText: {
    marginTop: 20,
  },
  timeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
})

export default Timer
