import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import BottomNavBar from "./components/bottomNavBar";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  History: undefined;
  TreeInformation: { treeId: string }; // Match Camera.tsx
};

type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, "History">;
type TreeInformationScreenRouteProp = RouteProp<RootStackParamList, "TreeInformation">;

interface HistoryProps {
  navigation: HistoryScreenNavigationProp;
  route: TreeInformationScreenRouteProp;
}

const { width } = Dimensions.get("window");

const History: React.FC<HistoryProps> = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [history, setHistory] = useState<{ treeId: string; tree_name: string; sci_name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        console.log("Loading history from AsyncStorage");
        const savedHistory = await AsyncStorage.getItem("treeHistory");
        console.log("Loaded history:", savedHistory);
        if (savedHistory !== null) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (e) {
        console.error("Failed to load history:", e);
        setError("Failed to load history.");
      }
    };
    loadHistory();
  }, [isFocused]);

  const handleCardPress = (treeId: string) => {
    navigation.navigate("TreeInformation", { treeId }); // Navigate with treeId
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.curvedBackground} />
        <Text style={styles.headerText}>History</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {history.length > 0 ? (
          history.map((tree, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => handleCardPress(tree.treeId)} // Use treeId
            >
              <Text style={styles.cardTitle}>{tree.tree_name}</Text>
              <Text style={styles.cardSubtitle}>{tree.sci_name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No history available.</Text>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>

      <View>
        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
};

export const addTreeToHistory = async (tree: { treeId: string; tree_name: string; sci_name: string }) => {
  try {
    const savedHistory = await AsyncStorage.getItem("treeHistory");
    const history = savedHistory ? JSON.parse(savedHistory) : [];

    if (history.some((item: { treeId: string }) => item.treeId === tree.treeId)) {
      return;
    }

    const newHistory = [tree, ...history].slice(0, 50);
    await AsyncStorage.setItem("treeHistory", JSON.stringify(newHistory));
    console.log("Added to history:", tree);
  } catch (e) {
    console.error("Failed to add tree to history:", e);
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F1E9",
  },
  headerContainer: {
    alignItems: "center",
    position: "relative",
    width: "100%",
    zIndex: 10,
  },
  curvedBackground: {
    width: 490,
    height: 190,
    backgroundColor: "#6A8E4E",
    borderBottomLeftRadius: width / 1,
    borderBottomRightRadius: width / 1,
    position: "absolute",
    top: 0,
  },
  headerText: {
    fontFamily: "PTSerif-Regular",
    fontSize: 55,
    color: "#fff",
    marginTop: 80,
    textAlign: "center",
  },
  scrollContainer: {
    alignItems: "center",
    paddingTop: 75,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  cardTitle: {
    fontFamily: "PTSerif-Regular",
    fontSize: 18,
    color: "#4D6B3D",
  },
  cardSubtitle: {
    fontFamily: "PTSerif-Italic",
    fontSize: 14,
    color: "#739E57",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default History;