import React, { useEffect, useState } from "react";
import {
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert,
  View,
} from "react-native";
import {
  Container,
  Header,
  Title,
  DeletLabel,
  Upload,
  PickeImageButton,
  Form,
  InputGroup,
  InputGroupHeader,
  MaxCharacter,
  Label,
} from "./styles";

import * as ImagePicker from "expo-image-picker";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import { ProductNavigationProps } from "@src/@types/navigation";
import { ProductProps } from "@components/ProductCard";

import { InputPrice } from "@components/InputPrice";
import { ButtonBack } from "@components/ButtonBack";
import { Photo } from "@components/Photo";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

type pizzaResponse = ProductProps & {
  photo_path: string;
  prices_sizes: {
    p: string;
    m: string;
    g: string;
  };
};

type PizzaResponse = ProductProps & {
  photo_path: string;
  price_sizes: {
    p: string;
    m: string;
    g: string;
  }
}

export function Product() {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceSizeP, setPriceSizeP] = useState('');
  const [priceSizeM, setPriceSizeM] = useState('');
  const [priceSizeG, setPriceSizeG] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [photoPath,setPhotoPath]=useState('');
  const navigation = useNavigation();

  const route = useRoute();
  const {id} = route.params as ProductNavigationProps;
  console.log('produto carregado com id: ', id);
  
  async function handlePickerImage(){
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === 'granted'){
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.cancelled){
        setImage(result.uri);
      }
    }
  }

  async function handleAdd(){
    const requiredFields = [[name,'nome'], 
                            [description,'descrição'],
                            [priceSizeP,'preço p'],
                            [priceSizeM,'preço m'],
                            [priceSizeG,'preço g'],
                            [image,'imagem']];
    let errors="";
    requiredFields.forEach(field => {
      if (!field[0]){
        errors+=`O campo ${field[1]} é obrigatório.\n`;
      }
    });
    if (errors)
      return Alert.alert('Erro', errors);  
      
    setIsLoading(true);

    const fileName = `${new Date().getTime()}`;
    const reference = storage().ref(`images/${fileName}.png`);
    
    await reference.putFile(image);
    const photo_url = await reference.getDownloadURL();

    firestore().collection('products').add({
      name, 
      name_lower: name.toLowerCase().trim(),
      description,
      price_sizes:{
        p: priceSizeP,
        m: priceSizeM,
        g: priceSizeG,
      },
      photo_url,
      photo_path:reference.fullPath,
    })
    .then(()=>{      
      Alert.alert('Sucesso', 'Produto adicionado com sucesso!');      
    })
    .then(()=>{
      navigation.navigate('home');
    })
    .catch(()=>{
      Alert.alert('Erro', 'Erro ao adicionar produto!');
    })
    .finally(()=>{
      setIsLoading(false);
    })
  }

  async function handleLoadProduct(){
    firestore()
    .collection('products')
    .doc(id)
    .get()
    .then(response=>{
      const data = response.data() as PizzaResponse;
      setName(data.name);
      setDescription(data.description);
      setPriceSizeP(data.price_sizes.p);
      setPriceSizeM(data.price_sizes.m);
      setPriceSizeG(data.price_sizes.g);
      setImage(data.photo_url);
      setPhotoPath(data.photo_path);
    })
  }

  function handleGoBack(){
    navigation.goBack();
  }

  function handleDelete(){
    firestore()
    .collection('products')
    .doc(id)
    .delete()
    .then(()=>{
      storage()
      .ref(photoPath)
      .delete()
      .then(()=>{
        navigation.navigate('home');
      })
    })
  }

  useEffect(()=>{
    if (id){
      handleLoadProduct();
    }
  },[id]);

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView showsVerticalScrollIndicator={false}>
      <Header>
        <ButtonBack onPress={handleGoBack}/>
        <Title>
          Cadastrar
        </Title>
        {
          id ?
            <TouchableOpacity>
              <DeletLabel onPress={handleDelete}>Deletar</DeletLabel>
            </TouchableOpacity>
           : <View style={{width:20}} />
        }
      </Header>
      <Upload>
        <Photo uri={image}/>
        {
          !id &&
            <PickeImageButton 
              title="Carregar" 
              type="secondary"
              onPress={handlePickerImage}/>
         
        }
      </Upload>
      <Form>
        <InputGroup>
          <Label>Nome</Label>
          <Input onChangeText={setName} value={name}/>
        </InputGroup>
        <InputGroup>
          <InputGroupHeader>
            <Label>Descrição</Label>            
            <MaxCharacter>0 de 60 caracteres</MaxCharacter>          
          </InputGroupHeader>
          <Input 
            multiline={true}
            maxLength={60}
            style={{height: 80}}
            onChangeText={setDescription} value={description}
          />
        </InputGroup>

        <InputGroup>
          <Label>Tamanhos e preços</Label>
          <InputPrice size="P" onChangeText={setPriceSizeP} value={priceSizeP}/>
          <InputPrice size="M" onChangeText={setPriceSizeM} value={priceSizeM}/>
          <InputPrice size="G" onChangeText={setPriceSizeG} value={priceSizeG}/>
        </InputGroup>
        {
          !id &&
            <Button 
              title="Cadastrar Pizza"
              isLoading={isLoading}
              onPress={handleAdd}
            />
        }
      </Form>
      </ScrollView>
    </Container>
  );
}
