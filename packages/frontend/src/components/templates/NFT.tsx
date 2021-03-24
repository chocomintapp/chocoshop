import React from "react";

import { Metadata, NFTContract } from "../../types";
import { Container } from "../atoms/Container";
import { Main } from "../atoms/Main";
import { Footer } from "../organisms/Footer";
import { Header } from "../organisms/Header";
import { NFT } from "../organisms/NFT";

export interface NFTTemplateProps {
  metadata: Metadata;
  nftContract: NFTContract;
}

export const NFTTemplate: React.FC<NFTTemplateProps> = ({ metadata, nftContract }) => {
  return (
    <Main>
      <Header />
      <Container>
        <NFT metadata={metadata} nftContract={nftContract} />
      </Container>
      <Footer />
    </Main>
  );
};
