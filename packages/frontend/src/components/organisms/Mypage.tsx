import React from "react";
import { Metadata } from "../../types";
import { NFTsGridListViewer } from "../molecules/NFTsGridListViewer";

export interface MypageProps {
  metadataList: Metadata[];
}

export const Mypage: React.FC<MypageProps> = ({ metadataList }) => {
  return (
    <section>
      <NFTsGridListViewer metadataList={metadataList} />
    </section>
  );
};
