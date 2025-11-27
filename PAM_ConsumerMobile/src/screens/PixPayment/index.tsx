import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image } from "react-native";
import pixLogo from "./../../assets/img/pix-logo.png";
import { styles } from "./styles";
import * as Clipboard from "expo-clipboard";
import QRCode from "react-native-qrcode-svg";
import {
  useNavigation,
  useRoute,
  RouteProp,
  ParamListBase,
} from "@react-navigation/native";
import { useThemeContext } from "../../hooks/themeContext";
import { globalStyles } from "../../styles/globalStyles";
import Header from "../../components/Header";
import CopyText from "../../components/CopyText";
import Button from "../../components/Button";
import { IPixResponse, Order } from "../../interfaces/Order";
import { useOrder } from "../../hooks/OrderContext";
import { useStatusContext } from "../../hooks/StatusContext";
import { useGlobal } from "../../hooks/GlobalContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface PixPaymentRoute extends RouteProp<ParamListBase> {
  params: {
    pix: IPixResponse;
    order: Order;
  };
}

const PixPayment: React.FC = () => {
  const { goBack, getState } = useNavigation();
  const { replace } = useNavigation<NativeStackNavigationProp<any>>();

  const { params } = useRoute<PixPaymentRoute>();
  const { pix, order } = params;
  const { onGetOrderDetails } = useOrder();
  const { openAlert, closeAlert } = useGlobal();
  const { dynamicTheme, themeController } = useThemeContext();
  const { signalROrderConnection } = useStatusContext();

  const [isCopied, setIsCopied] = useState(false);

  let timerRef = useRef(null);

  const handleExitOnExpiredPix = async () => {
    const timeStampToExpire = new Date(pix.qr_codes[0].expiration_date);
    const nowDate = new Date();

    if (nowDate >= timeStampToExpire) {
      openAlert({
        title: "Código PIX expirado",
        description: `Este código não é mais válido. Por favor, tente realizar o pagamento novamente na seção de pedidos.`,
        type: "warning",
        buttons: {
          cancelButton: false,
          confirmButton: false,
          orientation: "horizontal",
          extraButtons: [
            {
              title: "Ver pedido",
              onPress: () => {
                replace("OrderDetails", { id: order.order_id });
                closeAlert();
              },
            },
            {
              title: "Ok",
              onPress: () => {
                goBack();
                closeAlert();
              },
            },
          ],
        },
      });
      return;
    }

    const timeCountdown = timeStampToExpire.getTime() - nowDate.getTime();

    const timeToGoBack = setTimeout(() => {
      openAlert({
        title: "Código PIX expirado",
        description: `Este código não é mais válido. Por favor, tente realizar o pagamento novamente na seção de pedidos.`,
        type: "warning",
        buttons: {
          cancelButton: false,
          confirmButton: false,
          orientation: "horizontal",
          extraButtons: [
            {
              title: "Ver pedido",
              onPress: () => {
                replace("OrderDetails", { id: order.order_id });
                closeAlert();
              },
            },
            {
              title: "Ok",
              onPress: () => {
                goBack();
                closeAlert();
              },
            },
          ],
        },
      });
    }, timeCountdown);

    timerRef.current = timeToGoBack;
  };

  const onCopyText = async () => {
    setIsCopied(true);

    await Clipboard.setStringAsync(pix.qr_codes[0].text);

    setTimeout(() => {
      setIsCopied((copied) => !copied);
    }, 2000);
  };

  useEffect(() => {
    handleExitOnExpiredPix();

    if (signalROrderConnection) {
      signalROrderConnection.on(
        "OrderStatusChanged",
        async (id, _, status_name) => {
          if (id === order.order_id && status_name === "Pago") {
            const currentScreen = getState().routes[getState().index];

            if (currentScreen.name === "PixPayment") goBack();
            if (timerRef.current) clearInterval(timerRef.current);

            openAlert({
              title: "Pagamento confirmado",
              description: `Recebemos o pagamento do pedido de número #${order.order_number}. Obrigado!`,
              type: "success",
              buttons: {
                cancelButton: false,
                confirmButtonTitle: "Ok",
              },
            });
          }
        }
      );
    }

    return () => {
      onGetOrderDetails(order.order_id);
      clearInterval(timerRef.current);
    };
  }, []);

  return (
    <View
      style={[
        themeController(globalStyles.container),
        themeController(styles.container),
      ]}
    >
      <View style={themeController(styles.content)}>
        <Header backButton />
        <Image style={styles.pixLogo} source={pixLogo} />
        <Text style={themeController(styles.title)}>
          Pedido aguardando pagamento
        </Text>
        <Text style={themeController(styles.description)}>
          Escaneie o código QRCode ou copie o código abaixo para realizar o
          pagamento.
        </Text>

        <CopyText
          containerStyle={themeController(styles.copyCodeContainer)}
          textToCopy={pix.qr_codes[0].text}
        />

        <QRCode size={200} value={pix.qr_codes[0].text} />
      </View>

      <View style={themeController(styles.footer)}>
        <Button
          title={isCopied ? "Copiado!" : "Copiar código"}
          onPress={() => onCopyText()}
        />
        <Button
          buttonTextStyle={themeController(styles.buttonText)}
          buttonStyle={themeController(styles.buttonContainer)}
          title="Voltar"
          onPress={() => goBack()}
        />
      </View>
    </View>
  );
};

export default PixPayment;
