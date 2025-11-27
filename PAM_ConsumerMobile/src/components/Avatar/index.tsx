import React, { useEffect, useState } from 'react';
import { Alert, Image, View, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, CameraType } from 'expo-camera';
import { theme } from '../../styles/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { useGlobal } from '../../hooks/GlobalContext';
import Cam from '../Cam';
import { useThemeContext } from '../../hooks/themeContext';

interface AvatarProps {
  refInput?: any,
  uri: string,
  size: number,
  isOpenCam?: boolean,
  onSelectPicture?: (uri: string | File | ImagePicker.ImagePickerAsset[]) => void,
  onclose?: (closed: boolean) => void,
  indicatorColor?: string,
  editable?: boolean
}

const Avatar = ({ uri, size, onSelectPicture, indicatorColor = '#eb1717', editable = true, isOpenCam = false, onclose }: AvatarProps) => {

  const { openAlert, setIsOpenedAlert, openCam, setOpenCam } = useGlobal();
  const { dynamicTheme, setDynamicTheme, themeController } = useThemeContext();
  const [pictureUri, setPictureUri] = useState(uri);

  const imageOptions: ImagePicker.ImagePickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    quality: 1,
    aspect: [1, 1],
    base64: true
  }

  const TakePicture = () => {
    setOpenCam(true);
  }
  useEffect(() => {
    setPictureUri(uri);
  }, [uri]);

  const takeLibraryPicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync(imageOptions);

    if (!result.canceled) {
      setPictureUri(result.assets[0].uri);
      const file = new File([result.assets[0].base64], `${result.assets[0].uri.replace('file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540meugas%252Fpam/ImagePicker/', '')}`, {
        type: result.assets[0].type,
        lastModified: Number(new Date().getTime())
      });
      onSelectPicture(result.assets[0].uri);
    }
  }

  const uploadImage = () => {
    openAlert({
      title: 'Escolha uma opção',
      description: 'Deseja tirar uma foto ou escolher da galeria?',
      type: 'warning',
      buttons: {
        orientation: 'vertical',
        confirmButton: false,
        extraButtons: [
          {
            title: 'Tirar uma foto',
            onPress: () => {
              TakePicture();
              setIsOpenedAlert(false);
            }
          },
          {
            title: 'Escolher da galeria',
            onPress: () => {
              takeLibraryPicture();
              setIsOpenedAlert(false);
            }
          },
        ]
      }
    })
  }

  return (
    openCam ?
      <Cam onTakePicture={(file: string) => {
        setPictureUri(file)
        onSelectPicture(file);
        onclose(true);
        setOpenCam(false);
      }}
      />
      :
      <TouchableOpacity style={styles.container} disabled={!editable} onPress={() => uploadImage()}>
        {
          pictureUri ?
            <View style={styles.imageContainer}>
              {
                editable &&
                <TouchableOpacity style={styles.editIndicator} onPress={() => uploadImage()}>
                  <MaterialCommunityIcons name="pencil" style={{ fontSize: size / 6, color: indicatorColor }} />
                </TouchableOpacity>
              }
              <Image source={{ uri: pictureUri }} style={{ width: size, height: size, borderRadius: 64 }} />
            </View>
            :
            <View
              style={[
                styles.withoutImageContainer,
                {
                  width: size,
                  height: size,
                }]}
            >
              <MaterialCommunityIcons name="camera" style={{ fontSize: size / 3, color: 'grey' }} />
            </View>
        }
      </TouchableOpacity>
  );
}

export default Avatar;
