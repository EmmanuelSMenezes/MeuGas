
import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },

  tabStep: {
    width: 25,
    height: 25,
    backgroundColor: theme.colors.gray,
    textAlign: 'center',
    verticalAlign: 'middle',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.colors.lightgray,
    fontFamily: theme.fonts.regular,
    lineHeight: 20,
    borderRadius: 100,
  },

  stepsContainer: {
    flexDirection: 'column',
    gap: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  stepsContainerVertical: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeTabStep: {
    backgroundColor: theme.colors.primary,
    fontFamily: theme.fonts.medium
  },

  tabStepContent: {
    color: theme.colors.white
  },

  tabStepLabel: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
  },

  activeTabStepLabel: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
  },

  line: {
    flex: 1,
    height: 2,
    marginHorizontal: 2,
    backgroundColor: theme.colors.shadow
  },

  activeLine: {
    backgroundColor: theme.colors.primary
  },


  stepLineContainer: {
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },

  tabStepLine: {
    textAlign: 'center',
    verticalAlign: 'middle',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.lightgray,
    height: 4,
    flex: 1,
    color: theme.colors.lightgray,
    fontFamily: theme.fonts.regular,
    lineHeight: 20,
    borderRadius: 100
  },

  stepLine: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.lightgray,
    height: 4,
    width: '100%',
    color: theme.colors.lightgray,
    borderRadius: 100
  },

  tabStepLineLabel: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
  }






});
