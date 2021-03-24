import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { ShopTemplate } from "../../../components/templates/Shop";
import { useLoadingOverlay } from "../../../components/utils/hooks";
import { getShop } from "../../../modules/api";
import { getContractsForChainId } from "../../../modules/web3";
import { Metadata, NFTContract } from "../../../types";

export const Shop: React.FC = () => {
  const { nftContractAddress, chainId } = useParams<{ chainId: string; nftContractAddress: string }>();
  const [nftContract, setNftContract] = React.useState<NFTContract>();
  const [metadataList, setMetadataList] = React.useState<Metadata[]>([]);
  const [deployed, setDeployed] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const history = useHistory();
  const { openLoadingOverlay, closeLoadingOverlay } = useLoadingOverlay();

  const finishLoading = () => {
    closeLoadingOverlay();
    setIsLoaded(true);
  };

  React.useEffect(() => {
    if (chainId !== "31337" && chainId !== "137") {
      history.push("/");
    }
    const { erc721Contract, provider } = getContractsForChainId(chainId);
    getShop(chainId, nftContractAddress).then(({ metadataList, nftContract }) => {
      console.log(metadataList, nftContract);
      if (!metadataList || !nftContract) {
        history.push("/");
        return;
      }
      openLoadingOverlay();
      setNftContract(nftContract);
      provider.getCode(nftContractAddress).then((code: string) => {
        const deployed = code != "0x";
        setDeployed(deployed);
        const promises = metadataList.map((metadata: any) => {
          return erc721Contract
            .attach(nftContractAddress)
            .ownerOf(metadata.tokenId)
            .catch((err) => err);
        });
        Promise.all(promises).then((resolves) => {
          const mintedTokenIds = resolves
            .map((resolve, i: number) => {
              if (typeof resolve == "string") {
                return metadataList[i].tokenId.toString();
              }
            })
            .filter((item) => item != undefined) as string[];
          const mintedMetadata = metadataList
            .map((metadata: any) => {
              if (mintedTokenIds.includes(metadata.tokenId.toString())) {
                return metadata;
              }
            })
            .filter((item: any) => item != undefined) as Metadata[];
          setMetadataList(mintedMetadata);
          finishLoading();
        });
      });
    });
  }, []);

  return nftContract ? <ShopTemplate metadataList={metadataList} nftContract={nftContract} /> : <></>;
};

export default Shop;
