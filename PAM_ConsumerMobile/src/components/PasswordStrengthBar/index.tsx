import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import { Entypo, Feather } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { useThemeContext } from "../../hooks/themeContext";

interface PasswordStrengthBarProps {
  password: string;
  onChangeText?: (level: number) => void;
}

interface PasswordStrengthInstructions {
  id: number;
  message: string;
  verifyStrengthLevel: (password: string) => boolean;
}

type StrengthLevels = 0 | 1 | 2 | 3 | 4;

const instructionMessages: PasswordStrengthInstructions[] = [
  {
    id: 1,
    message: "Pelo menos 8 caracteres",
    verifyStrengthLevel: (password: string) => password.length >= 8,
  },
  {
    id: 2,
    message: "Pelo menos uma letra maiúscula",
    verifyStrengthLevel: (password: string) => /[A-Z]/gm.test(password),
  },
  {
    id: 3,
    message: "Conter números",
    verifyStrengthLevel: (password: string) => !!password.match(/[0-9]/),
  },
  {
    id: 4,
    message: "Conter ao menos um caractere especial",
    verifyStrengthLevel: (password: string) =>
      !!password.match(/[$&+,:;=?@#|'<>.^*()%!-]/),
  },
];

const PasswordStrengthBar = ({
  password = "",
  onChangeText,
}: PasswordStrengthBarProps) => {
  const { dynamicTheme, themeController } = useThemeContext();

  const [strengthLevel, setStrengthLevel] = useState<StrengthLevels>(0);

  const strengthLevelStatus = [
    "Sua senha deve conter:",
    "Fraca",
    "Razoável",
    "Bom",
    "Muito bom",
  ];

  useEffect(() => {
    if (
      !instructionMessages.some(({ verifyStrengthLevel }) =>
        verifyStrengthLevel(password)
      )
    ) {
      password ? setStrengthLevel(1) : setStrengthLevel(0);
      return;
    }

    const newStrengthLevel =
      password.length >= 8
        ? instructionMessages.reduce((accumulator, currentValue) => {
            return (
              accumulator + Number(currentValue.verifyStrengthLevel(password))
            );
          }, 0)
        : 0;

    const levelNumber = newStrengthLevel as StrengthLevels;

    onChangeText && onChangeText(levelNumber);
    setStrengthLevel(levelNumber);
  }, [password]);

  return (
    <View style={themeController(styles.container)}>
      <View style={themeController(styles.strengthBarContainer)}>
        <View
          style={themeController(styles[`strengthLevel${strengthLevel}`])}
        />
      </View>

      <Text style={themeController(styles.strengthStatusText)}>
        {strengthLevelStatus[strengthLevel]}
      </Text>
      {instructionMessages.map(({ message, verifyStrengthLevel }, index) => (
        <View
          key={index.toString()}
          style={themeController(styles.instructionContainer)}
        >
          {verifyStrengthLevel(password) ? (
            <Feather name="check" size={14} color={dynamicTheme.colors.success} />
          ) : (
            <Text style={themeController(styles.dot)}>•</Text>
          )}
          <Text
            key={index.toString()}
            style={themeController(styles.instructionText)}
          >
            {message}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default PasswordStrengthBar;
