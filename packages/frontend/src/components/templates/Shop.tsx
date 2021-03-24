import React from "react";

import { Container } from "../atoms/Container";
import { Main } from "../atoms/Main";
import { Footer } from "../organisms/Footer";
import { Header } from "../organisms/Header";

export const ShopTemplate: React.FC = () => {
  return (
    <Main>
      <Header />
      <Container>shop</Container>
      <Footer />
    </Main>
  );
};
