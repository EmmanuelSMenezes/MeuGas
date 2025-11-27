import { StyleSheet, Platform, Dimensions } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  cardSize: {
    width: Dimensions.get('screen').width / 2.3,
  },

  listContainer: {
    rowGap: 12,
    paddingBottom: 32
  },

  listColumnStyle: {
    justifyContent: 'space-between',
  },

  title: {

  },

  subtitle: {
    fontSize: 20,
    marginBottom: 12,
    marginTop: 24
  }
});
