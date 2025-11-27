import React from 'react';
import { View, TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { styles } from './styles';

interface SuggestionProps extends TouchableOpacityProps {
  id: string,
  text: string,
  active?: boolean
}

const Suggestion = ({ id, text, active, ...props }: SuggestionProps) => {
  return (
    <TouchableOpacity style={[styles.suggestionContainer, active && styles.suggestionContainerActive]} {...props}>
      <Text style={[styles.suggestionText, active && styles.suggestionTextActive]}>{text}</Text>
    </TouchableOpacity>
  );
}

export default Suggestion;
