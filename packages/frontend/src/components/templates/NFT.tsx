import React from "react";

import { Metadata, NFTContract, Sale } from "../../types";
import { Container } from "../atoms/Container";
import { Main } from "../atoms/Main";
import { Footer } from "../organisms/Footer";
import { Header } from "../organisms/Header";
import { NFT } from "../organisms/NFT";

export interface NFTTemplateProps {
  metadata: Metadata;
  nftContract: NFTContract;
  sale?: Sale;
  owner?: string;
}

export const NFTTemplate: React.FC<NFTTemplateProps> = ({ metadata, nftContract, sale, owner }) => {
  return (
    <Main>
      <Header />
      <Container>
        <NFT metadata={metadata} nftContract={nftContract} sale={sale} owner={owner} />
      </Container>
      <Footer />
    </Main>
  );
};
