import { theme } from './../../styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },

  strengthBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: theme.colors.lightgray,
    height: 4,
    borderRadius: 8
  },

  strengthLevel0: {
    backgroundColor: theme.colors.danger,
    width: '0%',
    borderRadius: 8,
    height: 4
  },

  strengthLevel1: {
    backgroundColor: theme.colors.danger,
    width: '25%',
    borderRadius: 8,
    height: 4
  },

  strengthLevel2: {
    backgroundColor: theme.colors.warning,
    width: '50%',
    borderRadius: 8,
    height: 4
  },

  strengthLevel3: {
    backgroundColor: theme.colors.success,
    width: '75%',
    borderRadius: 8,
    height: 4
  },

  strengthLevel4: {
    backgroundColor: theme.colors.success,
    width: '100%',
    borderRadius: 8,
    height: 4
  },

  strengthStatusText: {
    marginTop: 6,
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontSize: 14
  },

  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6
  },

  instructionText: {
    color: theme.colors.gray,
    fontFamily: theme.fonts.regular,
    marginTop: 8,
    fontSize: 14
  },

  dot: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: 14,
    height: 14,
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
  }
})
