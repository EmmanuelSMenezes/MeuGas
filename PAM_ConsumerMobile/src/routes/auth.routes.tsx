import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React  from 'react';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import OTPVerification from '../screens/Shared/OTPVerification';
import RecoverPassword from '../screens/RecoverPassword';
import { RootStackParamList } from '../interfaces/RouteTypes';
import OTPVerificationForgotPassword from '../screens/Shared/OTPVerificationForgotPassword';
import NewPassword from '../screens/Shared/NewPassword';
import Profile from '../screens/Profile';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthRoutes: React.FC = () => {

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="SignIn"
    >
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name='RecoverPassword' component={RecoverPassword} />
      <Stack.Screen name="OTPVerification" component={OTPVerification} />
      <Stack.Screen name="OTPVerificationForgotPassword" component={OTPVerificationForgotPassword} />
      <Stack.Screen name="NewPassword" component={NewPassword} />
    </Stack.Navigator>
  );
};

export default AuthRoutes;
