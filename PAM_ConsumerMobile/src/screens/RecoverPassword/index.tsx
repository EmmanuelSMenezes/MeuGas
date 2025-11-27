import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from './styles';
import { globalStyles } from '../../styles/globalStyles';
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
import { Button, Header, MaskedInput } from '../../components/Shared';
import { useAuth } from '../../hooks/AuthContext';


interface phoneForm {
  phone: string
}

const RecoverPassword: React.FC = () => {

  const phoneSchema = yup.object().shape({
    phone: yup.string().required('Campo obrigatório').min(11, 'Insira um número válido')
  })

  const { OTPSendForgotPassword } = useAuth();

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<phoneForm>({
    resolver: yupResolver(phoneSchema),
    reValidateMode: 'onChange',
  });

  const onSubmit = ({phone}) => {
    OTPSendForgotPassword(phone)
  }

  return (
    <ScrollView style={globalStyles.container}>
      <Header backButton />
      <View style={styles.container}>
        <Text style={globalStyles.title}>Recuperação de Senha</Text>
        <Controller
          name='phone'
          control={control}
          render={({ field }) => (
            <MaskedInput
              label="Celular"
              mask='(99) 99999-9999'
              maxLength={15}
              required
              inputStyle={styles.inputSpacing}
              error={!!errors?.phone}
              helperText={errors?.phone?.message}
              placeholder='(xx) xxxxx-xxxx'
              onChangeText={(_, text) => { field.onChange(text) }}
              keyboardType='numeric'
            />
          )}
        />

        <Button
          title='Enviar'
          buttonStyle={styles.registerButton}
          onPress={handleSubmit(onSubmit)}
        />
      </View>

    </ScrollView>
  )
}

export default RecoverPassword;

