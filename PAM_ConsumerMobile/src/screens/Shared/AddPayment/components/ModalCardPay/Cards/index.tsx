import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './styles'
import { theme } from '../../../../../../styles/theme';
// import { Container } from './styles';

interface ICard{
  text: string,
  icon: React.ReactNode,
  onPress?: () => void;
}

const Cards = ({text, icon, onPress}: ICard) => {
  return (
      <View style={styles.rowContainer}>
        <View style={styles.containerIcon}>
          {icon}
        </View>
        <View style={styles.containerText}>
          <Text style={styles.modalText}>{text}</Text>
        </View>
      </View>
  );
}

export default Cards;
