import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { ShopTemplate } from "../../../components/templates/Shop";
import { getShop } from "../../../modules/api";
import { Metadata, NFTContract } from "../../../types";

export const Shop: React.FC = () => {
  const { nftContractAddress, chainId } = useParams<{ chainId: string; nftContractAddress: string }>();
  const [nftContract, setNftContract] = React.useState<NFTContract>();
  const [metadataList, setMetadataList] = React.useState<Metadata[]>([]);
  const history = useHistory();

  React.useEffect(() => {
    if (chainId !== "31337" && chainId !== "137") {
      history.push("/");
    }
    getShop(chainId, nftContractAddress).then(({ metadataList, nftContract }) => {
      setMetadataList(metadataList);
      setNftContract(nftContract);
    });
  });

  return nftContract ? <ShopTemplate metadataList={metadataList} nftContract={nftContract} /> : <></>;
};

export default Shop;
