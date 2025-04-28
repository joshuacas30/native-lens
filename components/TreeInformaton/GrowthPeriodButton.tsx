import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, ActivityIndicator } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { fetchTreeDetails } from "../../services/api";

interface GrowthPeriodButtonProps {
  treeId: string;
}

const GrowthPeriodButton: React.FC<GrowthPeriodButtonProps> = ({ treeId }) => {
  const [open, setOpen] = useState(false);
  const [growthPeriod, setGrowthPeriod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const getGrowthPeriod = async () => {
      if (!open || !treeId) return;

      setLoading(true);
      setError(null);
      try {
        const treeData = await fetchTreeDetails(treeId);
        if (treeData?.growth_period) {
          setGrowthPeriod(treeData.growth_period);
        } else {
          setGrowthPeriod("No growth period data available.");
        }
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    getGrowthPeriod();
  }, [open, treeId]);

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
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton} activeOpacity={0.7}>
        <Image source={require("../../assets/icons/growth-period-icon.png")} style={styles.icon} />
        <Text style={styles.dropdownText}>Growth Period</Text>
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
          {loading ? (
            <ActivityIndicator size="small" color="#3d3d3d" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <Text style={styles.contentText}>{growthPeriod}</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: { marginTop: 10 },
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
  icon: { width: 24, height: 24, marginRight: 10 },
  dropdownText: { fontSize: 16, fontWeight: "bold", flex: 1, color: "#3d3d3d" },
  dropdownIcon: { width: 16, height: 16 },
  dropdownContent: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
    width: wp("85%"),
    alignSelf: "center",
    elevation: 2,
  },
  contentText: { fontSize: 14, color: "#555" },
  errorText: { fontSize: 14, color: "red" },
});

export default GrowthPeriodButton;
