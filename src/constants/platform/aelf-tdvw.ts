export const tokenContract = 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx';
export const NFTContract = '2ZpYFeE4yWjrcKLBoj1iwbfYnbo9hK7exvfGTdqcq77QSxpzNH';
export const NFTMarketContract = 'JQkVTWz5HXxEmNXzTtsAVHC7EUTeiFktzoFUu9TyA6MWngkem';
export const whiteListContract = 'aceGtyU2fVcBkViZcaqZXHHjd7eNAJ6NPwbuFwhqv6He49BS1';

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

export const CHAIN_INFO = {
  chainId: 'tDVW',
  exploreUrl: 'https://explorer-test-side02.aelf.io/',
  rpcUrl: 'https://tdvw-test-node.aelf.io',
};

export const CHAIN_ID = 'tDVW';
