export const theme = {
  fonts: {
    light_italic: 'Poppins_300Light_Italic',
    light: 'Poppins_300Light',
    italic: 'Poppins_400Regular_Italic',
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semibold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
  },

  colors: {
    // MeuGas Brand Colors
    primary: '#FF6A00', // Orange Fire - Cor principal MeuGas
    primaryLight: '#FF8A33', // Laranja mais claro
    primaryDark: '#CC5500', // Laranja mais escuro
    primaryBackground: '#FFF5EE', // Background suave laranja

    secondary: '#4FC3F7', // Light Blue - Cor secundária MeuGas
    secondaryLight: '#81D4FA', // Azul mais claro
    secondaryDark: '#0288D1', // Azul mais escuro

    // Cores de texto
    text: '#424242', // Texto principal
    textLight: '#757575', // Texto secundário
    textDark: '#212121', // Texto escuro

    // Cores neutras
    black: '#242424',
    gray: '#707070',
    grayLight: '#BDBDBD',
    lightgray: '#F5F5F5',
    white: '#FFFFFF',

    // Backgrounds
    background: '#FAFAFA',
    backgroundCard: '#FFFFFF',

    // Shadows
    shadow: '#00000020',
    shadowPrimary: '#FF6A0015', // Shadow com cor primária MeuGas
    shadowCard: '#00000010',

    // Status colors
    success: '#4CAF50',
    successLight: '#81C784',
    danger: '#F44336',
    dangerLight: '#E57373',
    warning: '#FFC107',
    warningLight: '#FFD54F',
    info: '#2196F3',
    infoLight: '#64B5F6',

    // MeuGas specific
    blue: '#4FC3F7', // Light Blue MeuGas
    darker: '#01579B', // Azul escuro - Headers e elementos principais
    shadowBlue: '#4FC3F715',
    shadowDarker: '#01579B15', // Shadow com cor darker
    gold: '#FFC107',
    orange: '#FF6A00', // Orange Fire MeuGas

    // Borders
    border: '#E0E0E0',
    borderLight: '#F5F5F5',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
  },

  // Spacing system
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    round: 999,
  },

  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};
