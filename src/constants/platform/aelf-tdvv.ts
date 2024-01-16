export const tokenContract = '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX';
export const NFTContract = '2iNerrufZ7rQsj5Ea6Rpbi9G4GMNyTMNe9CBhBUocE9JHnUYJC';
export const NFTMarketContract = 'zif9un2sHyRFwFfZbpmWM9bqHi5eeCc1fHyeQ7Bvn5b92Sx9N';
export const whiteListContract = '2LsUPSKq6A2GqKQoncWTqfNSsM14dGSkKsYoSy2u8go8ZdohCx';

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

export const CHAIN_INFO = {
  chainId: 'tDVV',
  exploreUrl: 'https://tdvv-explorer.aelf.io/',
  // rpcUrl: 'https://tdvv-explorer.aelf.io/chain',
  // rpcUrl: 'https://tdvw-node.aelf.io',
  // exploreUrl: 'https://explorer.aelf.io/',
  rpcUrl: 'https://tdvv-explorer.aelf.io/chain',
  // rpcUrl: 'https://tdvw-node.aelf.io',
};

export const CHAIN_ID = 'tDVV';
