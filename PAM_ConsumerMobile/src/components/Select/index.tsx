import { Picker } from "@react-native-picker/picker";
import React, { ReactNode, useEffect } from "react";

import { View } from "react-native";
import styles from "./styles";
import { theme } from "../../styles/theme";
import { useThemeContext } from "../../hooks/themeContext";

export type IData = {
  item: string;
  label: string;
};

interface ISelect {
  refInput?: any;
  onBlur?: () => void;
  onChange: (e?: any, index?: number) => void;
  value: string;
  data: IData[];
  height?: number;
  width?: number;
  placeholder?: string;
}
const Select = ({
  refInput,
  onBlur,
  onChange,
  value,
  data,
  height = 58,
  width = 100,
}: ISelect) => {
  const { dynamicTheme, themeController } = useThemeContext();
  
  return (
    <View
      style={[
        themeController(styles.container),
        { height: height, width: `${width}%` },
      ]}
    >
      <Picker
        ref={refInput}
        onBlur={onBlur}
        selectedValue={value}
        onValueChange={onChange}
        style={themeController(styles.pickerContent)}
        dropdownIconRippleColor={dynamicTheme.colors.gray}
        dropdownIconColor={dynamicTheme.colors.gray}
      >
        <Picker.Item
          key={"unique"}
          label={"Selecione uma opção"}
          value={""}
          fontFamily={dynamicTheme.fonts.regular}
          color={dynamicTheme.colors.gray}
          style={themeController(styles.pickerItem)}
        />
        {data?.map((data, index) => (
          <Picker.Item
            key={index}
            label={data.label}
            value={data.item}
            fontFamily={dynamicTheme.fonts.bold}
            color={dynamicTheme.colors.gray}
            style={themeController(styles.pickerItem)}
          />
        ))}
      </Picker>
    </View>
  );
};

export default Select;
