import React, { useRef, useEffect, useState } from "react";
import { Animated, View, StyleSheet, Image, Text } from "react-native";
import GrowthNeedsButton from "./components/TreeInformaton/GrowthNeedsButton";
import GrowthPeriod from "./components/TreeInformaton/GrowthPeriodButton";
import LifeSpanButton from "./components/TreeInformaton/LifeSpanButton";
import BottomNavBar from "./components/bottomNavBar";
import Map from "./components/TreeInformaton/Map";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { fetchTreeDetails } from "./services/api";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

type RootStackParamList = {
  TreeInformation: { treeId: string };
};

const TreeInformation = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const route = useRoute<RouteProp<RootStackParamList, "TreeInformation">>();
  const [tree, setTree] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);  // Added state for error
  const treeId = route.params?.treeId;

  useEffect(() => {
    const getTreeData = async () => {
      if (!treeId) {
        console.log("treeId is undefined in TreeInformation - route.params:", route.params);
        return;
      }
      try {
        console.log("Fetching tree data with treeId:", treeId);
        const treeData = await fetchTreeDetails(treeId);
        console.log("Fetched Tree Data:", treeData);
        setTree(treeData);
      } catch (error) {
        console.error("Error fetching tree data:", error);
        setError("Failed to fetch tree data. Please try again later.");  // Update error state
      }
    };
    getTreeData();
  }, [treeId]);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, hp("20%")],
    outputRange: [hp("35%"), hp("20%")],
    extrapolate: "clamp",
  });

  const contentTranslateY = scrollY.interpolate({
    inputRange: [0, hp("20%")],
    outputRange: [0, -hp("10%")],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.mainContainer}>
      <Animated.View style={[styles.imageContainer, { height: headerHeight }]}>
        <Image source={require("./assets/images/narra-bg.png")} style={styles.image} />
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <Animated.View style={[styles.contentWrapper, { transform: [{ translateY: contentTranslateY }] }]}>
          <View style={styles.infoContainer}>
            {/* Conditional Rendering Based on Data */}
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : !tree ? (
              <Text style={styles.loadingText}>Loading tree details...</Text>
            ) : (
              <>
                <Text style={styles.title}>{tree.tree_name}</Text>
                <Text style={styles.scientificName}>{tree.sci_name}</Text>
                <View style={styles.descriptionBox}>
                  <Text style={styles.description}>
                    {tree.description || "No description available"}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Pass treeId explicitly */}
          <GrowthNeedsButton treeId={treeId} />
          <LifeSpanButton treeId={treeId} />
          <GrowthPeriod treeId={treeId} />
          <Map treeId={treeId} />
        </Animated.View>
      </Animated.ScrollView>

      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
    position: "relative", // Ensures proper stacking of elements
  },
  imageContainer: {
    width: wp("100%"),
    height: hp("35%"), // Ensures the image takes up space
    position: "absolute",
    top: 0,
    backgroundColor: "#ddd", // Temporary to check visibility
    zIndex: 0, // Ensures it stays in the background
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentWrapper: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: hp("10%"),
    alignItems: "center",
    position: "relative",
    marginTop: hp("30%"), // Ensures the image is visible initially
    zIndex: 1, // Ensures it goes over the image
  },
  infoContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontFamily: "PTSerif-Regular",
    fontSize: 24,
    color: "#3d3d3d",
  },
  scientificName: {
    fontFamily: "PTSerif-Italic",
    color: "#6d8f69",
    marginBottom: 10,
  },
  descriptionBox: {
    fontFamily: "PTSerif-Regular",
    backgroundColor: "#739E57",
    padding: 15,
    borderRadius: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  description: {
    fontFamily: "PTSerif-Regular",
    color: "white",
    fontSize: 14,
  },
  loadingText: {
    fontSize: 18,
    color: "#999",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default TreeInformation;
