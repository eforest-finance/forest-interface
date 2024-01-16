export const tokenContract = '';
export const NFTContract = '';
export const NFTMarketContract = '';
export const whiteListContract = '';
export const MultiTokenContract = '';

export const LOGIN_INFO = {
  chainId: 'tDVW',
  payload: {
    method: 'LOGIN',
    contracts: [
      {
        chainId: 'tDVW',
        contractAddress: tokenContract,
        contractName: 'Token contract',
        description: 'You can transfer, approve, get balance, etc.',
        github: 'https://github.com/AElfProject/AElf/blob/dev/protobuf/token_contract.proto',
      },
      {
        chainId: 'tDVW',
        contractAddress: NFTContract,
        contractName: 'NFT contract',
        description: 'You can transfer, approve, get balance, etc.',
        github: '-',
      },
      {
        chainId: 'tDVW',
        contractAddress: NFTMarketContract,
        contractName: 'NFT Market contract',
        description: 'You can swap, etc.',
        github: '-',
      },
      {
        chainId: 'tDVW',
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
  chainId: 'tDVW',
  exploreUrl: '',
  rpcUrl: '',
};

export const CHAIN_ID = 'tDVW';
