import React from 'react';
import { View } from 'react-native';
import { Input } from '../../../Shared';


interface IProps {
  stateAddress: string,
  setStateAddress: (stateAddress: string) => void,
  cityAddress: string,
  setCityAddress: (cityAddress: string) => void,
}

const Address = ({setCityAddress, cityAddress, setStateAddress, stateAddress}: IProps) => {
  return (
    <View>
      <View style={{ marginEnd: 20, paddingTop: 20, flexDirection: 'row' }}>
        <Input
          onBlur={() => { }}
          onChangeText={(text) => {
            setStateAddress(text)
          }}
          placeholder='Estado'
          value={stateAddress}
        />
      </View>
      <View style={{ marginEnd: 20, paddingTop: 20, flexDirection: 'row' }}>
        <Input
          onBlur={() => { }}
          onChangeText={(text) => {
            setCityAddress(text)
          }}
          placeholder='Cidade'
          value={cityAddress}
        />
      </View>
    </View>
  )
}

export default Address;
