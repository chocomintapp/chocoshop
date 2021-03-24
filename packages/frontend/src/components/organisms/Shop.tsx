import React from "react";
import { Metadata, NFTContract } from "../../types";
import { NFTsGridListViewer } from "../molecules/NFTsGridListViewer";

export interface ShopProps {
  metadataList: Metadata[];
  nftContract: NFTContract;
}

export const Shop: React.FC<ShopProps> = ({ metadataList, nftContract }) => {
  return (
    <section>
      <div className="mb-4">
        <p className="text-primary text-3xl">Chocoshop Beta</p>
        <p className="text-secondary text-lg">{nftContract.name}</p>
      </div>
      <NFTsGridListViewer metadataList={metadataList} />
    </section>
  );
};
