import React, {useEffect, useState} from "react";
import { Alert, FlatList, Platform } from "react-native";

import { Container, Header, Title, Photo } from "./styles";
import { OrderCard, OrderProps } from "@components/OrderCard";
import { ItemSeparator } from "@components/ItemSeparator";
import { ButtonBack } from "@components/ButtonBack";
import firestore from "@react-native-firebase/firestore";
import { useAuth } from "@hooks/auth";


export function Orders() {
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const {user} = useAuth();
  useEffect(() => {
    const subscriber = firestore()
    .collection("orders")
    .where('waiter_id', '==', user?.id)
    .onSnapshot(querySnapshot => {
      const data = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        } 
      }) as OrderProps[];

      setOrders(data);
    });

    return () => subscriber();
  });

  function handlePizzaDelivered(id: string) {
    Alert.alert('Confirmar entrega', 'Deseja confirmar a entrega da pizza?', [
      {
        text: 'Não',
        style: 'cancel'
      },
      {
        text: 'Sim',
        onPress: ()=>{
          firestore()
          .collection("orders")
          .doc(id)
          .update({
            status: "Entregue"
          });
        }
      }
    ])
    
  }

  return (
    <Container>
      <Header>
        <Title>Pedidos feitos</Title>
      </Header>
      <FlatList 
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => 
          <OrderCard 
            index={index} 
            data={item}
            //disabled={item.status === 'Preparando'}
            onPress={() => handlePizzaDelivered(item.id)}
            />
        }
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 125, paddingHorizontal:24 }}
        ItemSeparatorComponent={() => <ItemSeparator />}
      />
    </Container>
  );
}
