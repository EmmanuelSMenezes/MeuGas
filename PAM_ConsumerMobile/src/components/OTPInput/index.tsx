import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput } from 'react-native';
import { styles } from './styles';
import * as Clipboard from 'expo-clipboard'
import { useThemeContext } from '../../hooks/themeContext';

interface OTPInputProps {
  pinLength: number,
  onChangeCode: (code: string) => void,
  autoFocus?: boolean,
}

const OTPInput = ({ pinLength, autoFocus = true, onChangeCode }: OTPInputProps) => {

  const { dynamicTheme, themeController } = useThemeContext();

  const [codeValues, setCodeValues] = useState<string[]>(Array(pinLength).fill(''));
  const [focusedInputIndex, setFocusedInputIndex] = useState<number>(0);

  let refs = useRef<any>([]);

  const focusNext = (index: number, value: string) => {
    const currentInput = refs.current[index + 1]

    if (index < refs.current.length - 1 && value) {
      currentInput?.focus();
    }
    if (index === refs.current.length - 1) {
      currentInput?.blur();
    }

    const newCodeValues = [...codeValues]
    newCodeValues[index] = value
    setCodeValues(newCodeValues);
  };

  const focusPrevious = (key: string, index: number) => {
    if (key === 'Backspace' && index !== 0)
      refs.current[index - 1]?.focus();
  };

  useEffect(() => {
    onChangeCode(codeValues.join(''));
  }, [codeValues])

  useEffect(() => {
    try {
      Clipboard.addClipboardListener(async ({ contentTypes }: Clipboard.ClipboardEvent) => {
        if (contentTypes?.includes(Clipboard.ContentType.PLAIN_TEXT)) {
          const text = await Clipboard.getStringAsync();
          const pin = text.replace(/\D/g,'').split('', pinLength);
          setCodeValues(pin)
        }
      });
    } catch (err) {
      // console.error(err);
    }
  }, [])

  return (
    <View style={themeController(styles.container)}>
      {
        Array(pinLength).fill(0).map((_, index) =>
          <TextInput
            key={index.toString()}
            autoFocus={autoFocus && index === 0}
            ref={ref => refs.current[index] = ref}
            placeholder={"0"}
            keyboardType="numeric"
            onKeyPress={e => focusPrevious(e.nativeEvent.key, index)}
            onChangeText={(text) => focusNext(index, text)}
            onFocus={() => setFocusedInputIndex(index)}
            value={codeValues[index] ? codeValues[index] : ''}
            style={[themeController(styles.inputField), focusedInputIndex === index && themeController(styles.inputFocus)]}
            maxLength={1}
            placeholderTextColor={"lightgray"}
          />
        )
      }
    </View>
  );
}

export default OTPInput;
