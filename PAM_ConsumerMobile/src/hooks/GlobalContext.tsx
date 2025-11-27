import { createContext, useContext, useState } from 'react';
import { TouchableOpacityProps } from 'react-native/types';

interface GlobalProviderProps {
  children: React.ReactNode;
}

interface NewButtonProps extends TouchableOpacityProps {
  title: string,
}

interface ButtonsProps {
  orientation?: 'horizontal' | 'vertical',
  extraButtons?: NewButtonProps[],
  cancelButton?: boolean,
  confirmButton?: boolean,
  cancelButtonTitle?: string,
  confirmButtonTitle?: string,
  onConfirm?: () => void,
  onCancel?: () => void,
}

interface AlertContent {
  type: 'success' | 'error' | 'warning' | 'confirmation',
  title: string,
  description?: string,
  buttons?: ButtonsProps
}

interface GlobalProviderValues {
  isOpenedAlert: boolean,
  openCam: boolean,
  setOpenCam:React.Dispatch<React.SetStateAction<boolean>>,
  setIsOpenedAlert: React.Dispatch<React.SetStateAction<boolean>>,
  alertContent: AlertContent,
  setAlertContent: React.Dispatch<React.SetStateAction<AlertContent>>,
  currentAppTab: string,
  setCurrentAppTab: React.Dispatch<string>,

  openAlert: (data: AlertContent) => void,
  closeAlert: () => void,
}

const GlobalContext = createContext({} as GlobalProviderValues);

const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const defaultContent: AlertContent = {
    type: 'warning',
    title: '',
    description: '',
    buttons: {
      orientation: 'horizontal',
      cancelButton: true,
      cancelButtonTitle: '',
      onCancel: () => { },
      confirmButton: true,
      confirmButtonTitle: '',
      onConfirm: () => { },
      extraButtons: []
    }
  }
  const [isOpenedAlert, setIsOpenedAlert] = useState<boolean>(false);
  const [openCam,setOpenCam] = useState<boolean>(false);
  const [alertContent, setAlertContent] = useState<AlertContent>(defaultContent);
  const [currentAppTab, setCurrentAppTab] = useState<string>("");

  const openAlert = (data: AlertContent) => {
    data.buttons.cancelButton ??= true
    data.buttons.confirmButton ??= true

    setAlertContent(data);
    setIsOpenedAlert(opened => !opened)
  };

  const closeAlert = () => {
    // setAlertContent(defaultContent);
    setIsOpenedAlert(opened => !opened)
  };


  const contextValues = {
    isOpenedAlert,
    setIsOpenedAlert,
    alertContent,
    setAlertContent,
    openAlert,
    closeAlert,
    openCam,
    setOpenCam,
    currentAppTab,
    setCurrentAppTab
  };

  return (
    <GlobalContext.Provider value={contextValues}>
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobal = () => {
  const context = useContext(GlobalContext);

  return context;
};

export { useGlobal, GlobalProvider };
