import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { Avatar, Input, MaskedInput } from "../../../components/Shared";
import { BlueHeader } from "../../../components/BlueHeader";
import { Controller, useForm } from "react-hook-form";
import { styles } from "./styles";

import { Feather, MaterialIcons } from "@expo/vector-icons";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../../hooks/AuthContext";
import { theme } from "../../../styles/theme";
import Cam from "../../../components/Cam";
import { useGlobal } from "../../../hooks/GlobalContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { mask, unMask } from "react-native-mask-text";
import { useThemeContext } from "../../../hooks/themeContext";
import { useUser } from "../../../hooks/UserContext";
interface PersonalDataForm {
  avatar: string;
  name: string;
  email: string;
  phone: string;
  document: string;
}

type DocumentMask = "" | "cpf" | "cnpj";

const MyAccount: React.FC = () => {
  const { goBack, replace } = useNavigation<NativeStackNavigationProp<any>>();
  const { openCam, setOpenCam } = useGlobal();
  const { user, updateUser, photoProfile, setPhotoProfile, loading } =
    useAuth();
  const { consumer } = useUser();
  const [editable, setEditable] = useState<boolean>(false);
  const { dynamicTheme, setDynamicTheme, themeController } = useThemeContext();

  const [documentMaskType, setDocumentMaskType] = useState<DocumentMask>("cpf");

  const personalDataSchema = yup.object().shape({
    avatar: yup.string(),
    name: yup.string(),
    email: yup.string().email("E-mail inválido"),
    phone: yup
      .string()
      .required("Campo obrigatório")
      .min(11, "Insira um número válido"),
    document: yup.string().required("Campo obrigatório"),
  });

  const {
    control,
    handleSubmit,
    watch,
    setFocus,
    formState: { errors },
  } = useForm<PersonalDataForm>({
    resolver: yupResolver(personalDataSchema),
    reValidateMode: "onChange",
    defaultValues: {
      document: consumer.document,
    },
  });

  const handleUpdateUser = async (data: PersonalDataForm) => {
    if (editable) {
      const { document, name, phone, email, avatar } = data;

      try {
        await updateUser({
          user_id: user.user_id,
          email: email || user.email,
          phone: phone,
          fullname: name || user.profile.fullname,
          avatar: {
            uri: avatar,
            name: `${user.user_id}.jpg`,
            type: "image/jpeg",
          },
          document: document,
          phone_verified: user.phone_verified,
          active: true,
        });
      } catch (error) {
        // console.log(error);
        setEditable(true);
      }
      setEditable(!editable);
    }
  };

  // console.log(consumer);

  // Verificar se o usuário está autenticado
  useEffect(() => {
    if (!user?.user_id) {
      console.log("❌ MyAccount - Usuário não autenticado, redirecionando para login");
      replace("PhoneAuth");
      return;
    }
    console.log("✅ MyAccount - Usuário autenticado:", user.user_id);
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (openCam) {
        setOpenCam(false);

        return true;
      }

      return false;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [openCam]);

  // Se não estiver autenticado, não renderiza nada
  if (!user?.user_id) {
    return null;
  }

  if (openCam)
    return (
      <Controller
        name="avatar"
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <Avatar
            refInput={ref}
            isOpenCam={true}
            uri={value}
            onSelectPicture={onChange}
            onclose={(result) => setOpenCam(result)}
            size={120}
            editable={editable}
            indicatorColor={dynamicTheme.colors.primary}
          />
        )}
        defaultValue={user?.profile?.avatar || ""}
      />
    );

  const editButton = editable ? (
    <TouchableOpacity onPress={handleSubmit(handleUpdateUser)}>
      {!loading ? (
        <MaterialIcons name={"done"} size={24} color="#FFFFFF" />
      ) : (
        <ActivityIndicator size={18} color="#FFFFFF" />
      )}
    </TouchableOpacity>
  ) : (
    <TouchableOpacity onPress={() => setEditable(!editable)}>
      <Feather name="edit" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <BlueHeader title="Meus dados" rightComponent={editButton} />
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Controller
          name="avatar"
          defaultValue={user?.profile?.avatar}
          control={control}
          render={({ field: { onChange, value, ref } }) => (
            <Avatar
              refInput={ref}
              isOpenCam={openCam}
              uri={value}
              onSelectPicture={onChange}
              onclose={(result) => setOpenCam(result)}
              size={120}
              editable={editable}
              indicatorColor={dynamicTheme.colors.primary}
            />
          )}
        />
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              label="Nome"
              value={value}
              refInput={ref}
              returnKeyType="next"
              onSubmitEditing={() => setFocus("email")}
              inputStyle={styles.inputSpacing}
              error={!!errors?.name}
              helperText={errors?.name?.message}
              placeholder="Ex: Bruno"
              editable={editable}
              defaultValue={user.profile.fullname}
              onChangeText={onChange}
            />
          )}
          defaultValue={user.profile.fullname}
        />
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              label="E-mail"
              refInput={ref}
              value={value}
              returnKeyType="next"
              onSubmitEditing={() => setFocus("phone")}
              inputStyle={styles.inputSpacing}
              error={!!errors?.email}
              helperText={errors?.email?.message}
              placeholder="exemplo@email.com"
              editable={editable}
              defaultValue={user.email}
              onChangeText={onChange}
            />
          )}
          defaultValue={user.email}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <MaskedInput
              refInput={ref}
              returnKeyType="next"
              onSubmitEditing={() => setFocus("document")}
              label="Celular"
              mask="(99) 99999-9999"
              maxLength={15}
              inputStyle={styles.inputSpacing}
              error={!!errors?.phone}
              helperText={errors?.phone?.message}
              placeholder="(xx) xxxxx-xxxx"
              editable={editable}
              defaultValue={user.phone}
              onChangeText={(_, text) => onChange(text)}
              keyboardType="numeric"
            />
          )}
        />

        <Controller
          name="document"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              refInput={ref}
              returnKeyType="next"
              label="Documento"
              inputStyle={styles.inputSpacing}
              error={!!errors?.document?.message}
              helperText={errors?.document?.message}
              placeholder="xxx.xxx.xxx-xx"
              keyboardType="numeric"
              value={
                documentMaskType === "cpf"
                  ? mask(value, "999.999.999-99")
                  : mask(value, "99.999.999/9999-99")
              }
              onChangeText={(text) => {
                if (text.length > 14) setDocumentMaskType("cnpj");
                else setDocumentMaskType("cpf");

                onChange(text);
              }}
            />
          )}
        />
      </ScrollView>
    </View>
  );
};

export default MyAccount;
