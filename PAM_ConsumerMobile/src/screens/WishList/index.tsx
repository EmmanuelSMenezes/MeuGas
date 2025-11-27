import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { styles } from './styles';
import Card from '../../components/Card';
import { globalStyles } from '../../styles/globalStyles';
import { useNavigation } from '@react-navigation/native'

const WishList: React.FC = () => {

  const wishList = [
    {
      id: 1,
      name: "Frango Xadrez",
      image: "",
      price: 27.99,
      idCategory: 1,
      rate: 4.7,
      description: "Frango em cubos com legumes e molho agridoce.",
      category: "Comida Chinesa",
      sold: 82
    },
    {
      id: 2,
      name: "Salada Caesar",
      image: "",
      price: 14.99,
      idCategory: 1,
      rate: 4.3,
      description: "Salada de alface, croutons, queijo parmesão e molho Caesar.",
      category: "Saladas",
      sold: 42
    },
    {
      id: 3,
      name: "Ceviche",
      image: "",
      price: 22.99,
      idCategory: 1,
      rate: 4.8,
      description: "Peixe marinado em limão com cebola roxa e coentro.",
      category: "Frutos do Mar",
      sold: 9912
    },
    {
      id: 4,
      name: "Risoto de Cogumelos",
      image: "",
      price: 40.00,
      idCategory: 1,
      rate: 4.6,
      description: "Risoto cremoso com cogumelos e parmesão.",
      category: "Risotos",
      sold: 1562
    },
    {
      id: 5,
      name: "Camarão à Baiana",
      image: "",
      price: 400,
      idCategory: 1,
      rate: 4.9,
      description: "Camarão refogado com leite de coco, azeite de dendê e pimenta.",
      category: "Frutos do Mar",
      sold: 1244
    },
    {
      id: 6,
      name: "Taco Mexicano",
      image: "",
      price: 12.99,
      idCategory: 1,
      rate: 4.2,
      description: "Tortilha de milho recheada com carne moída, alface e queijo.",
      category: "Comida Mexicana",
      sold: 125
    },
    {
      id: 7,
      name: "Pad Thai",
      image: "",
      price: 19.99,
      idCategory: 3,
      rate: 4.5,
      description: "Macarrão de arroz frito com frango, amendoim e coentro.",
      category: "Comida Tailandesa",
      sold: 32
    },
    {
      id: 8,
      name: "Cama para gatos",
      image: "",
      price: 16.99,
      idCategory: 4,
      rate: 4.4,
      description: "Cama para gatos bonita",
      category: "Pets",
      sold: 12
    },
    {
      id: 9,
      name: "Malbec",
      image: "",
      price: 40.00,
      idCategory: 2,
      rate: 4.6,
      description: "Perfume cheiroso.",
      category: "Perfumes",
      sold: 1562
    },
  ]


  const { navigate } = useNavigation();

  return (
    <View style={globalStyles.container} >

      <FlatList
        numColumns={2}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={globalStyles.title}>Lista de desejos</Text>
        }
        columnWrapperStyle={styles.listColumnStyle}
        contentContainerStyle={styles.listContainer}
        data={wishList}
        renderItem={({ item }) =>
          <Card
            item={item}
            favorited={true}
            style={styles.cardSize}
            onPress={() => navigate('ItemDetails', item)}
          />
        }
      />
    </View >
  );
}

export default WishList;
