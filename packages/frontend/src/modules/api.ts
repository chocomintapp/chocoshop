import axios from "axios";

// console.log(axios);
import mock from "../__fixtures__/mock.api.json";

const isMock = false; //process.env.NODE_ENV == "development";

export const getShop = async (chainID: string, nftContractAddress: string) => {
  if (isMock) {
    return { metadataList: mock.metadata, nftContract: mock.nftContract };
  } else {
    const response = await axios.get(`https://factory.chocomint.app/metadata/${chainID}/${nftContractAddress}`);
    const { metadata, contract } = response.data;
    return { metadataList: metadata, nftContract: contract };
  }
};

export const getNFT = async (chainID: string, nftContractAddress: string, tokenId: string) => {
  if (isMock) {
    return { metadata: mock.metadata[0], nftContract: mock.nftContract };
  } else {
    const contractResponse = await axios.get(`https://factory.chocomint.app/metadata/${chainID}/${nftContractAddress}`);
    const { contract } = contractResponse.data;
    const metadataResponse = await axios.get(
      `https://factory.chocomint.app/metadata/${chainID}/${nftContractAddress}/${tokenId}`
    );
    return { metadata: metadataResponse.data, nftContract: contract };
  }
};
