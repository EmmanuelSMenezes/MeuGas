import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },

  scrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },

  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },

  filterTextSelected: {
    color: '#FFFFFF',
  },
});

