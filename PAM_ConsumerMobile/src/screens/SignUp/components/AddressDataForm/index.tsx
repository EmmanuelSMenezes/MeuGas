import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { Controller, useForm } from 'react-hook-form'
import { Input, MaskedInput, Checkbox } from '../../../../components/Shared'
import { styles } from './styles';
import Button from '../../../../components/Button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../../hooks/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../styles/theme';
import * as Location from 'expo-location'

interface AddressDataForm {
  number?: string
  state?: string
  city?: string
  postal_code?: string
  complement?: string
  street?: string
  accept_terms: boolean,
  district: string
}

interface LocationAddressData {
  city: string,
  country: string,
  district: string,
  isoCountryCode: string,
  name: string,
  postalCode: string,
  region: string,
  street: string,
  streetNumber: string,
  subregion: string,
  timezone?: any
}

const AddressDataForm: React.FC = () => {

  const addressDataSchema = yup.object().shape({
    number: yup.string(),
    state: yup.string(),
    postal_code: yup.string(),
    distric: yup.string(),
    city: yup.string(),
    complement: yup.string(),
    street: yup.string(),
    accept_terms: yup.bool().oneOf([true], 'Aceite os termos para continuar').required(),
  })

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddressDataForm>({
    resolver: yupResolver(addressDataSchema),
    reValidateMode: 'onChange',
  });

  const { signUpData, setSignUpData } = useAuth();
  const { navigate } = useNavigation();

  const handleGetUserAddress = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Sem permissão',
        'Para utilizar essa função, precisamos ter acesso a sua localização. ',
        [{ text: 'Ok' }],
        { cancelable: false }
      );
    }

    let { coords } = await Location.getCurrentPositionAsync();

    if (coords) {
      const { latitude, longitude } = coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      setValue('city', response[0]?.city || response[0]?.subregion || '')
      setValue('postal_code', response[0]?.postalCode || '')
      setValue('number', response[0]?.streetNumber || '')
      setValue('street', response[0]?.street || '')
      setValue('state', response[0]?.region || '')
      setValue('district', response[0]?.district || '')
    }
  }

  const onSubmit = async (data: AddressDataForm) => {
    // Dando set para juntar os dados aqui, mas se a requisição for feita aqui mesmo, nem precisa, só juntar o objeto e mandar
    // Sendo assim, após isso importante limpar esse state que está no contexto após cadastrar o usuário.
    setSignUpData(signUpData => {
      return {
        ...signUpData,
        ...data
      }
    })

    // submeter dados aqui
    navigate('OTPVerification', { phone: signUpData?.phone });
    // Limpar dados do state signUpData
  }

  return (
    <ScrollView>
      <TouchableOpacity onPress={() => handleGetUserAddress()} style={styles.locationButton}>
        <MaterialIcons name="my-location" size={24} color={theme.colors.white} />
        <Text style={styles.locationButtonText}>Usar minha localização</Text>
      </TouchableOpacity>

      <Controller
        name='postal_code'
        control={control}
        render={({ field }) => (
          <MaskedInput
            label="CEP"
            mask='99999-999'
            value={field.value}
            inputStyle={styles.inputSpacing}
            error={!!errors?.postal_code}
            helperText={errors?.postal_code?.message}
            placeholder='xxxxx-xxx'
            onChangeText={(_, text) => field.onChange(text)}
          />
        )}
      />

      <Controller
        name='city'
        control={control}
        render={({ field }) => (
          <Input
            label="Cidade"
            inputStyle={styles.inputSpacing}
            value={field.value}
            error={!!errors?.city}
            helperText={errors?.city?.message}
            placeholder='Ex: Vieirópolis'
            onChangeText={text => field.onChange(text)}
          />
        )}
      />

      <Controller
        name='state'
        control={control}
        render={({ field }) => (
          <Input
            label="Estado"
            inputStyle={styles.inputSpacing}
            value={field.value}
            error={!!errors?.state}
            helperText={errors?.state?.message}
            placeholder='Estado'
            onChangeText={text => field.onChange(text)}
          />
        )}
      />

      <Controller
        name='district'
        control={control}
        render={({ field }) => (
          <Input
            label="Bairro"
            inputStyle={styles.inputSpacing}
            value={field.value}
            error={!!errors?.district}
            helperText={errors?.district?.message}
            placeholder='Bairro'
            onChangeText={text => field.onChange(text)}
          />
        )}
      />

      <View style={styles.rowInputFields}>
        <Controller
          name='street'
          control={control}
          render={({ field }) => (
            <Input
              label="Logradouro"
              value={field.value}
              inputStyle={styles.streetInput}
              error={!!errors?.street}
              helperText={errors?.street?.message}
              placeholder='Logradouro'
              onChangeText={text => field.onChange(text)}
            />
          )}
        />

        <Controller
          name='number'
          control={control}
          render={({ field }) => (
            <Input
              label="Número"
              value={field.value}
              inputStyle={styles.numberInput}
              error={!!errors?.number}
              helperText={errors?.number?.message}
              placeholder='Ex: 104'
              onChangeText={text => field.onChange(text)}
            />
          )}
        />
      </View>



      <Controller
        name='complement'
        control={control}
        render={({ field }) => (
          <Input
            label="Complemento"
            inputStyle={styles.inputSpacing}
            error={!!errors?.complement}
            helperText={errors?.complement?.message}
            placeholder='Complemento'
            onChangeText={text => field.onChange(text)}
          />
        )}
      />
      <View style={styles.termsContainer}>
        <Controller
          name="accept_terms"
          render={({ field: { onChange, value } }) =>
            <Checkbox
              error={!!errors?.accept_terms}
              onValueChange={(value: boolean) => {
                onChange(Number(value))
                setValue('accept_terms', value)
              }}
              value={!!value}
            />
          }
        />
        <Text style={[styles.termsText, !!errors?.accept_terms && styles.termsError]}>
          Declaro que li e aceito os termos de política & privacidade
        </Text>
      </View>

      <Button
        title='Confirmar'
        buttonStyle={styles.registerButton}
        onPress={handleSubmit(onSubmit)}
      />
    </ScrollView>
  );
}

export default AddressDataForm;
