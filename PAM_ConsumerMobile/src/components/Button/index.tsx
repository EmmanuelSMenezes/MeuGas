import React from 'react';
import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { theme } from '../../styles/theme';
import { styles } from './styles';
import { useThemeContext } from '../../hooks/themeContext';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  icon?: React.ReactNode;
  buttonStyle?: TouchableOpacityProps['style'];
  buttonTextStyle?: TextStyle;
  buttonLoadingStyle?: string;
}

const Button = ({
  title,
  loading = false,
  icon,
  buttonStyle,
  buttonTextStyle,
  buttonLoadingStyle,
  ...props
}: ButtonProps) => {
  const { dynamicTheme, setDynamicTheme, themeController } = useThemeContext();

  return (
    <TouchableOpacity style={[themeController(styles.buttonContainer), buttonStyle, props.disabled && { opacity: 0.5 }]} {...props}>
      {loading ? (
        <ActivityIndicator color={buttonLoadingStyle || theme.colors.white} />
      ) : (
        <>
          {icon && icon}
          <Text style={[themeController(styles.buttonText), buttonTextStyle]}>{title}</Text>
          {icon && <View />}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
