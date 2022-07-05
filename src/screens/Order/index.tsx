import React, {useState, useEffect} from "react";
import { Alert, FlatList, Platform , ScrollView} from "react-native";
import firestore from "@react-native-firebase/firestore";

import { Container, 
          Header, 
          Title, 
          Photo, 
          Sizes, 
          Form,
          Label,
          InputGroup,
          FormRow,
          Price,
         } from "./styles";
import { OrderCard, OrderProps } from "@components/OrderCard";
import { ItemSeparator } from "@components/ItemSeparator";
import { ButtonBack } from "@components/ButtonBack";
import { RadioButton } from "@components/RadioButton";
import {PIZZA_TYPES} from "@utils/pizzaTypes";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation,useRoute } from "@react-navigation/native";
import { ProductNavigationProps } from "@src/@types/navigation"; 
import { ProductProps } from "@src/components/ProductCard";
import { useAuth } from "@hooks/auth";
import { azurefetch, initAzureCosmos } from 'react-native-azure-cosmos/azurecosmos'

type ProductResponse = ProductProps &{
  price_sizes: {
    [key: string]: number;
  }
}

export function Order() {
  const [size, setSize] = useState('');
  const [product, setProduct] = useState<ProductResponse>({} as ProductResponse);
  const [quantity, setQuantity] = useState(0);
  const [tableNumber, setTableNumber] = useState('');
  const [sendingOrder, setSendingOrder] = useState(false);

  const {user} = useAuth();

  const navigation = useNavigation();
  const route=useRoute();
  const {id} = route.params as ProductNavigationProps;

  const amount = size ? product.price_sizes[size] * quantity : '0.00';

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleOrder() {
    initAzureCosmos(
      {
        masterKey:"EleWMGjrNe11bPMfY1YQU9vIRi6kMGlW8Pf9CH2yM5NoDC3oOaF46NZwU7qn5Elczbi7Vu9ZdPnmBkZ2q3Phcw==",
        version: "2017-02-22",
        dbUri: "https://allan-cosmos-db.documents.azure.com:443/",
        dbname: "allan-cosmos-db",
   
      });
  



    if (!size) {
      Alert.alert('Erro', 'Selecione um tamanho');
      return;
    }
    if (!quantity) {
      Alert.alert('Erro', 'Selecione uma quantidade');
      return;
    }
    if (!tableNumber) {
      Alert.alert('Erro', 'Selecione a mesa');
      return;
    }

    setSendingOrder(true);
    firestore()
    .collection('orders')
    .add({
      quantity,
      amount,
      product:product.name,
      size,
      tableNumber,
      status:'Preparando',
      waiter_id:user?.id,
      image:product.photo_url
    })
    .then(()=>navigation.navigate('home'))
    .catch(error=>{
      Alert.alert('Erro','Não foi posssivel realizar pedido');
    })

  }

  useEffect(()=>{
    
    if (id) {
      firestore()
        .collection("products")
        .doc(id)
        .get()
        .then(response => {
          const data = response.data();
          setProduct(data as ProductResponse);
        })
        .catch(()=>{
          Alert.alert('Erro','Não foi posssivel carregar o produto');
        });
    }

    


  },[id]);

  return (
    <Container behavior={Platform.OS==='ios' ? 'padding' : undefined}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <ButtonBack onPress={handleGoBack}            
            style={{marginBottom:108}}
          />
          
        </Header>
        <Photo source={{uri:product.photo_url }} />
        <Form>
          <Title>Nome da Pizza</Title>
          <Label>Selecione um tamanho</Label>
          <Sizes>
            {
              PIZZA_TYPES.map((type) => (
                <RadioButton
                  key={type.id}
                  title={type.name}
                  selected={size===type.id} 
                  onPress={()=>setSize(type.id)}
                />
              ))
            }
          </Sizes>
          <FormRow>
            <InputGroup>
              <Label>Número da mesa</Label>
              <Input 
                onChangeText={setTableNumber}
                keyboardType="numeric"                
              />
            </InputGroup>
            <InputGroup>
              <Label>Quantidade</Label>
              <Input 
                onChangeText={(value) => setQuantity(Number(value))}
                keyboardType="numeric"
              />
            </InputGroup>
          </FormRow>
          <Price>Valor de R${amount} </Price>

          <Button 
            onPress={handleOrder}
            title="Confirmar pedido"
            isLoading={sendingOrder}
          />
        </Form>
      </ScrollView>
    </Container>
  );
}
