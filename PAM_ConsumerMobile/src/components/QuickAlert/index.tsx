import React from "react";
import { Text, TouchableOpacity, View, Modal } from "react-native";
import { useGlobal } from "../../hooks/GlobalContext";
import { styles } from "./styles";
import LottieView from "lottie-react-native";

import errorAnimation from "../../assets/lottiefiles/error.json";
import doneAnimation from "../../assets/lottiefiles/done.json";
import warningAnimation from "../../assets/lottiefiles/warning.json";
import { useThemeContext } from "../../hooks/themeContext";

const QuickAlert = () => {
  const { isOpenedAlert, alertContent, closeAlert } = useGlobal();
  const { dynamicTheme, themeController } = useThemeContext();

  const {
    cancelButtonTitle,
    cancelButton,
    confirmButton,
    confirmButtonTitle,
    onConfirm,
    onCancel,
    orientation,
    extraButtons,
  } = alertContent?.buttons;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={isOpenedAlert}
      statusBarTranslucent
    >
      <View style={themeController(styles.container)}>
        <View style={themeController(styles.content)}>
          <View style={themeController(styles.animationContainer)}>
            <LottieView
              autoPlay
              style={[
                alertContent.type === "success"
                  ? themeController(styles.sucessSize)
                  : alertContent.type === "error"
                  ? themeController(styles.errorSize)
                  : themeController(styles.warningSize),
                { aspectRatio: 1 / 1 },
              ]}
              source={
                alertContent.type === "success"
                  ? doneAnimation
                  : alertContent.type === "error"
                  ? errorAnimation
                  : warningAnimation
              }
              loop
              resizeMode="contain"
            />
          </View>

          <Text style={themeController(styles.title)}>
            {alertContent.title}
          </Text>
          <Text style={themeController(styles.description)}>
            {alertContent.description}
          </Text>

          {(cancelButton || confirmButton || extraButtons?.length > 0) && (
            <View
              style={[
                themeController(styles.buttonsContainer),
                {
                  flexDirection: orientation === "vertical" ? "column" : "row",
                  gap: orientation === "horizontal" ? 16 : 8,
                },
              ]}
            >
              {extraButtons?.length > 0 &&
                extraButtons?.map((button, index) => (
                  <TouchableOpacity
                    key={index.toString()}
                    style={themeController(styles.extraButton)}
                    {...button}
                  >
                    <Text style={themeController(styles.extraButtonText)}>
                      {button.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              {cancelButton && (
                <TouchableOpacity
                  style={themeController(styles.cancelButton)}
                  onPress={() => {
                    onCancel && onCancel();
                    closeAlert();
                  }}
                >
                  <Text style={themeController(styles.cancelButtonText)}>
                    {cancelButtonTitle || "Cancelar"}
                  </Text>
                </TouchableOpacity>
              )}

              {confirmButton && (
                <TouchableOpacity
                  style={[themeController(styles.confirmButton)]}
                  onPress={() => {
                    onConfirm && onConfirm();
                    closeAlert();
                  }}
                >
                  <Text style={themeController(styles.confirmButtonText)}>
                    {confirmButtonTitle || "Confirmar"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default QuickAlert;
