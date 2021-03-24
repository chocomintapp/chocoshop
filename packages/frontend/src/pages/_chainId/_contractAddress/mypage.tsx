import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { MypageTemplate } from "../../../components/templates/Mypage";
import { getShop } from "../../../modules/api";
import { Metadata, NFTContract } from "../../../types";

export const Mypage: React.FC = () => {
  const { nftContractAddress, chainId } = useParams<{ chainId: string; nftContractAddress: string }>();
  const [nftContract, setNftContract] = React.useState<NFTContract>();
  const [metadataList, setMetadataList] = React.useState<Metadata[]>([]);
  const history = useHistory();

  React.useEffect(() => {
    if (chainId !== "31337" && chainId !== "137") {
      history.push("/");
    }
    getShop(chainId, nftContractAddress).then(({ metadataList, nftContract }) => {
      //TODO: check with blockchain

      setMetadataList(metadataList);
      setNftContract(nftContract);
    });
  });

  return nftContract ? <MypageTemplate metadataList={metadataList} nftContract={nftContract} /> : <></>;
};

export default Mypage;
