import axios from "axios";

// console.log(axios);
import mock from "../__fixtures__/mock.api.json";

const isMock = process.env.NODE_ENV == "development";

export const getShop = async (chainID: string, nftContractAddress: string) => {
  if (isMock) {
    return { metadataList: mock.metadata, nftContract: mock.nftContract };
  } else {
    return { metadataList: mock.metadata, nftContract: mock.nftContract };
  }
};

export const getNFT = async (chainID: string, nftContractAddress: string, tokenId: string) => {
  if (isMock) {
    return { metadata: mock.metadata[0], nftContract: mock.nftContract };
  } else {
    return { metadata: mock.metadata[0], nftContract: mock.nftContract };
  }
};
