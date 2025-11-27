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

  const verifiyTokenExpiration = async () => {
    api.interceptors.response.use(
      (response) => response,

      async (error) => {
        if (error.response.status === 401) {
          await AsyncStorage.clear();
          logout();
        }

        return Promise.reject(error || "Something went wrong");
      }
    );
  };

  useEffect(() => {
    verifiyPermissions();
    verifiyTokenExpiration();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <RequestPermissionsModal
        isVisible={showRequestPermissionsModal}
        setIsVisible={setRequestPermissionsModal}
        permissions={permissionsToRequest}
      />
      {user?.user_id && user?.phone_verified && consumer?.consumer_id ? (
        <AppRoutes />
      ) : (
        <AuthRoutes />
      )}
    </NavigationContainer>
  );
};

export default Routes;
