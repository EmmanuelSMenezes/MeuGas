import React from 'react';
import { View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { theme } from '../../../../styles/theme';
import styles from '../../styles';

import { AntDesign } from '@expo/vector-icons';

interface IStar {
  checked: string,
  setChecked: (checked) => void
}

const RenderStars = ({checked, setChecked}: IStar) => {

  const determineStar = (n: number) => {
    const myloop = [];
    for (let i = 0; i < n; i++) {
      myloop.push(
        <View style={{ marginTop: 10, flexDirection: 'row' }} key={i}>
          <AntDesign name="star" size={24} color="black" key={i} />
        </View>
      );
    }
    return myloop
  }

  return (
    <View>
      <View style={{ marginTop: 10, flexDirection: 'row' }}>
        {determineStar(5)}
        <View style={styles.viewContentRowLeft}>
          <RadioButton
            value="first"
            color={theme.colors.primary}
            status={checked === 'first' ? 'checked' : 'unchecked'}
            onPress={() => { setChecked('first'); }}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        {determineStar(4)}
        <View style={styles.viewContentRowLeft}>
          <RadioButton
            value="second"
            color={theme.colors.primary}
            status={checked === 'second' ? 'checked' : 'unchecked'}
            onPress={() => { setChecked('second'); }}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        {determineStar(3)}
        <View style={styles.viewContentRowLeft}>
          <RadioButton
            value="three"
            color={theme.colors.primary}
            status={checked === 'three' ? 'checked' : 'unchecked'}
            onPress={() => { setChecked('three'); }}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        {determineStar(2)}
        <View style={styles.viewContentRowLeft}>
          <RadioButton
            value="four"
            color={theme.colors.primary}
            status={checked === 'four' ? 'checked' : 'unchecked'}
            onPress={() => { setChecked('four'); }}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        {determineStar(1)}
        <View style={styles.viewContentRowLeft}>
          <RadioButton
            value="five"
            color={theme.colors.primary}
            status={checked === 'five' ? 'checked' : 'unchecked'}
            onPress={() => { setChecked('five'); }}
          />
        </View>
      </View>
    </View>
  )
}

export default RenderStars;
