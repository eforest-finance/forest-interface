export const tokenContract = '';
export const NFTContract = '';
export const NFTMarketContract = '';
export const whiteListContract = '';
export const MultiTokenContract = '';

export const LOGIN_INFO = {
  chainId: 'tDVV',
  payload: {
    method: 'LOGIN',
    contracts: [
      {
        chainId: 'tDVV',
        contractAddress: tokenContract,
        contractName: 'Token contract',
        description: 'You can transfer, approve, get balance, etc.',
        github: 'https://github.com/AElfProject/AElf/blob/dev/protobuf/token_contract.proto',
      },
      {
        chainId: 'tDVV',
        contractAddress: NFTContract,
        contractName: 'NFT contract',
        description: 'You can transfer, approve, get balance, etc.',
        github: '-',
      },
      {
        chainId: 'tDVV',
        contractAddress: NFTMarketContract,
        contractName: 'NFT Market contract',
        description: 'You can swap, etc.',
        github: '-',
      },
      {
        chainId: 'tDVV',
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
  chainId: 'tDVV',
  exploreUrl: '',
  rpcUrl: '',
};

export const CHAIN_ID = 'tDVV';
