export type ProductNavigationProps = {
  id?: string; // ? opcional
};

export type OrderNavigationProps = {
  id: string;
};

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      home: undefined;
      product: ProductNavigationProps;
      order: OrderNavigationProps; // essa é a de fazer pedido
      orders: undefined; // para listas os pedidos
    }
  }
}
