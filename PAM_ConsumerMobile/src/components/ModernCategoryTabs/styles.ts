import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: 'transparent',
  },

  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },

  tabCard: {
    width: 120,
    height: 110,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    position: 'relative',
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  tabText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },

  selectedIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 24,
    height: 3,
    borderRadius: 2,
  },
});

