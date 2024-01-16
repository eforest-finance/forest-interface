export const tokenContract = '';
export const NFTContract = '';
// The next two need to be given a value that will not give an error
export const NFTMarketContract = '';
export const whiteListContract = '';
export const MultiTokenContract = '';

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

// Configure the link here
export const CHAIN_INFO = {
  chainId: 'AELF',
  exploreUrl: '',
  rpcUrl: '',
};

export const CHAIN_ID = 'AELF';
