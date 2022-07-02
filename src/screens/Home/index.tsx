import React, { useState, useCallback, useEffect } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Alert, TouchableOpacity, FlatList } from "react-native";
import firestore from "@react-native-firebase/firestore";
import {
  Container,
  Greeting,
  GreetingEmoji,
  GreetingText,
  Title,
  MenuHeader,
  MenuItemsNumber,
  NewProductButton,
} from "./style";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";

import { Header } from "../Product/styles";
import { Search } from "@components/Search";
import happyEmoji from "@assets/happy.png";
import { ProductCard, ProductProps } from "@components/ProductCard";
import { BorderlessButton } from "react-native-gesture-handler";
import { useAuth } from "../../hooks/auth";

export function Home() {
  const [products,setProducts]=useState<ProductProps[]>([]);
  const [search,setSearch]=useState("");
  const {COLORS} = useTheme();
  const navigation = useNavigation();
  const {signOut,user} = useAuth();

  function fetchProducts(value:string) {
    const formattedValue = value.toLowerCase();

    firestore()
    .collection("products")
    .orderBy("name_lower")
    .startAt(formattedValue)
    .endAt(`${formattedValue}\uf8ff`)
    .get()
    .then(response=>{
      const data = response.docs.map(doc=>{
        return {
          id: doc.id,
          ...doc.data()
        }
      }) as ProductProps[];

      setProducts(data);

    })
    .catch(error=>{
      Alert.alert('Erro','Não foi posssivel realizar consulta');
    });
  }

  function handleSearch(){
    fetchProducts(search);
  }

  function handleSearchClear(){
    setSearch('');
    fetchProducts(search);
  }

  function handleSignOut(){
    
    signOut();
  }

  function handleOpen(id:string){
    const route = user?.isAdmin ? "product" : "order";
    navigation.navigate(route,{id});
  }

  function handleAddProduct(){
    navigation.navigate('product',{});
  }

  useFocusEffect(
    useCallback(() => {
      fetchProducts('');
    }, [])
  );

  return (
    <Container>
      <Header>
        <Greeting>
          <GreetingEmoji source={happyEmoji} />
          <GreetingText>Olá, {user?.name}</GreetingText>
        </Greeting>
        <TouchableOpacity onPress={handleSignOut}>
          <MaterialIcons name="logout" size={24} color={COLORS.TITLE} />
        </TouchableOpacity>
      </Header>      
      <Search 
        onChangeText={setSearch}
        value={search}
        onSearch={handleSearch} 
        onClear={handleSearchClear} 
      />
      <MenuHeader>
        <Title>Cardápio</Title>
        <MenuItemsNumber>{products.length} itens</MenuItemsNumber>
      </MenuHeader>
      <FlatList 
        data={products}
        keyExtractor={item=>item.id}
        renderItem={({item})=>(
            <ProductCard 
              data={item} 
              onPress={()=>{handleOpen(item.id)}}
            /> 
          )
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 125,
          paddingTop: 20,
          marginHorizontal:24
        }}
        
      />
      {
        user?.isAdmin && (
          <NewProductButton 
            title="Novo produto"
            type="secondary"
            onPress={()=>{handleAddProduct()}}
          />
        )
      }
      
    </Container>
  );
}
