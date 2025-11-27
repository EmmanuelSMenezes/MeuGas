import React, { ReactNode, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import { Entypo } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";

interface IAccordionProps {
  initialState?: boolean;
  title: string;
  rightTitle?: string;
  children: React.ReactNode;
}

const Accordion = ({
  initialState = false,
  title,
  rightTitle = "Ver mais",
  children,
}: IAccordionProps) => {
  const [opened, setOpened] = useState(initialState);

  const toggleAccordion = () => setOpened((isOpened) => !isOpened);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => toggleAccordion()}
        style={styles.content}
      >
        <Text style={styles.title}>{title}</Text>
        <View style={styles.seeMoreContainer}>
          <Text style={styles.label}>{rightTitle}</Text>

          <Entypo
            name={opened ? "chevron-small-up" : "chevron-small-down"}
            size={24}
            color={theme.colors.text}
          />
        </View>
      </TouchableOpacity>
      {opened && <View style={styles.childrenContainer}>{children}</View>}
    </View>
  );
};

export default Accordion;
