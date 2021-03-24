import React from "react";
import { shortenText } from "../../modules/util";
import { Metadata, NFTContract } from "../../types";
import { Button } from "../atoms/Button";
import { Shares } from "../molecules/Shares";

export interface NFT {
  nftContract: NFTContract;
  metadata: Metadata;
}

export const NFT: React.FC<NFT> = ({ metadata, nftContract }) => {
  const buy = () => {
    console.log(buy);
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
            <div>
              <p className="text-lg text-gray-500 font-medium">Buy Price</p>
              <p className="text-2xl sm:text-3xl text-gray-700 font-medium">PRICE</p>
            </div>
          </div>
          <div className="mb-4">
            <div className="grid grid-cols-2 space-x-2">
              <Button onClick={buy}>
                <div className="flex justify-center items-center">Buy</div>
              </Button>
            </div>
          </div>
          <Shares />
        </div>
      </div>
    </section>
  );
};

export default NFT;
