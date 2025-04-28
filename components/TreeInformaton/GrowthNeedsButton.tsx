import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { fetchTreeDetails } from "../../services/api"; // Ensure correct path

interface GrowthNeedsButtonProps {
  treeId?: string;
}

const GrowthNeedsButton: React.FC<GrowthNeedsButtonProps> = ({ treeId }) => {
  const [open, setOpen] = useState(false);
  const [growthNeeds, setGrowthNeeds] = useState<string | null>(null);
  const rotation = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const getGrowthNeeds = async () => {
      if (!treeId) return;
      try {
        const data = await fetchTreeDetails(treeId);
        setGrowthNeeds(data?.growth_needs || "No specific growth needs listed.");
      } catch (error) {
        console.error("Failed to fetch growth needs:", error);
        setGrowthNeeds("Failed to fetch growth needs.");
      }
    };
    getGrowthNeeds();
  }, [treeId]);

  const toggleDropdown = () => {
    Animated.timing(rotation, {
      toValue: open ? 0 : 180,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setOpen(!open);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
        <Image source={require("../../assets/icons/growth-needs-icon.png")} style={styles.icon} />
        <Text style={styles.dropdownText}>Growth Needs</Text>
        <Animated.Image
          source={require("../../assets/icons/dropdown-arrow.png")}
          style={[
            styles.dropdownIcon,
            {
              transform: [
                {
                  rotate: rotation.interpolate({
                    inputRange: [0, 180],
                    outputRange: ["0deg", "180deg"],
                  }),
                },
              ],
            },
          ]}
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownContent}>
          <Text style={styles.contentText}>
            {growthNeeds}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginTop: 10,
  },
  dropdownButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    width: wp("90%"),
    alignSelf: "center",
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    color: "#3d3d3d",
  },
  dropdownIcon: {
    width: 16,
    height: 16,
  },
  dropdownContent: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
    width: wp("85%"),
    alignSelf: "center",
    elevation: 2,
  },
  contentText: {
    fontSize: 14,
    color: "#555",
  },
});

export default GrowthNeedsButton;
