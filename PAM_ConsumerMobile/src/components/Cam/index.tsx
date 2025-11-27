import { Camera, CameraType } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { useGlobal } from "../../hooks/GlobalContext";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { styles } from "./styles";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import requestingPermissionAnimation from "./../../assets/lottiefiles/data.json";
import { theme } from "../../styles/theme";
import Button from "../Button";
import { globalStyles } from "../../styles/globalStyles";
import { useThemeContext } from "../../hooks/themeContext";

const Cam = ({ onTakePicture }) => {
  const { setOpenCam } = useGlobal();
  const { goBack } = useNavigation();
  const { dynamicTheme, themeController } = useThemeContext();

  const [loadingPicture, setLoadingPicture] = useState(false);
  const [type, setType] = useState(CameraType.back);
  const [hasCameraPermission, setHasCameraPermission] = useState<Boolean>();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState<Boolean>();
  const [photo, setPhoto] = useState();

  let cameraRef = useRef<any>();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return (
      <View style={themeController(styles.requestingPermissionsContainer)}>
        <LottieView
          autoPlay
          style={{
            width: 120,
          }}
          source={requestingPermissionAnimation}
          loop
          resizeMode="contain"
        />
      </View>
    );
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Não foi fornecida nenhuma permissão. Por favor, permita o acesso a
        câmera e tente novamente.
      </Text>
    );
  }

  let takePic = async () => {
    setLoadingPicture((loading) => !loading);
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
    setLoadingPicture((loading) => !loading);
  };

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const pictureHandler = (uri: string) => {
    if (onTakePicture) {
      onTakePicture(uri);
    }
  };

  if (photo) {
    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
      pictureHandler(photo.uri);
      // setOpenCam(false);
    };

    return (
      <SafeAreaView style={themeController(styles.container)}>
        <Image
          style={styles.preview}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />
        <View style={themeController(styles.pictureContent)}>
          <Text style={themeController(globalStyles.subtitle)}>
            Uau! Sua foto ficou incrível
          </Text>
          <Text
            style={[
              themeController(globalStyles.description),
              themeController(styles.pictureDescription),
            ]}
          >
            Você pode salva-la como sua nova foto de perfil. E caso não tenha
            gostado, pode descartar e tirar outra foto. Escolha o que preferir.
          </Text>

          <View style={themeController(styles.pictureButtonsContainer)}>
            <TouchableOpacity
              style={themeController(styles.discartPictureButton)}
              onPress={() => setPhoto(undefined)}
            >
              <Text style={themeController(styles.discartPictureButtonText)}>
                Descartar
              </Text>
            </TouchableOpacity>
            {hasMediaLibraryPermission ? (
              <TouchableOpacity
                style={themeController(styles.savePictureButton)}
                onPress={savePhoto}
              >
                <Text style={themeController(styles.savePictureButtonText)}>
                  Salvar
                </Text>
              </TouchableOpacity>
            ) : undefined}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const onCancelTakePicture = () => {
    setOpenCam(false);
  };

  return (
    <>
      {loadingPicture && (
        <View style={themeController(styles.loadingPictureContainer)}>
          <ActivityIndicator
            size={50}
            color={theme.colors.white}
            style={themeController(styles.loadingPicture)}
          />
          <Text style={themeController(styles.loadingPictureText)}>
            Não se mexa...
          </Text>
        </View>
      )}
      <View style={themeController(styles.container)}>
        <StatusBar style="auto" />
        <Camera
          // ratio={"16:9"}
          style={themeController(styles.cameraContent)}
          type={type}
          ref={cameraRef}
        />
        <View style={themeController(styles.cameraButtonsContainer)}>
          <TouchableOpacity
            onPress={() => onCancelTakePicture()}
            disabled={loadingPicture}
            style={themeController(styles.ToggleButtonContainer)}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={dynamicTheme.colors.white}
            />
          </TouchableOpacity>

          <TouchableOpacity
            disabled={loadingPicture}
            onPress={takePic}
            style={themeController(styles.buttonContainer)}
          >
            <View style={themeController(styles.buttonContent)} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleCameraType}
            style={themeController(styles.ToggleButtonContainer)}
            disabled={loadingPicture}
          >
            <MaterialIcons
              name="flip-camera-ios"
              size={24}
              color={dynamicTheme.colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Cam;
