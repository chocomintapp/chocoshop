import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { NFTTemplate } from "../../../../components/templates/NFT";
import { getNFT } from "../../../../modules/api";
import { getContractsForChainId } from "../../../../modules/web3";
import { Metadata, NFTContract, Sale } from "../../../../types";

export const NFT: React.FC = () => {
  const { nftContractAddress, chainId, tokenId } = useParams<{
    chainId: string;
    nftContractAddress: string;
    tokenId: string;
  }>();
  const [nftContract, setNftContract] = React.useState<NFTContract>();
  const [metadata, setMetadata] = React.useState<Metadata>();
  const [sale, setSale] = React.useState<Sale>();
  const [owner, setOwner] = React.useState("");
  const history = useHistory();

  React.useEffect(() => {
    if (chainId !== "31337" && chainId !== "137") {
      history.push("/");
      return;
    }

    getNFT(chainId, nftContractAddress, tokenId)
      .then(({ metadata, nftContract }) => {
        setMetadata(metadata);
        setNftContract(nftContract);
      })
      .catch((err) => {
        console.log(err);
        history.push("/");
        return;
      });

    const { chocoshopContract, erc721Contract, explore, provider } = getContractsForChainId(chainId);

    chocoshopContract
      .getSale(nftContractAddress, tokenId)
      .then((rawSale) => {
        const sale: Sale = {
          nftContractAddress: rawSale.nftContractAddress,
          tokenId: parseInt(rawSale.tokenId.toString()),
          from: rawSale.from,
          price: rawSale.price.toString(),
          createdAt: rawSale.createdAt.toString(),
          updatedAt: rawSale.updatedAt.toString(),
        };
        setSale(sale);
      })
      .catch((err) => {
        console.log("sale not exist");
        erc721Contract
          .attach(nftContractAddress)
          .ownerOf(tokenId)
          .then((owner) => {
            setOwner(owner);
          })
          .catch((err) => {
            console.log("owner not exist");
          });
      });
  }, []);

  return nftContract && metadata ? (
    <NFTTemplate metadata={metadata} nftContract={nftContract} sale={sale} owner={owner} />
  ) : (
    <></>
  );
};

export default NFT;
