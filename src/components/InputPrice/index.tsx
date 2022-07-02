import React from "react";
import { TextInputProps } from "react-native";
import { Conteiner, Size, Label, Input } from "./style";

type Props = TextInputProps & {
  size: string;
};

export function InputPrice({ size, ...rest }: Props) {
  return (
    <Conteiner>
      <Size>
        <Label>{size}</Label>
      </Size>
      <Label>R$</Label>
      <Input keyboardType="numeric" {...rest} />
    </Conteiner>
  );
}
