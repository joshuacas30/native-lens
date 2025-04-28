import React, { useState } from "react";
import { View, Text, FlatList, TextInput, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import BottomNavBar from "./components/bottomNavBar";
import { useNavigation, NavigationProp } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

// Define navigation type
type RootStackParamList = {
  TreeLibrary: undefined;
  TreeInformation: { treeId: string };
};

// Tree data matching Camera.tsx
const treeData = [
  { treeId: "1", name: "Narra", scientificName: "Pterocarpus indicus" },
  { treeId: "2", name: "Banaba", scientificName: "Lagerstroemia speciosa" },
  { treeId: "3", name: "Ipil", scientificName: "Intsia bijuga" },
  { treeId: "4", name: "Kamagong", scientificName: "Diospyros philippinensis" },
  { treeId: "5", name: "Talisay", scientificName: "Terminalia catappa" },
];

const TreeLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const filteredData = treeData.filter(tree =>
    tree.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tree.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTreePress = (treeId: string) => {
    console.log("Navigating to TreeInformation with treeId:", treeId);
    navigation.navigate("TreeInformation", { treeId });
  };

  return (
    <View style={styles.container}>
      {/* Curved Green Header */}
      <View style={styles.header}>
        <View style={styles.curvedBackground} />
        <Text style={[styles.title, styles.titleSpacing]}>Tree</Text>
        <Text style={styles.title}>Library</Text>

        {/* Search Bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search trees..."
          placeholderTextColor="#ccc"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tree List or No Result Text */}
      <View style={styles.flatListWrapper}>
        {filteredData.length > 0 ? (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.treeId}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => handleTreePress(item.treeId)}
              >
                <Text style={styles.treeName}>{item.name}</Text>
                <Text style={styles.scientificName}>"{item.scientificName}"</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
          />
        ) : (
          searchQuery.trim().length > 0 && (
            <Text style={styles.noResultsText}>No trees found matching your search.</Text>
          )
        )}
      </View>

      {/* Fixed Navigation Bar */}
      <View style={styles.bottomNavContainer}>
        <BottomNavBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#F4F1E9",
  },
  header: {
    alignItems: "center",
    position: "relative",
  },
  curvedBackground: {
    width: 490,
    height: 220,
    backgroundColor: "#6A8E4E",
    borderBottomLeftRadius: width / 1,
    borderBottomRightRadius: width / 1,
    position: "absolute",
    top: 0,
  },
  title: {
    fontFamily: "PTSerif-Regular",
    fontSize: 52,
    color: "white",
    marginTop: 80,
    textAlign: "center",
    lineHeight: 55,
  },
  titleSpacing: {
    marginBottom: -80,
  },
  searchBar: {
    marginTop: 40,
    backgroundColor: "#fff",
    width: "90%",
    height: 50,
    borderRadius: 40,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    borderWidth: 0.5,
    borderColor: "#6A8E4E",
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 15,
    elevation: 5,
    alignItems: "center",
  },
  treeName: {
    fontFamily: "PTSerif-Regular",
    fontSize: 18,
    color: "#4D6B3D",
  },
  scientificName: {
    fontFamily: "PTSerif-Regular",
    fontSize: 14,
    fontStyle: "italic",
    color: "#739E57",
  },
  flatListWrapper: {
    flex: 1,
    marginTop: 40,
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    paddingBottom: 10,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#888",
    fontFamily: "PTSerif-Regular",
  },
});

export default TreeLibrary;
