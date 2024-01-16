import { INftInfo } from 'types/nftTypes';

const isTokenIdReuse = (nftInfo: INftInfo) => {
  const symbolNumber = nftInfo?.nftSymbol && nftInfo.nftSymbol.split('-')[1];
  if (symbolNumber) {
    const totalSupply = nftInfo?.totalQuantity;
    return symbolNumber !== '0' && totalSupply > 1; // true is 1155; false is 721
  } else {
    console.error('Invalid symbol.');
  }
};

export default isTokenIdReuse;
