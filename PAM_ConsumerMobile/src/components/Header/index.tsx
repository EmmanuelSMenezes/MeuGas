import React from 'react';
import { View, TouchableOpacity, ViewProps } from 'react-native';
import { styles } from './styles';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../hooks/themeContext';
interface HeaderProps {
  children?: React.ReactNode,
  backButton?: boolean,
  onPressBackButton?: () => void,
  style?: ViewProps['style'],
}

const Header = ({ children, style, backButton, onPressBackButton }: HeaderProps) => {
  const { goBack } = useNavigation();
  const { dynamicTheme, setDynamicTheme, themeController } = useThemeContext();

  return (
    <View style={[styles.header, style]}>
      {backButton && (
        <TouchableOpacity onPress={() => onPressBackButton ? onPressBackButton() : goBack()}>
          <Feather name="chevron-left" size={24} color={dynamicTheme.colors.primary} />
        </TouchableOpacity>
      )}
      {children}
    </View>
  );
};

export default Header;
