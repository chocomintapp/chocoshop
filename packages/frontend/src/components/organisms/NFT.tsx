import { ethers } from "ethers";
import React from "react";
import { ChainId } from "../../../../contracts/helpers/types";
import { shortenText } from "../../modules/util";
import { getContractsForChainId, getNetworkNameFromChainId } from "../../modules/web3";
import { Metadata, NFTContract, Sale } from "../../types";
import { Button } from "../atoms/Button";
import { FormInput } from "../molecules/FormInput";
import { Shares } from "../molecules/Shares";
import { useLoadingOverlay, useMessageModal, useNotificationToast } from "../utils/hooks";
import { useWallet } from "../utils/hooks";

export interface NFT {
  nftContract: NFTContract;
  metadata: Metadata;
  sale?: Sale;
  owner?: string;
}

export const NFT: React.FC<NFT> = ({ metadata, nftContract, sale, owner }) => {
  const [inputPrice, setInputPrice] = React.useState("");

  const { connectWallet, userAddress } = useWallet();
  const { openNotificationToast } = useNotificationToast();
  const { openLoadingOverlay, closeLoadingOverlay } = useLoadingOverlay();

  const signIn = async () => {
    try {
      openLoadingOverlay();
      await connectWallet();
      closeLoadingOverlay();
    } catch (err) {
      closeLoadingOverlay();
      openNotificationToast({ type: "error", text: err.message });
    }
  };

  const buy = async () => {
    if (!sale) {
      return;
    }
    const { signerAddress, signer } = await connectWallet();
    const { chocoshopContract, explore, provider } = getContractsForChainId(nftContract.chainId as ChainId);
    await chocoshopContract
      .connect(signer)
      .purchase(nftContract.nftContractAddress, (metadata as any).token_id, { value: sale.price });
  };

  const cancel = async () => {
    if (!sale) {
      return;
    }
    const { signerAddress, signer } = await connectWallet();
    const { chocoshopContract, explore, provider } = getContractsForChainId(nftContract.chainId as ChainId);
    await chocoshopContract.connect(signer).cancel(nftContract.nftContractAddress, (metadata as any).token_id);
  };

  const sell = async () => {
    console.log(metadata);
    console.log("sell");
    const { chocoshopContract, erc721Contract, explore, provider } = getContractsForChainId(
      nftContract.chainId as ChainId
    );
    console.log(chocoshopContract, erc721Contract, explore, provider);
    const { signerAddress, signer } = await connectWallet();
    const signerNetwork = await signer.provider.getNetwork();
    if (nftContract.chainId != signerNetwork.chainId.toString()) {
      const networkName = getNetworkNameFromChainId(nftContract.chainId);
      openNotificationToast({ type: "error", text: `Please connect ${networkName} network` });
      return;
    }

    const value = ethers.utils.parseEther(inputPrice).toString();

    await erc721Contract
      .attach(nftContract.nftContractAddress)
      .connect(signer)
      ["safeTransferFrom(address,address,uint256,bytes)"](
        signerAddress,
        chocoshopContract.address,
        (metadata as any).token_id,
        ethers.utils.defaultAbiCoder.encode(["uint256"], [value])
      );
  };

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 flex">
        <div className="p-4 flex justify-center sm:justify-end relative">
          <div className="flex w-full sm:justify-end">
            <img className="object-cover max-h-96 max-w-m h-full solidity" src={metadata.image} />
          </div>
        </div>
        <div className="p-4 w-full sm:w-7/12 flex justify-start flex-col">
          <p className="break-all text-gray-700 text-5xl sm:text-7xl font-medium mt-2 mb-2">
            {shortenText(metadata.name, 20)}
          </p>
          <p className="break-all text-gray-400 text-xs font-medium mb-4">{metadata.description}</p>
          <div className="grid grid-cols-2 mb-4">
            {sale ? (
              <>
                <div>
                  <p className="text-lg text-gray-500 font-medium">Price</p>
                  <p className="text-2xl sm:text-3xl text-gray-700 font-medium">
                    {sale.price && ethers.utils.formatEther(sale.price)}
                  </p>
                </div>
              </>
            ) : (
              <>
                {owner == userAddress ? (
                  <div>
                    <p className="text-lg text-gray-500 font-medium">Sell Price</p>
                    <FormInput value={inputPrice} setState={setInputPrice} type="number" placeholder="MATIC" />
                  </div>
                ) : (
                  <p className="text-lg text-gray-500 font-medium">Not on Sale</p>
                )}
              </>
            )}
          </div>
          <div className="mb-4">
            {userAddress ? (
              <>
                {sale ? (
                  <>
                    {sale.from != userAddress ? (
                      <div className="grid grid-cols-2 space-x-2">
                        <Button onClick={buy}>
                          <div className="flex justify-center items-center">Buy</div>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 space-x-2">
                        <Button onClick={cancel}>
                          <div className="flex justify-center items-center">Cancel</div>
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {owner == userAddress ? (
                      <div className="grid grid-cols-2 space-x-2">
                        <Button onClick={sell}>
                          <div className="flex justify-center items-center">Sell</div>
                        </Button>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="grid grid-cols-2 space-x-2">
                <Button onClick={signIn}>
                  <div className="flex justify-center items-center">Connect</div>
                </Button>
              </div>
            )}
          </div>
          <Shares />
        </div>
      </div>
    </section>
  );
};

export default NFT;
