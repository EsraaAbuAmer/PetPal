import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { useNavigation } from '@react-navigation/native';
import LoginScreen from './LoginScreen';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Pet care made simple',
    subtitle: 'Get the best pet insurance and all your pet needs in one place.',
    image: 'https://cdn.usegalileo.ai/sdxl10/b97b3ccc-cb41-402f-bf7b-360e1d6a765e.png',
  },
  {
    title: 'Track vet visits',
    subtitle: 'Never miss an appointment again.',
    image: 'https://cdn.usegalileo.ai/sdxl10/b97b3ccc-cb41-402f-bf7b-360e1d6a765e.png',
  },
  {
    title: 'Find pet services nearby',
    subtitle: 'Locate vets, parks, and groomers around you.',
    image: 'https://cdn.usegalileo.ai/sdxl10/b97b3ccc-cb41-402f-bf7b-360e1d6a765e.png',
  },
  {
    title: 'Connect with other pet owners',
    subtitle: 'Join a friendly community of pet lovers.',
    image: 'https://cdn.usegalileo.ai/sdxl10/b97b3ccc-cb41-402f-bf7b-360e1d6a765e.png',
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [pageIndex, setPageIndex] = useState(0);

  const handleGetStarted = () => navigation.navigate('Login');

  return (
    <View style={styles.container}>

      {/* Swipable Pager */}
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setPageIndex(e.nativeEvent.position)}
      >
        {onboardingData.map((item, index) => (
          <View key={index} style={styles.page}>
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.image}
              imageStyle={{ borderRadius: 20 }}
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        ))}
      </PagerView>

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {onboardingData.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, pageIndex === i ? styles.dotActive : null]}
          />
        ))}
      </View>

      {/* Button */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>
            Get Started
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 20 }} />
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fcfb',
    paddingTop: 50,
  },
  pagerView: {
    flex: 1,
  },
  page: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  skip: {
    position: 'absolute',
    right: 20,
    top: 50,
    zIndex: 10,
  },
  skipText: {
    color: '#0c1d1a',
    fontWeight: '500',
    fontSize: 16,
  },
  image: {
    height: 320,
    width: width - 32,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0c1d1a',
    textAlign: 'left',
    width: '100%',
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#0c1d1a',
    textAlign: 'left',
    width: '100%',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cdeae5',
  },
  dotActive: {
    backgroundColor: '#00d1b2',
  },
  buttonWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  button: {
    backgroundColor: '#00d1b2',
    borderRadius: 999,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#0c1d1a',
    fontWeight: '700',
    fontSize: 16,
  },
});