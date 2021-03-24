import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import Web3 from "web3";
import Web3Modal from "web3modal";
import { abi as chocoshopAbi } from "../../../contracts/artifacts/contracts/Chocoshop.sol/Chocoshop.json";
import { abi as erc721Abi } from "../../../contracts/artifacts/contracts/mock/MockNFT.sol/MockNft.json";
import chainIdConfig from "../../../contracts/chainIds.json";
import { NetworkName, ChainId } from "../../../contracts/helpers/types";
import networkConfig from "../../../contracts/networks.json";
import { Chocoshop, MockNft } from "../../../contracts/typechain";

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "95f65ab099894076814e8526f52c9149",
    },
  },
};

export const web3Modal = new Web3Modal({
  providerOptions,
});

export const initializeWeb3Modal = async () => {
  const web3ModalProvider = await web3Modal.connect();
  await web3ModalProvider.enable();
  return web3ModalProvider;
};

export const clearWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
};

export const getEthersSigner = async (provider: any) => {
  const web3EthersProvider = new ethers.providers.Web3Provider(provider);
  return web3EthersProvider.getSigner();
};

// this is only used for signing because torus wallet sign fails for ethers
export const getWeb3 = async (provider: any) => {
  return new Web3(provider);
};

export const getNetworkNameFromChainId = (chainId: ChainId): NetworkName => {
  return chainIdConfig[chainId] as NetworkName;
};

export const getContractsForChainId = (chainId: ChainId) => {
  const networkName = getNetworkNameFromChainId(chainId);
  const { chocoshop, rpc, explore } = networkConfig[networkName];
  const provider = new ethers.providers.JsonRpcProvider(rpc);

  const chocoshopContract = new ethers.Contract(chocoshop, chocoshopAbi, provider) as Chocoshop;

  // this takes null address because it requires address from path
  const erc721Contract = new ethers.Contract(
    "0x0000000000000000000000000000000000000000",
    erc721Abi,
    provider
  ) as MockNft;
  return { chocoshopContract, erc721Contract, explore, provider };
};
