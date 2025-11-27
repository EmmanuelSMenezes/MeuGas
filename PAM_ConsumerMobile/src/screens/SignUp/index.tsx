import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./styles";
import PersonalDataForm from "./components/PersonalDataForm";
import AddressDataForm from "./components/AddressDataForm";
import { FormProvider, useForm } from "react-hook-form";
import { Steps, Header } from "../../components/Shared";
import { useThemeContext } from "../../hooks/themeContext";

const SignUp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const switchTab = (tab: number) => setCurrentTab(tab);
  const methods = useForm();

  const TabOptions = [
    {
      id: 1,
      label: "Identificação",
      tab: "PersonalDataForm",
      component: () => <PersonalDataForm nextStep={() => switchTab(1)} />,
      action: () => {},
    },
    {
      id: 2,
      label: "Endereço",
      tab: "AddressDataForm",
      component: () => <AddressDataForm />,
      action: () => {},
    },
  ];

  const { dynamicTheme, themeController } = useThemeContext();

  const TabContent = TabOptions[currentTab].component;

  return (
    <View style={themeController(globalStyles.container)}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header backButton />
        <Text style={themeController(styles.title)}>Criar conta</Text>
        <Steps ordered currentTab={currentTab} tabs={TabOptions} />
        <FormProvider {...methods}>
          <TabContent />
        </FormProvider>
      </ScrollView>
    </View>
  );
};

export default SignUp;
