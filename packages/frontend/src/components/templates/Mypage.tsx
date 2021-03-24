import React from "react";

import { Metadata, NFTContract } from "../../types";
import { Container } from "../atoms/Container";
import { Main } from "../atoms/Main";
import { Footer } from "../organisms/Footer";
import { Header } from "../organisms/Header";
import { Mypage } from "../organisms/Mypage";

export interface MypageTemplateProps {
  metadataList: Metadata[];
  nftContract: NFTContract;
}

export const MypageTemplate: React.FC<MypageTemplateProps> = ({ metadataList, nftContract }) => {
  console.log(metadataList, nftContract);

  return (
    <Main>
      <Header />
      <Container>
        <Mypage metadataList={metadataList} />
      </Container>
      <Footer />
    </Main>
  );
};
