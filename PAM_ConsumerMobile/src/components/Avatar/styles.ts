import { theme } from './../../styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  withoutImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: theme.colors.lightgray,
    borderRadius: 64
  },

  imageContainer: {
    position: 'relative'
  },

  editIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: theme.colors.white,
    borderRadius: 64,
    padding: 4,
    zIndex: 99
  },

  cameraModal: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  }


});

