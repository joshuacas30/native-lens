import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Image, Text, Animated, Dimensions, ImageBackground } from "react-native";
import Identify from "./components/home/Identify";
import History from "./components/home/History";
import TreeLibrary from "./components/home/TreeLibrary";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
 
// this is the home screen
  return (
    <ImageBackground
      source={require("./assets/images/homescreen-background.png")} // Replace with your background image
      style={styles.container}
      resizeMode="cover"
    >
      {/* Header with Image, Darkening Overlay, and Text Overlay */}
      <View style={styles.header}>
        <View >
          <Text style={styles.overlayText}>Native Lens</Text>
          <Text style={styles.overlayTagline}>Identify and Discover Native Trees in the Philippines</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <Identify />
        <History />
        <TreeLibrary />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    gap: 30,
    backgroundColor: "#F4F1E9", // Fallback color if the image fails to load
  },
  header: {
    width: wp("100%"),
    height: 220,
    paddingLeft: 30,
    paddingTop: 30,
  },
  
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "cover",
  },
  darkOverlay: {
    width: "100%",
    height: "100%",
    position: "absolute",
    // backgroundColor: "rgba(5, 3, 0, 0.5)", // Semi-transparent black to darken the image
    zIndex: 1, // Above the image, below the text
  },
  overlayText: {
    position: "absolute",
    top: hp("5%"),
    left: 0,
    right: 0,
    textAlign: "left",
    fontFamily: "PTSerif-Regular",
    fontSize: 52,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    zIndex: 2, // Above the overlay
  },
  overlayTagline: {
    position: "absolute",
    top: hp("15%"),
    left: 0,
    right: 0,
    textAlign: "left",
    fontFamily: "PTSerif-Italic",
    fontSize: 18,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    zIndex: 2,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
    marginTop: 20,
    gap: 20,
  },
 
});

export default HomeScreen;