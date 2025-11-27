import React from 'react';
import { View, ViewProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from './styles';
import { theme } from '../../styles/theme';
import { useThemeContext } from '../../hooks/themeContext';

interface EmptyImageProps extends ViewProps {
  small?: boolean,
  iconSize?: number
}

const EmptyImage = ({ small = false, iconSize, ...rest }: EmptyImageProps) => {
  const { dynamicTheme, themeController } = useThemeContext();

  return (
    <View {...rest} style={[themeController(styles.container), rest.style]} >
      <Feather name="image" size={iconSize ? iconSize : small ? 36 : 64} color={dynamicTheme.colors.primary} />
    </View>
  );
}

export default EmptyImage;
