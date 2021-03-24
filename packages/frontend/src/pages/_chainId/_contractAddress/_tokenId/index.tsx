import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { NFTTemplate } from "../../../../components/templates/NFT";
import { getNFT } from "../../../../modules/api";
import { Metadata, NFTContract } from "../../../../types";

export const NFT: React.FC = () => {
  const { nftContractAddress, chainId, tokenId } = useParams<{
    chainId: string;
    nftContractAddress: string;
    tokenId: string;
  }>();
  const [nftContract, setNftContract] = React.useState<NFTContract>();
  const [metadata, setMetadata] = React.useState<Metadata>();
  const history = useHistory();

  React.useEffect(() => {
    if (chainId !== "31337" && chainId !== "137") {
      history.push("/");
    }
    getNFT(chainId, nftContractAddress, tokenId).then(({ metadata, nftContract }) => {
      setMetadata(metadata);
      setNftContract(nftContract);
    });
  });

  return nftContract && metadata ? <NFTTemplate metadata={metadata} nftContract={nftContract} /> : <></>;
};

export default NFT;
