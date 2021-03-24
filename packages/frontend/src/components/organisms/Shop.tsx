import React from "react";
import { Metadata } from "../../types";
import { NFTsGridListViewer } from "../molecules/NFTsGridListViewer";

export interface ShopProps {
  metadataList: Metadata[];
}

export const Shop: React.FC<ShopProps> = ({ metadataList }) => {
  return (
    <section>
      <NFTsGridListViewer metadataList={metadataList} />
    </section>
  );
};
