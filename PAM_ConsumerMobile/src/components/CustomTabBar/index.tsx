import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { View, Pressable } from "react-native";
import { styles } from "./styles";
import { theme } from "../../styles/theme";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useThemeContext } from "../../hooks/themeContext";

interface ICustomTabBar extends BottomTabBarProps {
  onSwitchTab: (tab: any) => void;
}

const CustomTabBar = ({
  state,
  descriptors,
  insets,
  navigation,
  onSwitchTab,
}: ICustomTabBar) => {
  const { dynamicTheme, setDynamicTheme, themeController } = useThemeContext();
  const width = useSharedValue(0);
  const tabButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  });

  const offset = useSharedValue(0);
  const badgeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(offset.value * -6, {
            damping: 100,
            stiffness: 200,
          }),
        },
      ],
    };
  });

  useEffect(() => {
    const toValue = state.index === 0 ? 40 : state.index === 1 ? 64 : 40;

    width.value = 0;
    width.value = withTiming(toValue, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });

    if (state.index === 1) {
      offset.value = withTiming(-7);
    } else {
      offset.value = 0;
    }
  }, [state]);

  return (
    <View style={themeController(styles.mainContainer)}>
      {state.routes.map((route, index: number) => {
        const { options } = descriptors[route.key];

        const isFocused = state.index === index;

        const icon = options.tabBarIcon({
          focused: isFocused,
          color: isFocused
            ? dynamicTheme.colors.white
            : dynamicTheme.colors.gray,
          size: 12,
        });

        const label: any =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const badge = options?.tabBarBadge?.toString();

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            onSwitchTab(route.name);
            navigation.navigate(route.name);
          }
        };

        return (
          <View
            key={index}
            style={themeController(styles.tabBarButtonContainer)}
          >
            {badge && isFocused ? (
              <Animated.Text
                style={[
                  badgeAnimatedStyle,
                  themeController(styles.badgePosition),
                ]}
              >
                {badge}
              </Animated.Text>
            ) : badge ? (
              <Animated.Text
                style={[
                  badgeAnimatedStyle,
                  themeController(styles.badgePosition),
                ]}
              >
                {badge}
              </Animated.Text>
            ) : (
              <></>
            )}
            <Pressable
              onPress={() => {
                onPress();
              }}
              style={[
                themeController(styles.tabBarButton),
                isFocused && themeController(styles.tabBarButtonFocused),
              ]}
            >
              <View style={themeController(styles.buttonContent)}>
                {icon}
                {isFocused && (
                  <Animated.Text
                    numberOfLines={1}
                    style={[
                      themeController(styles.buttonTitle),
                      isFocused && themeController(styles.buttonTitleFocused),
                      tabButtonAnimatedStyle,
                    ]}
                  >
                    {label}
                  </Animated.Text>
                )}
              </View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
