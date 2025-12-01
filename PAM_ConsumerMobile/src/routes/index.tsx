import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import AppRoutes from "./app.routes";
import AuthRoutes from "./auth.routes";
import { navigationRef } from "./rootNavigation";
import { useUser } from "../hooks/UserContext";
import { PermissionResources } from "../interfaces/Utils";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import RequestPermissionsModal from "../screens/Shared/RequestPermissionModal";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Routes: React.FC = () => {
  const { user, logout } = useAuth();
  const { consumer } = useUser();

  const [permissionsToRequest, setPermissionsToRequest] = useState<
    PermissionResources[]
  >([]);
  const [showRequestPermissionsModal, setRequestPermissionsModal] =
    useState(false);

  const verifiyPermissions = async () => {
    const permissions: PermissionResources[] = ["camera", "location"];

    const result = await Promise.all([
      Camera.getCameraPermissionsAsync(),
      Location.getForegroundPermissionsAsync(),
    ]);

    const permissionsToRequest = result
      .map(({ status }, index) =>
        status !== "granted" ? permissions[index] : undefined
      )
      .filter((permission) => permission);

    if (permissionsToRequest.length > 0) {
      setRequestPermissionsModal(true);
      setPermissionsToRequest(permissionsToRequest);
    }
  };

  useEffect(() => {
    verifiyPermissions();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <RequestPermissionsModal
        isVisible={showRequestPermissionsModal}
        setIsVisible={setRequestPermissionsModal}
        permissions={permissionsToRequest}
      />
      {/* App sempre abre nas rotas principais, login só é necessário no checkout */}
      <AppRoutes />
    </NavigationContainer>
  );
};

export default Routes;
