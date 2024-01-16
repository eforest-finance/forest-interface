export const tokenContract = 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE';
export const NFTContract = 'DHo2K7oUXXq3kJRs1JpuwqBJP56gqoaeSKFfuvr9x8svf3vEJ';
export const NFTMarketContract = 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE';
export const whiteListContract = 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE';

export const LOGIN_INFO = {
  chainId: 'AELF',
  payload: {
    method: 'LOGIN',
    contracts: [
      {
        chainId: 'AELF',
        contractAddress: tokenContract,
        contractName: 'Token contract',
        description: 'You can transfer, approve, get balance, etc.',
        github: 'https://github.com/AElfProject/AElf/blob/dev/protobuf/token_contract.proto',
      },
      {
        chainId: 'AELF',
        contractAddress: NFTContract,
        contractName: 'NFT contract',
        description: 'You can transfer, approve, get balance, etc.',
        github: '-',
      },
      {
        chainId: 'AELF',
        contractAddress: NFTMarketContract,
        contractName: 'NFT Market contract',
        description: 'You can swap, etc.',
        github: '-',
      },
      {
        chainId: 'AELF',
        contractAddress: whiteListContract,
        contractName: 'Whitelist contract',
        description: '',
        github: '-',
      },
    ],
  },
};

export const CHAIN_INFO = {
  chainId: 'AELF',
  exploreUrl: 'https://explorer.aelf.io/',
  // rpcUrl: 'https://explorer.aelf.io/chain',
  rpcUrl: 'https://explorer.aelf.io/chain',
  // exploreUrl: 'https://explorer.aelf.io/',
  // rpcUrl: 'http://192.168.66.251:8000',
  // rpcUrl: 'http://54.199.254.157:8000',
};

export const CHAIN_ID = 'AELF';
