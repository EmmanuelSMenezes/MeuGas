import React, { Children, useCallback, useEffect, useState } from 'react';
import { View, Modal, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import styles from './styles';

import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { theme } from '../../styles/theme';
import { useThemeContext } from '../../hooks/themeContext';

interface IModal {
  setModalVisible: (modaVisible: boolean) => void,
  modalVisible?: boolean,
  children?: React.ReactNode,
}

const ModalComponent = ({ setModalVisible, modalVisible, children }: IModal) => {

  const { dynamicTheme, themeController } = useThemeContext();

  return (
    <View style={themeController(styles.centeredView)}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        {children}
      </Modal>
    </View>
  );
}

export default ModalComponent;
