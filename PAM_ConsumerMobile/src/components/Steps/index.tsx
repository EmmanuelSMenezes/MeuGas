import React, { Fragment } from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import { Feather } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { StepOption } from "../../interfaces/Steps";
import { useThemeContext } from "../../hooks/themeContext";

interface StepsProps {
  currentTab: number;
  tabs: StepOption[];
  ordered?: boolean;
  vertical?: boolean;
}

const Steps = ({ currentTab, tabs, ordered, vertical }: StepsProps) => {
  const { dynamicTheme, themeController } = useThemeContext();

  if (ordered)
    return (
      <View style={themeController(styles.container)}>
        {tabs.map(({ label }, index) => (
          <Fragment key={index.toString()}>
            <View
              style={
                vertical
                  ? themeController(styles.stepsContainer)
                  : themeController(styles.stepsContainerVertical)
              }
            >
              {currentTab > index ? (
                <View
                  style={[
                    themeController(styles.tabStep),
                    currentTab >= index &&
                      themeController(styles.activeTabStep),
                  ]}
                >
                  <Feather name="check" size={16} color={theme.colors.white} />
                </View>
              ) : (
                <Text
                  style={[
                    themeController(styles.tabStep),
                    currentTab === index &&
                      themeController(styles.activeTabStep),
                  ]}
                >
                  {index + 1}
                </Text>
              )}
              <Text
                style={[
                  themeController(styles.tabStepLabel),
                  currentTab === index &&
                    themeController(styles.activeTabStepLabel),
                ]}
              >
                {label}
              </Text>
            </View>
            {tabs.length - 1 !== index && (
              <View
                style={[
                  themeController(styles.line),
                  currentTab > index && themeController(styles.activeLine),
                ]}
              />
            )}
          </Fragment>
        ))}
      </View>
    );

  return (
    <View style={themeController(styles.container)}>
      {tabs.map(({ label }, index) => (
        <Fragment key={index.toString()}>
          <View style={themeController(styles.stepLineContainer)}>
            <Text
              style={[
                themeController(styles.tabStepLineLabel),
                currentTab === index &&
                  themeController(styles.activeTabStepLabel),
              ]}
            >
              {label}
            </Text>
            <View
              style={[
                themeController(styles.stepLine),
                currentTab >= index && themeController(styles.activeLine),
              ]}
            />
          </View>
        </Fragment>
      ))}
    </View>
  );
};

export default Steps;
