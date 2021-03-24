import React from "react";

import { Metadata, NFTContract } from "../../types";
import { Container } from "../atoms/Container";
import { Main } from "../atoms/Main";
import { Footer } from "../organisms/Footer";
import { Header } from "../organisms/Header";
import { Shop } from "../organisms/Shop";

export interface ShopTemplateProps {
  metadataList: Metadata[];
  nftContract: NFTContract;
}

export const ShopTemplate: React.FC<ShopTemplateProps> = ({ metadataList, nftContract }) => {
  return (
    <Main>
      <Header />
      <Container>
        <Shop metadataList={metadataList} nftContract={nftContract} />
      </Container>
      <Footer />
    </Main>
  );
};
