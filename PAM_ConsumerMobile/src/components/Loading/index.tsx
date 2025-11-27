import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { styles } from './styles';
import { theme } from '../../styles/theme';
import { useThemeContext } from '../../hooks/themeContext';
const Loading: React.FC = () => {
  const { dynamicTheme, themeController } = useThemeContext();

  return (
    <View style={themeController(styles.loadingContainer)}>
      <ActivityIndicator size={36} color={dynamicTheme.colors.primary} />
    </View>
  );
}

export default Loading;
