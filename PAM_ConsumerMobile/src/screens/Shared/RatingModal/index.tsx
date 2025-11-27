import React, { useState } from "react";
import { Modal, Text, View, TouchableOpacity } from "react-native";
import { Input, Rating } from "../../../components/Shared";
import { globalStyles } from "../../../styles/globalStyles";
import { styles } from "./styles";
import { Controller, useForm } from "react-hook-form";
import { useGlobal } from "../../../hooks/GlobalContext";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useReputation } from "../../../hooks/ReputationContext";
import { Rating as RatingType } from "../../../interfaces/Reputation";
import { useAuth } from "../../../hooks/AuthContext";
import { useThemeContext } from "../../../hooks/themeContext";

interface RatingModalProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  branchId: string;
  onEvaluateStore?: () => void;
}

interface EvaluatePartner {
  rating_value: RatingType;
  note: string;
}

const RatingModal = ({
  isVisible,
  setIsVisible,
  branchId,
  onEvaluateStore,
}: RatingModalProps) => {
  const { user } = useAuth();

  const evaluatePartnerSchema = yup.object().shape({
    rating_value: yup
      .number()
      .moreThan(0, "Avalie com pelo menos 1 estrela")
      .required("Campo obrigatório"),
    note: yup.string(),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EvaluatePartner>({
    resolver: yupResolver(evaluatePartnerSchema),
    reValidateMode: "onChange",
    defaultValues: {
      rating_value: 0,
    },
  });

  const { openAlert } = useGlobal();
  const { evaluatePartner } = useReputation();
  const { dynamicTheme, themeController } = useThemeContext();

  const onCancelRating = () => {
    reset();
    setIsVisible(false);
  };

  const onSubmitRating = async (data: EvaluatePartner) => {
    await evaluatePartner({
      note: data.note || "",
      rating_value: data.rating_value,
      branch_id: branchId,
      created_by: user.user_id,
    });
    onCancelRating();
    openAlert({
      title: "Obrigado!",
      description: "Sua avaliação foi cadastrada",
      type: "success",
      buttons: {
        cancelButton: false,
        confirmButtonTitle: "Ok",
        onConfirm: () => onEvaluateStore(),
      },
    });
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      statusBarTranslucent
    >
      <View style={themeController(styles.container)}>
        <View style={themeController(styles.content)}>
          <View style={themeController(styles.evaluatePartnerContainer)}>
            <Text style={themeController(styles.evaluatePartnerTitle)}>
              Avalie a loja
            </Text>

            <Controller
              name="rating_value"
              control={control}
              render={({ field }) => (
                <Rating
                  value={field.value || 0}
                  onRate={(stars) => field.onChange(stars)}
                  containerStyle={themeController(styles.starsContainer)}
                />
              )}
            />

            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <Input
                  multiline
                  textInputStyle={themeController(styles.noteInput)}
                  value={field.value}
                  refInput={field.ref}
                  error={!!errors?.note}
                  helperText={errors?.note?.message}
                  placeholder="Comente sobre a loja (opcional)"
                  onChangeText={(text) => field.onChange(text)}
                />
              )}
            />

            {errors.rating_value && (
              <Text style={themeController(globalStyles.helperTextErrorStyle)}>
                {errors.rating_value.message}
              </Text>
            )}

            <View style={themeController(styles.buttonsContainer)}>
              <TouchableOpacity
                style={themeController(styles.confirmButton)}
                onPress={handleSubmit(onSubmitRating)}
              >
                <Text style={themeController(styles.confirmButtonText)}>
                  Avaliar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={themeController(styles.cancelButton)}
                onPress={() => onCancelRating()}
              >
                <Text style={themeController(styles.cancelButtonText)}>
                  Não, obrigado
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RatingModal;
