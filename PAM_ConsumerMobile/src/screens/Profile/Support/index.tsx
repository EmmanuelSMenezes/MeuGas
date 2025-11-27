import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { globalStyles } from '../../../styles/globalStyles';
import { Button, Header } from '../../../components/Shared';
import { theme } from '../../../styles/theme';
import { styles } from './styles';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../../hooks/AuthContext';
import { navigate } from '../../../routes/rootNavigation';
import { useGlobal } from '../../../hooks/GlobalContext';


const Support: React.FC = () => {


  const { deleteUser, user } = useAuth();
  const { openAlert } = useGlobal();

  const handleDeleteUser = () => {
    openAlert({
      title: 'Deseja excluir seu usuário?',
      description: 'Ao excluir o usuário você perderá todos os seus dados.',
      type: 'warning',
      buttons: {
        onConfirm: () => deleteUser(user.user_id)
      }
    })
  }

  return (
    <View style={globalStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Header backButton />
        <Text style={globalStyles.title}>Suporte</Text>
        <TouchableOpacity onPress={() => navigate('About')} style={styles.button}>
          <Feather name="info" size={24} color={theme.colors.black} />
          <Text style={styles.textAbout}>Sobre</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteUser()} style={styles.button}>
          <Feather name="trash" size={24} color={theme.colors.danger} />
          <Text style={styles.text}>Solicitar exclusão de conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default Support;
