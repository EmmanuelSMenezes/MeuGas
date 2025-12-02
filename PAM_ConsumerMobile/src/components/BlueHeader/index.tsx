import React from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";

interface BlueHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  centerComponent?: React.ReactNode;
}

export const BlueHeader: React.FC<BlueHeaderProps> = ({
  title,
  showBackButton = true,
  rightComponent,
  centerComponent,
}) => {
  const { goBack } = useNavigation();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      <View style={styles.blueHeader}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          {showBackButton ? (
            <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.spacer} />
          )}

          {rightComponent && (
            <View style={styles.rightContainer}>{rightComponent}</View>
          )}
        </View>

        {/* Title */}
        <Text style={styles.headerTitle}>{title}</Text>

        {/* Center Component (ex: Avatar, Icon) */}
        {centerComponent && (
          <View style={styles.centerContainer}>{centerComponent}</View>
        )}
      </View>
    </>
  );
};

export default BlueHeader;

