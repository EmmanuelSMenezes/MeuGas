import React, { ReactNode, useEffect, useState } from 'react';

import FlipCard from 'react-native-flip-card';
import Payment from 'payment'

import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Image,
  ImageSourcePropType
} from 'react-native';
const images = require('./card-images');
const validate = Payment.fns;


interface ICreditCard{
  type: string;
  imageFront: ImageSourcePropType;
  imageBack: ImageSourcePropType;
  shiny: boolean;
  bar: boolean;
  focused: boolean;
  number: string;
  name: string;
  expiry: string;
  cvc: string;
  width?: number,
  height?: number,
  bgColor?: string
}

interface IUpdateType{
  type: string;
  number: string;
}

const CreditCard = ({type, shiny, number, name, imageFront, imageBack, focused, expiry, cvc, bar, width= 300, height= 180, bgColor= '#191278'}: ICreditCard) => {
  const [state, setState] = useState({ type: { name: "unknown", length: 16 } })

  const componentWillMount = () => {
    updateType({type, number});
  }

  const updateType = ({type,number}: IUpdateType) => {

    if (!number)
      return setState({ type: { name: "unknown", length: 16 } });

    var type = validate.cardType(number);
    if (type) {
      if (type === "amex") {
        return setState({ type: { name: type, length: 15 } });
      } else {
        return setState({ type: { name: type, length: 16 } });
      }
    }

    return setState({ type: { name: "unknown", length: 16 } });
  }
  const numberFun = () => {
    var string
    if (!number) {
      string = "";
    } else {
      string = number.toString();
    }

    const maxLength = state.type.length;

    if (string.length > maxLength) string = string.slice(0, maxLength);

    while (string.length < maxLength) {
      string += "•"
    }

    if (state.type.name === "amex") {
      const space_index1 = 4;
      const space_index2 = 10;

      string = string.substring(0, space_index1) + " " + string.substring(space_index1, space_index2) + " " + string.substring(space_index2);
    } else {
      const amountOfSpaces = Math.ceil(maxLength / 4);

      for (var i = 1; i <= amountOfSpaces; i++) {
        var space_index = (i * 4 + (i - 1));
        string = string.slice(0, space_index) + " " + string.slice(space_index)
      }
    }

    return string;
  }

  useEffect(() => {
    numberFun();
    nameFun();
    cvcFun();
  }, [])

  useEffect(() => {
    componentWillMount();
  }, [number])

  useEffect(()=>{
    expiryFun();
  }, [expiry])

  const nameFun = () => {
    if (name === "") {
      return "NOME";
    } else {
      return name?.toUpperCase();
    }
  }
  const expiryFun = () => {
    if (expiry === "") {
      return "••/••";
    } else {
      const expiryMaxLength = 6;

      if (expiry.match(/\//))
        expiry = expiry?.replace("/", "");

      if (!expiry.match(/^[0-9]*$/)){
        return "••/••";
        }
      while (expiry.length < 4) {

        return expiry += "•";
      }

      expiry = expiry?.slice(0, 2) + "/" + expiry.slice(2, expiryMaxLength);
    }

    return expiry;
  }

  const cvcFun = () => {
    if (cvc == null) {
      return "•••"
    } else {
      return (cvc.toString().length <= 4) ? cvc : cvc.toString().slice(0, 4);
    }
  }


  const isAmex = state.type && state.type.name === "amex";
  const cardStyle = [styles.container, { width: width, height: height, backgroundColor: bgColor }, styles];
  return (
    <View >
      <FlipCard
        style={[styles.container, { width: width, height: height, backgroundColor: bgColor }, styles]}
        friction={6}
        perspective={1000}
        flipHorizontal={true}
        flipVertical={false}
        flip={focused}
        clickable={true}
      >
        <View style={[styles.front, { width: width, height: height }]}>
          {imageFront ?
            <Image source={imageFront} style={[styles.bgImage, { width: width, height: height }]} />
            : null}
          <View style={styles.lower}>
            {shiny ?
              <View style={styles.shinyFront} />
              : null}
            <Image
              style={styles.logo}
              source={{ uri: images[type ? type : state.type.name] }}
            />
            {isAmex ?
              <View >
                <Text style={styles.text}>{cvcFun()}</Text>
              </View>
              : null}
            <View style={styles.info}>
              <View ><Text style={styles.textNumber}>{numberFun()}</Text></View>
              <View style={styles.rowWrap}>
                <View style={styles.name}><Text style={styles.textName}>{nameFun()}</Text></View>
                <View style={styles.validthru}><Text style={styles.textValidThru}>Validade</Text></View>
                <View
                  style={styles.expiry}>
                  <Text style={styles.textSmall}>Mês/Ano</Text>
                  <Text style={styles.textExpiry}>{expiryFun()}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.back, { width: width, height: height }]}>
          {imageBack ?
            <Image source={imageBack} style={[styles.bgImage, { width: width, height: height }]} />
            : null}
          {bar ?
            <View style={styles.bar} />
            : null}
          <View style={styles.cvc}><Text style={styles.textCvc}>{cvcFun()}</Text></View>
          {shiny ?
            <View style={styles.shinyBack}  />
            : null}
        </View>
      </FlipCard>
    </View>
  );

}
const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 0,
    flex: 1,
  },
  logo: {
    height: 35,
    width: 57,
    position: 'absolute',
    top: 20,
    right: 20
  },
  text: {
    color: '#fff'
  },
  bgImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    borderRadius: 8
  },
  lower: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 20,
    paddingHorizontal: 20
  },
  expiry: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  rowWrap: {
    flexDirection: 'row',
  },
  name: {
    flex: 2,
    justifyContent: 'center'
  },
  validthru: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  textValidThru: {
    fontSize: 8,
    color: '#ddd',
    fontWeight: '900',
    backgroundColor: 'transparent',
  },
  textSmall: {
    fontSize: 8,
    color: '#ddd',
    fontWeight: '900',
    backgroundColor: 'transparent',
  },
  textNumber: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  textName: {
    color: '#fff',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  textExpiry: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  front: {
    flex: 1
  },
  back: {
    flex: 1
  },
  cvc: {
    width: 45,
    height: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 15,
    top: 76
  },
  textCvc: {
    color: '#000',
    fontSize: 18
  },
  info: {
    flex: 1,
  },
  shinyFront: {
    backgroundColor: '#ddd',
    borderRadius: 8,
    width: 50,
    height: 40,
    position: 'absolute',
    top: 15,
    left: 20
  },
  shinyBack: {
    backgroundColor: '#ddd',
    borderRadius: 8,
    width: 50,
    height: 40,
    position: 'absolute',
    bottom: 15,
    left: 20
  },
  bar: {
    height: 40,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 30,
    backgroundColor: '#000'
  }
});


CreditCard.defaultProps = {
  number: null,
  cvc: null,
  name: '',
  expiry: '',
  focused: null,
  expiryBefore: 'month/year',
  expiryAfter: 'valid thru',
  shinyAfterBack: '',
  type: null,
  width: 300,
  height: 180,
  bgColor: '#191278',
};

CreditCard.CardImages = images;


export default CreditCard;
