import React from "react";
import { TouchableOpacityProps } from "react-native";
import { Container, Title, Loading, TypeProps } from "./styles";

type Props = TouchableOpacityProps & {
  title: string;
  type?: TypeProps;
  isLoading?: boolean;
};
export function Button({
  title,
  type = "primary",
  // enabled: !isLoading,
  isLoading = false,
  ...rest
}: Props) {
  const props = {
    type,
    enabled: !isLoading,
    ...rest,
  };
  return (
    <Container {...props}>
      {/* // <Container type={type} enabled={!isLoading} {...rest}> */}
      {isLoading ? <Loading /> : <Title>{title}</Title>}
    </Container>
  );
}
