import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  cameraContent: {
    aspectRatio: 9 / 16,
    flex: 1,
  },

  cameraButtonsContainer: {
    position: "absolute",
    zIndex: 99,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    bottom: Dimensions.get("screen").height * 0.1,
  },

  pictureContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 24,
  },

  pictureButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginBottom: 16,
  },

  pictureDescription: {
    textAlign: "center",
    marginBottom: 16,
  },

  ToggleButtonContainer: {
    backgroundColor: "#ffffff50",
    alignItems: "center",
    alignContent: "center",
    padding: 8,
    borderRadius: 45,
  },

  loadingPictureContainer: {
    justifyContent: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.black + "90",
    zIndex: 99,
  },

  loadingPicture: {},

  loadingPictureText: {
    lineHeight: 20,
    fontFamily: theme.fonts.regular,
    color: theme.colors.white,
    marginTop: 12,
  },

  buttonContainer: {
    borderRadius: 64,
    borderWidth: 3,
    borderColor: theme.colors.white,
    borderStyle: "solid",
    padding: 5,
  },

  buttonContent: {
    backgroundColor: theme.colors.white,
    height: 50,
    width: 50,
    borderRadius: 45,
  },

  preview: {
    alignSelf: "stretch",
    flex: 1,
  },

  requestingPermissionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  savePictureButton: {
    backgroundColor: theme.colors.primary,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },

  discartPictureButton: {
    backgroundColor: theme.colors.danger,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },

  savePictureButtonText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.white,
    lineHeight: 20,
  },

  discartPictureButtonText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.white,
    lineHeight: 20,
  },
});
