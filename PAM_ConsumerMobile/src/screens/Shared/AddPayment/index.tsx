import React, { useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { globalStyles } from "../../../styles/globalStyles";
import { Button, Header, Input, MaskedInput } from "../../../components/Shared";
import { Controller, useForm } from "react-hook-form";
import { styles } from "./styles";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUser } from "../../../hooks/UserContext";
import { ICreateCard } from "../../../interfaces/User";
import { useGlobal } from "../../../hooks/GlobalContext";
import { useNavigation } from "@react-navigation/native";
import { formatValidityCard } from "../../../utils/formatValidityCard";
import { RootStackParams } from "../../../interfaces/RouteTypes";
import CreditCard from "../../../components/CreditCard";
import { mask } from "react-native-mask-text";
import { useThemeContext } from "../../../hooks/themeContext";
import { REACT_APP_PAGSEGURO_PUBLIC_KEY } from "@env";
import { PagSeguro } from "../../../utils/pagSeguroScript";

const AddPayment: React.FC<RootStackParams<"AddPayment">> = ({ route }) => {
  const { createCard, updateCard } = useUser();
  const { dynamicTheme, setDynamicTheme, themeController } = useThemeContext();
  const { openAlert } = useGlobal();
  const { goBack } = useNavigation();

  type DocumentMask = "" | "cpf" | "cnpj";

  const { params } = route;

  const cardSchema = yup.object().shape({
    name: yup
      .string()
      .test({
        test: (value) => value.trim().split(" ").length >= 2,
        message: "Digite pelo menos um sobrenome",
      })
      .required("Campo obrigatório"),
    number: yup.string().required("Campo obrigatório"),
    validity: yup.string().required("Campo obrigatório"),
    document: yup.string().required("Campo obrigatório"),
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    setFocus,
    getFieldState,
    formState: { errors, isSubmitting },
  } = useForm<ICreateCard>({
    resolver: yupResolver(cardSchema),
    reValidateMode: "onChange",
    defaultValues: {
      name: params?.cardToEdit?.name,
      document: params?.cardToEdit?.document,
      number: params?.cardToEdit?.number,
      validity:
        params?.cardToEdit && formatValidityCard(params?.cardToEdit?.validity),
    },
  });

  const [number, setNumber] = useState<string>();
  const [name, setName] = useState<string>();
  const [expire, setExpire] = useState<string>();
  const [cvc, setCvc] = useState<string>();

  const onSubmit = async (data: ICreateCard) => {
    const expirationCurrentYear = new Date();
    const expirationStartYear = expirationCurrentYear
      .getFullYear()
      .toString()
      .slice(0, 2);
    const [expirationMonth, expirationYear] = data.validity.split("/");
    data.validity = `${expirationMonth}/${expirationStartYear}${expirationYear}`;

    if (params?.cardToEdit) {
      delete params?.cardToEdit.created_at;
      delete params?.cardToEdit.created_by;
      delete params?.cardToEdit.updated_at;
      delete params?.cardToEdit.updated_by;
    }

    const result: any = params?.cardToEdit
      ? await updateCard({ ...params?.cardToEdit, ...data })
      : await createCard(data);

    if (result?.status === 200) {
      openAlert({
        title: params?.cardToEdit ? "Cartão atualizado" : "Cartão cadastrado",
        description: "Agora você pode aproveitar e realizar suas compras.",
        type: "success",
        buttons: {
          onConfirm: () => goBack(),
          confirmButtonTitle: "Ok",
          cancelButton: false,
        },
      });
    }
  };
  const [documentMaskType, setDocumentMaskType] = useState<DocumentMask>("cpf");

  return (
    <View style={themeController(globalStyles.container)}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header backButton />
        <View style={themeController(styles.paymentsContainer)}>
          <Text style={themeController(globalStyles.subtitle)}>
            {route?.params?.type}
          </Text>
          <Text style={themeController(globalStyles.description)}>
            Consulte as bandeiras e bancos disponíveis.
          </Text>
          <View
            style={[
              themeController(styles.paymentsContainer),
              themeController(styles.cardContainer),
            ]}
          >
            <CreditCard
              type=""
              imageFront={require("../../../assets/img/card-front.png")}
              imageBack={require("../../../assets/img/card-back.png")}
              shiny={false}
              bar={false}
              focused={false}
              number={number}
              name={name}
              expiry={expire}
              cvc={cvc}
            />
          </View>

          <Controller
            name="number"
            control={control}
            render={({ field }) => (
              <MaskedInput
                label="Número do cartão"
                value={field.value}
                refInput={field.ref}
                required
                onSubmitEditing={() => setFocus("name")}
                returnKeyType="next"
                error={!!errors?.number}
                helperText={errors?.number?.message}
                mask="9999 9999 9999 9999"
                placeholder="XXXX XXXX XXXX XXXX"
                onChangeText={(maskedText, text) => {
                  setNumber(text);
                  field.onChange(maskedText);
                }}
                keyboardType="numeric"
              />
            )}
          />

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                required
                label="Titular"
                onSubmitEditing={() => setFocus("validity")}
                returnKeyType="next"
                refInput={field.ref}
                value={field.value}
                inputStyle={styles.inputSpacing}
                error={!!errors?.name}
                helperText={errors?.name?.message}
                placeholder="Nome do titular do cartão"
                onChangeText={(text) => {
                  setName(text);
                  field.onChange(text);
                }}
              />
            )}
          />

          <Controller
            name="validity"
            control={control}
            render={({ field }) => (
              <MaskedInput
                required
                refInput={field.ref}
                label="Data de validade"
                onSubmitEditing={() => setFocus("cvv")}
                returnKeyType="next"
                value={field.value}
                inputStyle={styles.inputSpacing}
                error={!!errors?.validity}
                helperText={errors?.validity?.message}
                mask="99/99"
                placeholder="MM/AA"
                onChangeText={(text) => {
                  setExpire(text);
                  field.onChange(text);
                }}
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
                error={!!errors?.document}
                helperText={errors?.document?.message}
                maxLength={24}
                placeholder="Insira o CPF/CNPJ do titular"
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
        </View>
        <View style={{ paddingBottom: 10 }}>
          <Button
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            title="Salvar"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AddPayment;
