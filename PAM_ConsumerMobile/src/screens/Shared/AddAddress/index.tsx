import React, { useEffect } from "react";
import { View, ScrollView, Text, TouchableOpacity, Alert } from "react-native";
import { Controller, useForm } from "react-hook-form";
import {
  Input,
  MaskedInput,
  Button,
  Header,
  Select,
} from "../../../components/Shared";
import { styles } from "./styles";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useAuth } from "../../../hooks/AuthContext";
import { theme } from "../../../styles/theme";
import { globalStyles } from "../../../styles/globalStyles";
import { Address } from "../../../interfaces/User";
import { useUser } from "../../../hooks/UserContext";
import { RootStackParams } from "../../../interfaces/RouteTypes";
import { useGlobal } from "../../../hooks/GlobalContext";
import { useThemeContext } from "../../../hooks/themeContext";
import { ufToState, ufs } from "../../../utils/places";
import axios from "axios";
import { ViaCEPResponse } from "../../../interfaces/Utils";

const AddAddress: React.FC<RootStackParams<"AddAddress">> = ({ route }) => {
  const addressToEdit = route?.params?.address_id;

  const addressDataSchema = yup.object().shape({
    description: yup.string(),
    number: yup.string(),
    state: yup
      .string()
      .max(2, "UF precisa ter apenas 2 caracteres")
      .required("Campo obrigatório"),
    zip_code: yup
      .string()
      .required("Campo obrigatório")
      .length(8, "Informe um CEP válido"),
    district: yup.string().required("Campo obrigatório"),
    city: yup.string().required("Campo obrigatório"),
    complement: yup.string(),
    street: yup.string().required("Campo obrigatório"),
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<Address>({
    resolver: yupResolver(addressDataSchema),
    reValidateMode: "onChange",
  });

  const { user } = useAuth();
  const { postNewAddress, updateAddress, getAddress, getAllAddresses } =
    useUser();
  const { dynamicTheme, setDynamicTheme, themeController } = useThemeContext();
  const { openAlert } = useGlobal();
  const { navigate, goBack } = useNavigation();

  const getPlaceDetailsByCEP = async (cep: string): Promise<ViaCEPResponse> => {
    const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    return data;
  };

  const handleGetUserAddress = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Sem permissão",
        "Para utilizar essa função, precisamos ter acesso a sua localização. ",
        [{ text: "Ok" }],
        { cancelable: false }
      );
    }

    let { coords } = await Location.getCurrentPositionAsync();

    if (coords) {
      const { latitude, longitude } = coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const { uf } = await getPlaceDetailsByCEP(response[0]?.postalCode);

      setValue("city", response[0]?.city || response[0]?.subregion || "");
      setValue("zip_code", response[0]?.postalCode || "");
      setValue("number", response[0]?.streetNumber || "");
      setValue("street", response[0]?.street || "");
      setValue("state", uf || "");
      setValue("district", response[0]?.district || "");
    }
  };

  const onSubmit = async (data: Address) => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      openAlert({
        title: "Sem permissão",
        description:
          "Para cadastrar um endereço, precisamos de permissão para acessar sua localização",
        type: "error",
        buttons: {
          cancelButton: false,
          confirmButtonTitle: "Ok",
        },
      });
    }
    if (!data.complement) data.complement = "N/A";
    if (!data.number) data.number = "S/N";

    const { city, complement, district, number, state, zip_code, street } =
      data;

    const address = `${city}, ${ufToState[state]}, ${zip_code}, ${street}, ${district}, ${number}, ${complement},`;

    const coords = await Location.geocodeAsync(address);

    const newAddress = {
      ...data,
      latitude: coords[0].latitude.toString(),
      longitude: coords[0].longitude.toString(),
    };

    if (addressToEdit) {
      const result = await updateAddress(newAddress);

      if (result) {
        openAlert({
          title: "Sucesso",
          description: `${result?.message}`,
          type: "success",
          buttons: {
            cancelButton: false,
            confirmButtonTitle: "Ok",
            onConfirm: () => goBack(),
          },
        });
      }
    } else {
      postNewAddress(newAddress);
    }

    getAllAddresses();
  };

  const onGetAddressToEdit = async () => {
    const data = await getAddress(addressToEdit);

    Object.entries(data).map(([key, value]: any) => setValue(key, value));
  };

  const ufOptions = ufs.map((uf) => ({
    label: uf,
    item: uf,
  }));

  useEffect(() => {
    if (addressToEdit) onGetAddressToEdit();
  }, []);

  return (
    <View style={themeController(globalStyles.container)}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header backButton />
        <Text style={themeController(globalStyles.title)}>
          {addressToEdit ? "Editar endereço" : "Adicionar novo endereço"}
        </Text>

        <TouchableOpacity
          onPress={() => handleGetUserAddress()}
          style={themeController(styles.locationButton)}
        >
          <MaterialIcons
            name="my-location"
            size={24}
            color={dynamicTheme.colors.white}
          />
          <Text style={themeController(styles.locationButtonText)}>
            Usar minha localização
          </Text>
        </TouchableOpacity>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input
              label="Nome do endereço"
              value={field.value}
              refInput={field.ref}
              returnKeyType="next"
              onSubmitEditing={() => setFocus("zip_code")}
              inputStyle={styles.inputSpacing}
              error={!!errors?.description}
              helperText={errors?.description?.message}
              placeholder="Ex: Meu apartamento, Casa, Trabalho"
              onChangeText={(text) => field.onChange(text)}
            />
          )}
        />

        <Controller
          name="zip_code"
          control={control}
          render={({ field }) => (
            <MaskedInput
              label="CEP"
              mask="99999-999"
              refInput={field.ref}
              returnKeyType="next"
              onSubmitEditing={() => setFocus("city")}
              value={field.value}
              inputStyle={styles.inputSpacing}
              error={!!errors?.zip_code}
              helperText={errors?.zip_code?.message}
              placeholder="xxxxx-xxx"
              onChangeText={(_, text) => field.onChange(text)}
            />
          )}
        />

        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <Input
              label="Cidade"
              refInput={field.ref}
              returnKeyType="next"
              onSubmitEditing={() => setFocus("state")}
              inputStyle={styles.inputSpacing}
              value={field.value}
              error={!!errors?.city}
              helperText={errors?.city?.message}
              placeholder="Ex: Vieirópolis"
              onChangeText={(text) => field.onChange(text)}
            />
          )}
        />

        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            // <Input
            //   label="Estado"
            //   refInput={field.ref}
            //   returnKeyType="next"
            //   onSubmitEditing={() => setFocus("district")}
            //   inputStyle={styles.inputSpacing}
            //   value={field.value}
            //   error={!!errors?.state}
            //   helperText={errors?.state?.message}
            //   placeholder="Estado"
            //   onChangeText={(text) => field.onChange(text)}
            // />
            <View style={styles.inputSpacing}>
              <Text style={themeController(globalStyles.inputLabel)}>
                Estado
              </Text>
              <Select
                refInput={field.ref}
                data={ufOptions}
                onChange={(selectedUF) => field.onChange(selectedUF)}
                value={field.value ? field.value : ""}
                onBlur={field.onBlur}
              />
              {!!errors?.state && (
                <Text
                  style={themeController(globalStyles.helperTextErrorStyle)}
                >
                  {errors?.state?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          name="district"
          control={control}
          render={({ field }) => (
            <Input
              label="Bairro"
              inputStyle={styles.inputSpacing}
              refInput={field.ref}
              returnKeyType="next"
              onSubmitEditing={() => setFocus("street")}
              value={field.value}
              error={!!errors?.district}
              helperText={errors?.district?.message}
              placeholder="Bairro"
              onChangeText={(text) => field.onChange(text)}
            />
          )}
        />

        <View style={styles.rowInputFields}>
          <Controller
            name="street"
            control={control}
            render={({ field }) => (
              <Input
                label="Logradouro"
                value={field.value}
                refInput={field.ref}
                returnKeyType="next"
                onSubmitEditing={() => setFocus("number")}
                inputStyle={styles.streetInput}
                error={!!errors?.street}
                helperText={errors?.street?.message}
                placeholder="Logradouro"
                onChangeText={(text) => field.onChange(text)}
              />
            )}
          />

          <Controller
            name="number"
            control={control}
            render={({ field }) => (
              <Input
                label="Número"
                value={field.value}
                refInput={field.ref}
                returnKeyType="next"
                onSubmitEditing={() => setFocus("complement")}
                inputStyle={styles.numberInput}
                error={!!errors?.number}
                helperText={errors?.number?.message}
                placeholder="Ex: 104"
                onChangeText={(text) => field.onChange(text)}
              />
            )}
          />
        </View>

        <Controller
          name="complement"
          control={control}
          render={({ field }) => (
            <Input
              label="Complemento"
              value={field.value}
              refInput={field.ref}
              inputStyle={styles.inputSpacing}
              error={!!errors?.complement}
              helperText={errors?.complement?.message}
              placeholder="Complemento"
              onChangeText={(text) => field.onChange(text)}
            />
          )}
        />
        <Button
          title="Confirmar"
          loading={isSubmitting}
          buttonStyle={themeController(styles.registerButton)}
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </View>
  );
};

export default AddAddress;
