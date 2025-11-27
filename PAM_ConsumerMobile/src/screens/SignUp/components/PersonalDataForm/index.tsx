import React, { useRef, useState } from "react";
import { View, Text } from "react-native";
import { Controller, useForm } from "react-hook-form";
import {
  Input,
  MaskedInput,
  PasswordInput,
} from "../../../../components/Shared";
import { useAuth } from "../../../../hooks/AuthContext";
import { styles } from "./styles";
import Button from "../../../../components/Button";
import PasswordStrengthBar from "../../../../components/PasswordStrengthBar";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { validateCNPJ, validateCPF } from "../../../../utils/validateDocument";
import { mask, unMask } from "react-native-mask-text";

interface PersonalDataFormProps {
  nextStep: () => void;
}

interface PersonalDataForm {
  fullname: string;
  email?: string;
  password: string;
  confirm_password: string;
  phone: string;
  document?: string;
  password_strenght: number;
}

type DocumentMask = "" | "cpf" | "cnpj";

const PersonalDataForm = ({ nextStep }: PersonalDataFormProps) => {
  const personalDataSchema = yup.object().shape({
    fullname: yup.string().required("Campo obrigatório"),
    email: yup.string().email("E-mail inválido").required("Campo obrigatório"),
    phone: yup
      .string()
      .required("Campo obrigatório")
      .min(11, "Insira um número válido"),
    document: yup
      .string()
      .required("Campo obrigatório")
      .test({
        test: (value) =>
          value.length > 14 ? validateCNPJ(value) : validateCPF(value),
        message: "Informe um CPF/CNPJ válido",
      }),
    password: yup.string().required("Campo obrigatório"),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password")], "As senhas não coincidem")
      .required("Campo obrigatório"),
  });

  const {
    control,
    handleSubmit,
    watch,
    setFocus,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PersonalDataForm>({
    resolver: yupResolver(personalDataSchema),
    reValidateMode: "onChange",
  });

  const { setSignUpData, register } = useAuth();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [documentMaskType, setDocumentMaskType] = useState<DocumentMask>("cpf");

  const onSubmit = async (data: PersonalDataForm) => {
    if (passwordStrength !== 4) {
      setError("password_strenght", {
        message: "Sua senha deve atender todos os critérios",
      });
      return;
    }

    const { document, fullname, phone, email, password } = data;

    try {
      await register({
        document: unMask(document, "custom"),
        fullname,
        phone,
        email,
        password,
        roleName: 2,
      });
      // nextStep();
    } catch (error) {}
    // setSignUpData(signUpData => {
    //   return {
    //     ...signUpData,
    //     ...data
    //   }
    // })
  };

  const onError = async () => {
    if (passwordStrength !== 4)
      setError("password_strenght", {
        message: "Sua senha deve atender todos os critérios",
      });
  };

  return (
    <View>
      <Controller
        name="fullname"
        control={control}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Input
            label="Nome completo"
            refInput={ref}
            returnKeyType="next"
            onSubmitEditing={() => setFocus("phone")}
            required
            inputStyle={styles.inputSpacing}
            error={!!errors?.fullname}
            helperText={errors?.fullname?.message}
            placeholder="Ex: Bruno"
            onChangeText={(text) => onChange(text)}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Input
            label="E-mail"
            refInput={ref}
            returnKeyType="next"
            onSubmitEditing={() => setFocus("phone")}
            inputStyle={styles.inputSpacing}
            error={!!errors?.email}
            helperText={errors?.email?.message}
            placeholder="exemplo@email.com"
            onChangeText={(text) => onChange(text)}
          />
        )}
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
            required
            inputStyle={styles.inputSpacing}
            error={!!errors?.phone}
            helperText={errors?.phone?.message}
            placeholder="(xx) xxxxx-xxxx"
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
            onSubmitEditing={() => setFocus("password")}
            label="CPF/CNPJ"
            inputStyle={styles.inputSpacing}
            error={!!errors?.document}
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

      <Controller
        name="password"
        control={control}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <PasswordInput
            refInput={ref}
            returnKeyType="next"
            onSubmitEditing={() => setFocus("confirm_password")}
            label="Senha"
            required
            inputStyle={styles.inputSpacing}
            error={!!errors?.password}
            helperText={errors?.password?.message}
            placeholder="Escolha uma senha segura"
            onChangeText={(text) => onChange(text)}
          />
        )}
      />

      <PasswordStrengthBar
        password={watch("password")}
        onChangeText={(strength) => setPasswordStrength(strength)}
      />

      <Controller
        name="confirm_password"
        control={control}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <PasswordInput
            required
            refInput={ref}
            label="Confirme sua senha"
            inputStyle={styles.inputSpacing}
            error={!!errors?.confirm_password}
            helperText={errors?.confirm_password?.message}
            placeholder="Digite a senha novamente"
            onChangeText={(text) => onChange(text)}
          />
        )}
      />
      {!!errors?.password_strenght && (
        <Text style={styles.passwordStrenghtError}>
          {errors?.password_strenght?.message}
        </Text>
      )}

      <Button
        title="Próximo"
        loading={isSubmitting}
        buttonStyle={styles.registerButton}
        onPress={handleSubmit(onSubmit, onError)}
      />
    </View>
  );
};

export default PersonalDataForm;
